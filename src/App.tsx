import { Navigate, Route, Routes } from 'react-router-dom'
import { ArticlePage, HomePage, ListPage, SearchPage } from './pages'

export default function App() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/list/:category" element={<ListPage />} />
    <Route path="/article/:id" element={<ArticlePage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
