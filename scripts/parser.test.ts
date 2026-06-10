import { describe, expect, it } from 'vitest'
import { articleId, parseArticle, parseHomepage } from './parser.mjs'

describe('content parser', () => {
  it('extracts homepage news and announcements', () => {
    const result = parseHomepage(`<div class="news_fr"><li><a href="x.htm" title="新闻标题"></a><p>2026-06-10</p></li></div><div class="tzgg"><li><a href="/info/1017/10501.htm" title="公告标题"><h1>公告标题</h1><p class="year">2026-06-09</p></a></li></div>`)
    expect(result.news[0].title).toBe('新闻标题')
    expect(result.announcements[0].date).toBe('2026-06-09')
    expect(result.announcements[0].id).toBe('announcement-10501')
    expect(result.announcements[0].externalUrl).toBeUndefined()
  })

  it('keeps external links external and derives stable local ids', () => {
    expect(articleId('news', '/info/1016/10391.htm')).toBe('news-10391')
    const result = parseHomepage(`<div class="news_silde"><div class="sli_hov"><a href="https://mp.weixin.qq.com/s/example"><img src="/news.jpg"></a></div></div><div class="news_fr"><li><a href="https://mp.weixin.qq.com/s/example" title="微信新闻"></a><p>2026-06-10</p></li></div>`)
    expect(result.news[0].externalUrl).toBe('https://mp.weixin.qq.com/s/example')
    expect(result.news[0].image).toBe('https://42.247.64.68/news.jpg')
  })

  it('extracts article title, date and paragraphs', () => {
    const result = parseArticle(`<div class="content"><h2 class="tit">文章标题</h2><p class="wzxx">发布时间：2026-06-10</p><div id="vsb_content"><p>正文内容</p></div></div>`, 'id-1', 'news')
    expect(result.title).toBe('文章标题')
    expect(result.date).toBe('2026-06-10')
    expect(result.content[0].value).toBe('正文内容')
  })
})
