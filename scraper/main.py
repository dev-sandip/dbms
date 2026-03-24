import json
import xml.etree.ElementTree as ET
import requests
import re
import unicodedata
from typing import List, Dict, Set

def slugify(text: str) -> str:
    """Convert title (Nepali or English) to URL-friendly slug"""
    # Normalize and remove diacritics
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    # Keep only alphanumeric + spaces + hyphen
    text = re.sub(r'[^a-zA-Z0-9\s-]', '', text.lower().strip())
    text = re.sub(r'\s+', '-', text)
    return text[:100]  # reasonable length


def clean_text(text: str | None) -> str:
    """Clean extracted text"""
    return (text or "").strip()


def clean_html(html: str) -> str:
    """Minimal HTML cleanup"""
    if not html:
        return ""
    return re.sub(r'\s+', ' ', html.strip())


def fetch_rss_content(rss_url: str) -> str:
    """Fetch RSS XML from URL"""
    try:
        response = requests.get(rss_url, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        raise RuntimeError(f"Failed to fetch RSS from {rss_url}: {e}")


def get_unique_categories_from_rss(rss_url: str) -> Set[str]:
    """
    Only collect all unique category names from the RSS feed.
    Useful for you to see what categories exist before mapping.
    """
    xml_content = fetch_rss_content(rss_url)
    root = ET.fromstring(xml_content)

    categories = set()

    for item in root.findall('.//item'):
        for cat in item.findall('category'):
            if cat.text:
                categories.add(cat.text.strip())

    return categories


def parse_onlinekhabar_rss_to_json(
    rss_url: str,
    default_author_id: str = "unknown",
    category_mapping: Dict[str, str] = None
) -> List[Dict]:
    """
    Parse Online Khabar RSS feed into your desired JSON format.
    
    Args:
        rss_url:            Full RSS feed URL (e.g. https://www.onlinekhabar.com/feed)
        default_author_id:  Author ID you want to assign to all articles
        category_mapping:   dict like {"अन्तर्राष्ट्रिय समाचार": "international", ...}
                            If not provided or category not found → uses "general"
    
    Returns:
        List of articles in your requested format
    """
    if category_mapping is None:
        category_mapping = {}

    xml_content = fetch_rss_content(rss_url)
    root = ET.fromstring(xml_content)

    ns = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'dc': 'http://purl.org/dc/elements/1.1/',
    }

    articles = []

    for item in root.findall('.//item'):
        title_el     = item.find('title')
        desc_el      = item.find('description')
        content_el   = item.find('content:encoded', ns)
        image_el     = item.find('image')           # custom field in their feed

        title = clean_text(title_el.text)
        if not title:
            continue

        slug = slugify(title)

        excerpt = clean_text(desc_el.text)
        if excerpt and len(excerpt) > 320:
            excerpt = excerpt[:317] + "..."

        body = clean_html(clean_text(content_el.text if content_el is not None else ""))

        cover_image = clean_text(image_el.text) if image_el is not None else ""
        cover_alt   = f"Cover image: {title[:70]}" if cover_image else ""

        # Category logic
        found_categories = [c.text.strip() for c in item.findall('category') if c.text]
        mapped_category = "general"

        for cat_name in found_categories:
            if cat_name in category_mapping:
                mapped_category = category_mapping[cat_name]
                break

        article = {
            "title": title,
            "titleNp": title,  # assuming feed is already in Nepali
            "slug": slug,
            "excerpt": excerpt,
            "body": body,
            "coverImage": cover_image,
            "coverImageAlt": cover_alt,
            "authorId": default_author_id,
            "categoryId": mapped_category,  # ← this is the key you will later replace with real DB ID
            "status": "draft",
            "isFeatured": any("विशेष" in c or "प्रमुख" in c for c in found_categories),
            "isBreaking": any("प्रमुख समाचार" in c or "breaking" in title.lower() for c in found_categories),
            "views": 0
        }

        articles.append(article)

    return articles


# ────────────────────────────────────────────────
# Example usage
# ────────────────────────────────────────────────

if __name__ == "__main__":
    RSS_URL = "https://www.onlinekhabar.com/rss"

    # 1. First: see what categories actually exist in this feed
    print("Fetching unique categories...")
    unique_cats = get_unique_categories_from_rss(RSS_URL)
    print("Unique categories found:")
    for cat in sorted(unique_cats):
        print(f"  • {cat}")

    # 2. Your planned mapping (edit this as you wish)
    MY_CATEGORY_MAPPING = {
        "अन्तर्राष्ट्रिय समाचार": "international",
        "विशेष": "featured",
        "प्रमुख समाचार (Home)": "breaking",
        "मनोरञ्जन प्रमुख": "entertainment",
        "खेलकुद": "sports",
        "बिजनेस विशेष": "business",
        "विजनेश होम": "business",
        "राष्ट्रिय समाचार": "national",
        "प्रदेश समाचार": "province",
        "अन्तर्वार्ता": "interview",
        "हेल्थ फिचर": "health",
        # add more as needed
    }

    # 3. Parse articles
    print("\nParsing articles...")
    articles = parse_onlinekhabar_rss_to_json(
        rss_url=RSS_URL,
        default_author_id="onlinekhabar-team",   # ← change to whatever you want
        category_mapping=MY_CATEGORY_MAPPING
    )

    # 4. Save / preview
    with open("articles_export.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    print(f"\nSaved {len(articles)} articles to articles_export.json")
    print("First article preview:")
    print(json.dumps(articles[0], indent=2, ensure_ascii=False))