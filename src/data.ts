import snapshotJson from './data/site-snapshot.json'
import type { ArticleSummary, SiteSnapshot } from './types'

export const snapshot = snapshotJson as SiteSnapshot

export function allArticles(): ArticleSummary[] {
  return [...snapshot.news, ...snapshot.announcements]
}

export function findArticle(id: string) {
  return snapshot.articles.find((article) => article.id === id)
}

export function searchArticles(query: string) {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return []
  return allArticles().filter((article) =>
    article.title.toLocaleLowerCase().includes(normalized),
  )
}
