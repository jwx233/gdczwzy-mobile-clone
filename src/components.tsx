import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { snapshot } from './data'
import type { ArticleSummary } from './types'

export function Header() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      <div className="demo-notice">课程演示 · 非官方网站</div>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="返回首页">
          <span className="brand-emblem">医</span>
          <span><strong>广东潮州卫生健康职业学院</strong><small>GUANGDONG CHAOZHOU HEALTH VOCATIONAL COLLEGE</small></span>
        </Link>
        <div className="header-buttons">
          <button onClick={() => setSearchOpen(!searchOpen)} aria-label="搜索"><span className="search-icon" /></button>
          <button className={`menu-button ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="菜单"><i /><i /><i /></button>
        </div>
        {searchOpen && <form className="search-bar" onSubmit={submitSearch}><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="请输入关键词" /><button>搜索</button></form>}
      </header>
      <div className={`menu-overlay ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <nav className={`mobile-nav ${open ? 'show' : ''}`}>
        {snapshot.navigation.map((item) => (
          <div className="nav-group" key={item.label}>
            <div className="nav-row">
              <Link to={item.href ?? '#'} onClick={() => !item.children && setOpen(false)}>{item.label}</Link>
              {item.children && <button onClick={() => setExpanded(expanded === item.label ? null : item.label)}>{expanded === item.label ? '−' : '+'}</button>}
            </div>
            {item.children && <div className={`subnav ${expanded === item.label ? 'show' : ''}`}>{item.children.map((child) => <Link key={child.label} to={child.href ?? '#'} onClick={() => setOpen(false)}>{child.label}</Link>)}</div>}
          </div>
        ))}
      </nav>
    </>
  )
}

export function SectionTitle({ title, english, to }: { title: string; english: string; to?: string }) {
  return <div className="section-title"><div><h2>{title}</h2><p>{english}</p></div>{to && <Link to={to}>MORE <span>→</span></Link>}</div>
}

export function SmartImage({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div className={`image-fallback ${className}`}><span>卫</span><small>{alt}</small></div>
  const resolvedSrc = src.startsWith('synced/') ? `${import.meta.env.BASE_URL}${src}` : src
  return <img className={className} src={resolvedSrc} alt={alt} onError={() => setFailed(true)} loading="lazy" />
}

export function ArticleLink({ article, children, className = '' }: { article: ArticleSummary; children: React.ReactNode; className?: string }) {
  if (article.externalUrl) return <a className={className} href={article.externalUrl} target="_blank" rel="noreferrer">{children}</a>
  return <Link className={className} to={`/article/${article.id}`}>{children}</Link>
}

export function Footer() {
  return <footer className="footer">
    <h2>友情链接</h2>
    <div className="friend-links"><a href="https://www.moe.gov.cn/">中华人民共和国教育部</a><a href="http://edu.gd.gov.cn/">广东省教育厅</a><a href="http://wsjkw.gd.gov.cn/">广东省卫生健康委员会</a><a href="http://www.chaozhou.gov.cn/">潮州市人民政府</a></div>
    <div className="contact"><strong>学校办公室</strong><p>电话：0768-2309318 / 2309328</p><p>邮箱：2309328@qq.com</p><p>地址：广东省潮州市凤泉湖高新区中山大道西段北侧</p><p>邮编：521000</p></div>
    <div className="qr-placeholder"><span>公众号</span><small>课程演示占位</small></div>
    <p className="copyright">课程演示复刻 · 信息请以官方网站为准</p>
  </footer>
}

export function PageShell({ children }: { children: React.ReactNode }) {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return <><Header /><main>{children}</main><Footer />{showTop && <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑<small>回顶部</small></button>}</>
}

export function InnerHero({ label }: { label: string }) {
  return <div className="inner-hero"><SmartImage src={snapshot.banners[0]?.image} alt="校园风貌" /><div><Link to="/">首页</Link><span>›</span><strong>{label}</strong></div></div>
}
