declare module '../scripts/parser.mjs' {
  export function parseHomepage(html: string): {
    news: Array<{ title: string; date: string }>
    announcements: Array<{ title: string; date: string }>
  }
  export function parseArticle(
    html: string,
    id: string,
    category: string,
  ): {
    id: string
    category: string
    title: string
    date: string
    content: Array<{ type: string; value: string }>
  }
}
