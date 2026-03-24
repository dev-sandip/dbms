# 🗞️ Nepali News Website — Conversion Plan

> **Goal:** Convert a prebuilt web app into a fully functional Nepali news website with three core content types: **Category Articles**, **Featured Articles**, and **Breaking Articles**. No ads. Clean, editorial design.
Note : this is just a basic idea no need to striclty follow it change it by taking idea from this.




## 📰 Phase 2 — Breaking Articles Section

**Purpose:** Show real-time or urgent news at the very top.

### 2.1 — Ticker Bar (Top Strip)
- Add a red scrolling ticker bar below the header
- Label it `ब्रेकिङ` (Breaking)
- Animate headlines left-to-right using CSS `@keyframes`



### 2.2 — Breaking Cards Grid
- Display 3–4 breaking news cards in a responsive grid
- Each card has:
  - Red left border (`border-left: 4px solid #c0392b`)
  - `ब्रेकिङ` badge (red pill)
  - Timestamp (e.g., `२ घण्टा अगाडि`)
  - Headline in Devanagari
  - Short summary text

### 2.3 — Data Shape (`breaking.json`)
 
```json
[
  {
    "id": 1,
    "time": "२ घण्टा अगाडि",
    "title": "काठमाडौंमा भारी वर्षाको चेतावनी",
    "body": "मौसम विभागले अर्को ४८ घण्टामा भारी वर्षा हुने जनाएको छ।",
    "category": "मौसम"
  }
]
```

---

## ⭐ Phase 3 — Featured Articles Section

**Purpose:** Highlight 4–5 editorial picks with large imagery.

### 3.1 — Hero + Sidebar Layout
```
[ Large Featured Hero (60%) ] [ Sidebar Stack (40%) ]
```
- Hero: Full-width image, gold top border, category pill, large Devanagari headline
- Sidebar: 3 smaller cards stacked vertically with thumbnail + text

### 3.2 — Styling Rules
- Use `border-top: 4px solid #c9962a` (gold) for featured distinction
- Category pill in gold (`color: #c9962a`)
- Image hover removes grayscale filter (`filter: grayscale(0%)`)

### 3.3 — Data Shape (`featured.json`)
```json
[
  {
    "id": 1,
    "title": "प्रधानमन्त्रीको भारत भ्रमण",
    "body": "दुई देशबीच ऊर्जा र पारवहन सम्झौता भयो।",
    "category": "राजनीति",
    "time": "आज बिहान",
    "image": "/assets/images/pm-visit.jpg",
    "fullBody": "<p>पूरा विवरण यहाँ...</p>"
  }
]
```

---

## 📂 Phase 4 — Category Articles Section

**Purpose:** Browse all articles filtered by topic.

### 4.1 — Category Navigation Tabs
Add tab bar with these categories:

| Nepali Label | Key |
|---|---|
| सबै | `all` |
| राजनीति | `politics` |
| अर्थतन्त्र | `economy` |
| खेलकुद | `sports` |
| प्रविधि | `tech` |
| विश्व | `world` |
| मनोरञ्जन | `entertainment` |

### 4.2 — Article Card Grid
- Responsive grid: `repeat(auto-fill, minmax(260px, 1fr))`
- Each card has: image, category pill (red), Devanagari headline, summary, timestamp
- Click → opens article in a modal reader

### 4.3 — Filter Logic (JavaScript)
```js
function filterCat(key) {
  const filtered = key === 'all'
    ? ALL_ARTICLES
    : ALL_ARTICLES.filter(a => a.catKey === key);
  renderArticles(filtered);
}
```

### 4.4 — Data Shape (`articles.json`)
```json
[
  {
    "id": 1,
    "title": "नेपाल–चीन रेलमार्गको सम्भाव्यता अध्ययन",
    "body": "रेलमार्ग अध्ययन अन्तिम चरणमा पुगेको छ।",
    "category": "अर्थतन्त्र",
    "catKey": "economy",
    "time": "आज",
    "image": "/assets/images/railway.jpg",
    "fullBody": "<p>विस्तृत समाचार यहाँ...</p>"
  }
]
```

---

## 🖥️ Phase 5 — Header & Navigation

- [ ] Masthead with site name in Devanagari: `नेपाल समाचार`
- [ ] Tagline: `Nepal's Voice Since 2024`
- [ ] Display current Nepali date using `toLocaleDateString('ne-NP')`
- [ ] Search bar (top-right) with live filter across all articles
- [ ] Main nav bar (dark background): links to each category section

```html
<nav>
  <a href="#home">गृहपृष्ठ</a>
  <a href="#politics">राजनीति</a>
  <a href="#economy">अर्थतन्त्र</a>
  <a href="#sports">खेलकुद</a>
  <a href="#tech">प्रविधि</a>
  <a href="#world">विश्व</a>
  <a href="#entertainment">मनोरञ्जन</a>
</nav>
```

---

## 📖 Phase 6 — Article Modal Reader

- [ ] Clicking any article card opens a full-screen modal overlay
- [ ] Modal contains: category pill, headline, author/date meta, hero image, full body text
- [ ] Close via ✕ button or clicking outside the modal
- [ ] Animate in with `slideUp` keyframe

---

## 🎨 Phase 7 — Design Tokens (CSS Variables)

Add to `:root` in `style.css`:

```css
:root {
  --red:            #c0392b;   /* Breaking news accent */
  --dark-red:       #922b21;   /* Breaking label bg */
  --ink:            #1a1008;   /* Primary text */
  --paper:          #faf6f0;   /* Page background */
  --warm-gray:      #e8e0d5;   /* Borders, dividers */
  --accent-gold:    #c9962a;   /* Featured accent */
  --muted:          #7a6e62;   /* Secondary text */
}
```

---

## 🌐 Phase 8 — Footer

- [ ] Dark footer with 4 columns: About, Sections, Company, Social
- [ ] All text in Nepali
- [ ] Copyright line: `© २०२४ नेपाल समाचार। सर्वाधिकार सुरक्षित।`
- [ ] Include "no ads" statement: `कुनै विज्ञापन छैन`

---

## ✅ Phase 9 — QA Checklist

- [ ] All headlines render correctly in Devanagari on mobile
- [ ] Ticker animation loops seamlessly
- [ ] Category filter correctly shows/hides articles
- [ ] Featured hero and sidebar images load with fallback
- [ ] Modal opens and closes without scroll-lock issues
- [ ] No ad scripts remain in `<head>` or `<body>`
- [ ] Page passes basic accessibility check (alt text, contrast)
- [ ] Date displays in Nepali locale (`ne-NP`)
- [ ] Site works offline with static JSON data

---

## 📌 Summary

| Section | Type | Color Accent | Location |
|---|---|---|---|
| ब्रेकिङ समाचार | Breaking Articles | Red `#c0392b` | Top of page |
| विशेष समाचार | Featured Articles | Gold `#c9962a` | Middle |
| ताजा समाचार | Category Articles | Red `#c0392b` | Below featured |

**No ads. No trackers. Pure editorial.**