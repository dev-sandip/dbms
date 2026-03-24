import { useEffect, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminHeader } from '#/components/layout/admin-header'
import { RichTextEditor } from '#/components/richtext/rich-text-editor'
import { Button } from '#/components/ui/button'
import {
  useArticleByIdQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
} from '#/server/rest-api/article'
import type { ArticleStatus } from '#/server/rest-api/article'
import { useUser } from '#/server/rest-api/auth'
import { useCategoriesQuery } from '#/server/rest-api/category'

export const Route = createFileRoute('/admin/articles/$id')({
  component: AdminEditArticlePage,
})

function AdminEditArticlePage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()

  const { data: article, isLoading, error } = useArticleByIdQuery(id)

  const createMutation = useCreateArticleMutation()
  const deleteMutation = useDeleteArticleMutation()
  const user = useUser() as { id?: string; role?: string } | null
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoriesQuery()
  const [title, setTitle] = useState('')
  const [titleNp, setTitleNp] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [bodyHtml, setBodyHtml] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageAlt, setCoverImageAlt] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<ArticleStatus>('draft')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBreaking, setIsBreaking] = useState(false)
  const [views, setViews] = useState('0')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!article) return
    setTitle(article.title)
    setTitleNp(article.titleNp ?? '')
    setSlug(article.slug)
    setExcerpt(article.excerpt ?? '')
    setBodyHtml(article.body)
    setCoverImage(article.coverImage ?? '')
    setCoverImageAlt(article.coverImageAlt ?? '')
    setCategoryId(
      typeof article.categoryId === 'number' ? String(article.categoryId) : '',
    )
    setStatus(article.status)
    setIsFeatured(Boolean(article.isFeatured))
    setIsBreaking(Boolean(article.isBreaking))
    setViews(String(article.views))
  }, [article?.id])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Edit Article</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Save will “delete and recreate” because there is no `PUT
              /article/:id` endpoint yet.
            </p>
          </div>
          <div className="text-sm">
            <Link to="/admin/articles" className="underline underline-offset-4">
              Back to list
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Loading article...
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-destructive">
            {error.message}
          </div>
        ) : !article ? (
          <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            Article not found.
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault()
              setFormError(null)
              try {
                // API limitation: no update endpoint. Recreate instead.
                if (!user?.id) {
                  setFormError('Please sign in as admin to update articles.')
                  return
                }

                const trimmedCategoryId = categoryId.trim()

                // Check if a category ID was selected
                if (!trimmedCategoryId) {
                  setFormError(
                    'Selected category is invalid. Please choose again.',
                  )
                  return
                }

                // Now you can safely use the string ID
                const categoryIdPayload = trimmedCategoryId

                console.log({ categoryIdPayload })
                const payload = {
                  title,
                  titleNp,
                  slug,
                  excerpt: excerpt.trim() ? excerpt : undefined,
                  body: bodyHtml,
                  coverImage: coverImage.trim() ? coverImage : undefined,
                  coverImageAlt: coverImageAlt.trim()
                    ? coverImageAlt
                    : undefined,
                  categoryId: categoryIdPayload,
                  status,
                  isFeatured,
                  isBreaking,
                  views: Number.parseInt(views || '0', 10) || 0,
                  authorId: user.id,
                }
                await deleteMutation.mutateAsync(id)
                await createMutation.mutateAsync(payload)
                navigate({ to: '/admin/articles' })
              } catch (err) {
                setFormError((err as Error).message)
              }
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm">Title (English)</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm">Title (Nepali)</span>
                <input
                  value={titleNp}
                  onChange={(e) => setTitleNp(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm font-nepali outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm">Slug</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm">Excerpt</span>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm">Cover Image URL</span>
                <input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
              <label className="block">
                <span className="text-sm">Cover Image Alt</span>
                <input
                  value={coverImageAlt}
                  onChange={(e) => setCoverImageAlt(e.target.value)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm">Category (optional)</span>
                {categoriesError ? (
                  <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                    {categoriesError.message}
                  </div>
                ) : null}
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  disabled={categoriesLoading}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring font-nepali"
                >
                  <option value="" className="font-sans">
                    No category
                  </option>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameNp}
                    </option>
                  ))}
                </select>
                <div className="mt-1 text-xs text-muted-foreground">
                  Leave empty if you don&apos;t want to set a category.
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="block md:col-span-1">
                <span className="text-sm">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </label>

              <label className="block md:col-span-1">
                <span className="text-sm">Featured</span>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <span className="text-sm">Mark as featured</span>
                </div>
              </label>

              <label className="block md:col-span-1">
                <span className="text-sm">Breaking</span>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                  />
                  <span className="text-sm">Mark as breaking</span>
                </div>
              </label>

              <label className="block md:col-span-3">
                <span className="text-sm">Views</span>
                <input
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  inputMode="numeric"
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Body (Rich Text)</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Stores HTML into `body` on the backend.
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Nepali will use `font-nepali` on the reader pages.
                </div>
              </div>
              <div className="mt-3">
                <RichTextEditor
                  value={bodyHtml}
                  onChange={setBodyHtml}
                  placeholder="Write your article..."
                />
              </div>
            </div>

            {formError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {formError}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={createMutation.isPending || deleteMutation.isPending}
              >
                {createMutation.isPending || deleteMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
