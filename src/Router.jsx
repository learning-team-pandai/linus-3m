import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import Lesson from './pages/Lesson.jsx'
import Profile from './pages/Profile.jsx'
import Settings from './pages/Settings.jsx'
import CategoryPath from './pages/CategoryPath.jsx'

const parseRoute = () => {
  const hash = window.location.hash.replace('#', '')
  if (!hash) return '/'
  return hash.startsWith('/') ? hash : `/${hash}`
}

function Router() {
  const [route, setRoute] = useState(() => parseRoute())

  useEffect(() => {
    const handleHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route.startsWith('/lesson/')) {
    const lessonId = route.split('/')[2]
    return <Lesson lessonId={lessonId} />
  }

  if (route === '/profile') {
    return <Profile />
  }
  if (route === '/settings') {
    return <Settings />
  }
  if (route.startsWith('/path/')) {
    const categoryId = route.split('/')[2]
    return <CategoryPath categoryId={categoryId} />
  }

  return <Home />
}

export default Router
