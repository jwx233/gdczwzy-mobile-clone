import { describe, expect, it } from 'vitest'
import { allArticles, findArticle, searchArticles } from './data'

describe('site snapshot helpers', () => {
  it('combines all searchable articles', () => expect(allArticles().length).toBeGreaterThan(5))
  it('finds a synced internal article', () => expect(findArticle('announcement-10501')?.category).toBe('announcement'))
  it('searches titles and handles empty terms', () => {
    expect(searchArticles('志愿').length).toBeGreaterThan(0)
    expect(searchArticles('   ')).toEqual([])
  })
})
