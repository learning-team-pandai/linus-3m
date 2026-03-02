import { Suspense, lazy, useEffect, useState } from 'react'
import CategoryPath from './pages/CategoryPath.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Lesson = lazy(() => import('./pages/Lesson.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

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

  let element = <Home />
  if (route.startsWith('/lesson/')) {
    const lessonId = route.split('/')[2]
    element = <Lesson lessonId={lessonId} />
  } else if (route === '/profile') {
    element = <Profile />
  } else if (route === '/settings') {
    element = <Settings />
  } else if (route.startsWith('/path/')) {
    const categoryId = route.split('/')[2]
    element = <CategoryPath categoryId={categoryId} />
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950" aria-busy="true" />
      }
    >
      {element}
    </Suspense>
  )
}

export default Router
