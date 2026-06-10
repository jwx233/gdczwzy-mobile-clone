import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, resolve } from 'node:path'
import https from 'node:https'
import { parseHomepage, SOURCE } from './parser.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const snapshotPath = resolve(root, 'src/data/site-snapshot.json')
const syncedAssetsPath = resolve(root, 'public/synced')
const topicFallbackTitles = ['学习贯彻党的二十届四中全会精神', '校园风貌', '高等教育质量监测', '实习工作专栏', '设备采购', '思政育人']

async function fetchResource(url, encoding) {
  return new Promise((resolveText, reject) => {
    // 目标站以 IP 提供 HTTPS，证书域名无法匹配；此例外仅用于读取该公开源。
    const request = https.get(url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        resolveText(fetchResource(new URL(response.headers.location, url).href, encoding))
        return
      }
      if (response.statusCode !== 200) {
        reject(new Error(`${response.statusCode} ${url}`))
        return
      }
      const chunks = []
      response.on('data', (chunk) => { chunks.push(chunk) })
      response.on('end', () => {
        const body = Buffer.concat(chunks)
        resolveText(encoding ? body.toString(encoding) : body)
      })
    })
    request.setTimeout(15000, () => request.destroy(new Error('request timeout')))
    request.on('error', reject)
  })
}

const fetchText = (url) => fetchResource(url, 'utf8')

async function localizeImage(sourceUrl) {
  if (!sourceUrl || sourceUrl.startsWith('synced/')) return sourceUrl
  const url = new URL(sourceUrl, SOURCE)
  if (url.origin !== new URL(SOURCE).origin) return sourceUrl
  const extension = extname(url.pathname).toLowerCase() || '.jpg'
  const filename = `${createHash('sha1').update(url.href).digest('hex').slice(0, 16)}${extension}`
  await mkdir(syncedAssetsPath, { recursive: true })
  await writeFile(resolve(syncedAssetsPath, filename), await fetchResource(url.href))
  return `synced/${filename}`
}

async function localizeSnapshotImages(snapshot) {
  for (const banner of snapshot.banners) banner.image = await localizeImage(banner.image)
  for (const article of snapshot.news) article.image = await localizeImage(article.image)
  for (const topic of snapshot.topics) topic.image = await localizeImage(topic.image)
  for (const article of snapshot.articles) {
    article.image = await localizeImage(article.image)
    for (const block of article.content) {
      if (block.type === 'image') block.value = await localizeImage(block.value)
    }
  }
}

try {
  const existing = JSON.parse(await readFile(snapshotPath, 'utf8'))
  const parsed = parseHomepage(await fetchText(SOURCE))
  const snapshot = {
    ...existing,
    syncedAt: new Date().toISOString(),
    banners: parsed.banners.length ? parsed.banners : existing.banners,
    news: parsed.news.length ? parsed.news : existing.news,
    announcements: parsed.announcements.length ? parsed.announcements : existing.announcements,
    topics: parsed.topics.length ? parsed.topics.map((topic, index) => ({
      ...topic,
      title: topic.title === '专题热点' ? topicFallbackTitles[index] ?? topic.title : topic.title,
    })) : existing.topics,
  }
  await localizeSnapshotImages(snapshot)
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Synced ${snapshot.news.length} news and ${snapshot.announcements.length} announcements.`)
} catch (error) {
  console.warn(`Sync failed; keeping last successful snapshot. ${error.message}`)
}
