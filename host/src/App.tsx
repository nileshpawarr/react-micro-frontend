import React, { lazy, Suspense } from 'react'
import './App.css'
import { env } from './utils/env'
import useStore from './store'

const MFE1 = lazy(() => import('mfe1/App'))
const MFE2 = lazy(() => import('mfe2/App'))

const App: React.FC = () => {

  const { count } = useStore()

  return (
    <div className="container">
      <header className="main-header">
        <h1>{env.appName}</h1>
      </header>

      <section>
        <h2>Host Count: {count}</h2>
      </section>

      <div className="mfe-grid">
        <Suspense fallback={<div>Loading MFE1...</div>}>
          <MFE1 />
        </Suspense>

        <Suspense fallback={<div>Loading MFE2...</div>}>
          <MFE2 />
        </Suspense>
      </div>
    </div>
  )
}

export default App
