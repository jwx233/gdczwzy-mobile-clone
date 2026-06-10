export interface NavigationItem {
  label: string
  href?: string
  children?: NavigationItem[]
}

export interface ArticleSummary {
  id: string
  category: 'news' | 'announcement'
  title: string
  date: string
  image?: string
  externalUrl?: string
}

export interface ArticleDetail extends ArticleSummary {
  content: Array<{ type: 'paragraph' | 'image'; value: string }>
}

export interface Banner {
  image: string
  alt: string
}

export interface Topic {
  title: string
  image: string
  href?: string
}

export interface SiteSnapshot {
  syncedAt: string
  sourceUrl: string
  navigation: NavigationItem[]
  banners: Banner[]
  news: ArticleSummary[]
  announcements: ArticleSummary[]
  topics: Topic[]
  articles: ArticleDetail[]
}
