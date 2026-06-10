import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { allArticles, findArticle, searchArticles, snapshot } from './data'
import { ArticleLink, InnerHero, PageShell, SectionTitle, SmartImage } from './components'
import type { ArticleSummary } from './types'

export function HomePage() {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % snapshot.banners.length), 5000)
    return () => window.clearInterval(timer)
  }, [])
  const featured = snapshot.news[0]

  return <PageShell>
    <section className="banner"><SmartImage src={snapshot.banners[slide]?.image} alt={snapshot.banners[slide]?.alt ?? '校园风貌'} /><div className="banner-dots">{snapshot.banners.map((_, index) => <button key={index} className={index === slide ? 'active' : ''} onClick={() => setSlide(index)} />)}</div></section>
    <section className="content-section school-news"><SectionTitle title="学校新闻" english="SCHOOL NEWS" to="/list/news" />
      {featured && <ArticleLink article={featured} className="featured-news"><SmartImage src={featured.image} alt={featured.title} /><strong>{featured.title}</strong></ArticleLink>}
      <div className="news-list">{snapshot.news.slice(1, 6).map((article) => <ArticleLink article={article} className="news-row" key={article.id}><span>{article.title}</span><time>{article.date}</time></ArticleLink>)}</div>
    </section>
    <section className="content-section announcements"><SectionTitle title="通知公告" english="ANNOUNCEMENT" to="/list/announcement" /><div className="announcement-list">{snapshot.announcements.map((article) => <ArticleLink article={article} className="announcement-card" key={article.id}><i>告</i><div><strong>{article.title}</strong><time>{article.date}</time></div></ArticleLink>)}</div></section>
    <section className="content-section topics"><SectionTitle title="专题热点" english="THEMATIC HOTSPOT" /><div className="topic-grid">{snapshot.topics.map((topic, index) => <a href={topic.href ?? '#'} key={`${topic.title}-${index}`}><SmartImage src={topic.image} alt={topic.title} /><span>{topic.title}</span></a>)}</div></section>
  </PageShell>
}

function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return <div className="article-list">{articles.map((article) => <ArticleLink article={article} className="article-list-item" key={article.id}>{article.image && <SmartImage src={article.image} alt={article.title} />}<div><strong>{article.title}</strong><time>{article.date}</time></div><span>›</span></ArticleLink>)}</div>
}

export function ListPage() {
  const { category } = useParams()
  const isNews = category === 'news'
  const articles = isNews ? snapshot.news : snapshot.announcements
  const label = isNews ? '学校新闻' : '通知公告'
  return <PageShell><InnerHero label={label} /><section className="inner-content"><SectionTitle title={label} english={isNews ? 'SCHOOL NEWS' : 'ANNOUNCEMENT'} /><ArticleList articles={articles} /><div className="pagination"><button disabled>上页</button><button className="active">1</button><button>2</button><button>下页</button></div></section></PageShell>
}

export function ArticlePage() {
  const { id = '' } = useParams()
  const article = findArticle(id)
  if (!article) return <PageShell><InnerHero label="正文" /><div className="empty-state"><h2>暂未同步正文</h2><p>该内容可能来自外部平台，请返回列表查看其他内容。</p><Link to="/">返回首页</Link></div></PageShell>
  const list = article.category === 'news' ? snapshot.news : snapshot.announcements
  const index = list.findIndex((item) => item.id === article.id)
  return <PageShell><InnerHero label="正文" /><article className="article-detail"><h1>{article.title}</h1><p className="article-meta">发布时间：{article.date}　来源：课程演示快照</p><div className="article-body">{article.content.map((block, blockIndex) => block.type === 'image' ? <SmartImage key={blockIndex} src={block.value} alt={article.title} /> : <p key={blockIndex}>{block.value}</p>)}</div><div className="prev-next">{index > 0 && <ArticleLink article={list[index - 1]}>上一篇：{list[index - 1].title}</ArticleLink>}{index < list.length - 1 && <ArticleLink article={list[index + 1]}>下一篇：{list[index + 1].title}</ArticleLink>}</div></article></PageShell>
}

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)
  const results = useMemo(() => searchArticles(initial), [initial])
  return <PageShell><InnerHero label="搜索" /><section className="inner-content"><form className="search-page-form" onSubmit={(event) => { event.preventDefault(); setParams({ q: query }) }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入新闻或公告关键词" /><button>搜索</button></form>{initial && <p className="result-count">找到 {results.length} 条与“{initial}”相关的内容</p>}<ArticleList articles={results} />{initial && results.length === 0 && <div className="empty-state"><h2>没有找到内容</h2><p>请尝试使用更短的关键词。</p></div>}</section></PageShell>
}

export const searchableCount = allArticles().length
