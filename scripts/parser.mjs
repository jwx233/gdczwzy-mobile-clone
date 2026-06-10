import * as cheerio from 'cheerio'

export const SOURCE = 'https://42.247.64.68/'

export function absoluteUrl(value = '') {
  if (!value || value === '#') return undefined
  return new URL(value, SOURCE).href
}

export function articleId(category, href = '', index = 0) {
  const sourcePath = new URL(href || `item-${index}`, SOURCE).pathname
  const numericId = sourcePath.match(/(\d+)(?:\.htm)?$/)?.[1]
  return `${category}-${numericId ?? index}`
}

function externalUrl(href = '') {
  if (!href) return undefined
  const url = new URL(href, SOURCE)
  return url.origin === new URL(SOURCE).origin ? undefined : url.href
}

export function parseHomepage(html) {
  const $ = cheerio.load(html)
  const newsImages = new Map()
  $('.news_silde .sli_hov').each((_, element) => {
    const link = $(element).find('a').first()
    newsImages.set(link.attr('href'), absoluteUrl($(element).find('img').attr('src')))
  })
  const news = $('.news_fr li').map((index, element) => {
    const link = $(element).find('a').first()
    const href = link.attr('href')
    return { id: articleId('news', href, index), category: 'news', title: link.attr('title') || link.text().trim(), date: $(element).find('p').text().trim(), image: newsImages.get(href), externalUrl: externalUrl(href) }
  }).get()
  const announcements = $('.tzgg li').map((index, element) => {
    const link = $(element).find('a').first()
    const href = link.attr('href')
    return { id: articleId('announcement', href, index), category: 'announcement', title: link.attr('title') || $(element).find('h1').text().trim(), date: $(element).find('.year').text().trim(), externalUrl: externalUrl(href) }
  }).get()
  const topics = $('.ztrd li').map((_, element) => ({ title: $(element).find('a').attr('title') || '专题热点', image: absoluteUrl($(element).find('img').attr('src')), href: absoluteUrl($(element).find('a').attr('href')) })).get()
  const banners = $('.fade-banner .image img').map((_, element) => ({ image: absoluteUrl($(element).attr('src')), alt: $(element).attr('alt') || '校园风貌' })).get()
  return { news, announcements, topics, banners }
}

export function parseArticle(html, id, category) {
  const $ = cheerio.load(html)
  const title = $('.content .tit').first().text().trim()
  const meta = $('.content .wzxx').text()
  const date = meta.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? ''
  const content = []
  $('#vsb_content p').each((_, element) => {
    const text = $(element).text().trim()
    if (text) content.push({ type: 'paragraph', value: text })
    $(element).find('img').each((__, image) => content.push({ type: 'image', value: absoluteUrl($(image).attr('src')) }))
  })
  return { id, category, title, date, content }
}
