import { AppStateProvider, useAppState } from './state/AppState'
import { Header } from './components/Header'
import { CycleView } from './components/views/CycleView'
import { JourneyView } from './components/views/JourneyView'
import { FamilyKnotView } from './components/views/FamilyKnotView'
import { IdentityView } from './components/views/IdentityView'
import { WorldsView } from './components/views/WorldsView'
import { CausalityView } from './components/views/CausalityView'

function Views() {
  const { route } = useAppState()
  switch (route.view) {
    case 'journey':
      return <JourneyView />
    case 'knot':
      return <FamilyKnotView />
    case 'identity':
      return <IdentityView />
    case 'worlds':
      return <WorldsView />
    case 'causality':
      return <CausalityView />
    case 'cycle':
    default:
      return <CycleView />
  }
}

function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-bg text-text">
        <Header />
        <main>
          <Views />
        </main>
        <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-text-faint">
          A fan-made explainer for Netflix's Dark (2017–2020). No copyrighted media — typography, SVG, and color only.
        </footer>
      </div>
    </AppStateProvider>
  )
}

export default App
