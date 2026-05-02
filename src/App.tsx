import { AnimatePresence, motion } from 'framer-motion'

import { AppShell } from './components/layout/AppShell'
import { useLogcomStore } from './store/useLogcomStore'
import { DashboardView } from './views/DashboardView'
import { PlaceholderView } from './views/PlaceholderView'
import { StructureView } from './views/StructureView'

export default function App() {
  const activeModule = useLogcomStore((state) => state.activeModule)

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          {activeModule === 'dashboard' ? (
            <DashboardView />
          ) : activeModule === 'structure' ? (
            <StructureView />
          ) : (
            <PlaceholderView moduleId={activeModule} />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
