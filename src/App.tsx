import { Routes, Route } from 'react-router'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import Home from '@/pages/Home'
import Posts from '@/pages/Posts'
import PostDetail from '@/pages/PostDetail'
import Calendar from '@/pages/Calendar'
import Timeline from '@/pages/Timeline'
import About from '@/pages/About'
import Guestbook from '@/pages/Guestbook'

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="grain-overlay" aria-hidden />
      <SiteNav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/about" element={<About />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
