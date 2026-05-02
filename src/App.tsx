import { AnimatePresence, motion } from 'framer-motion'

import { AppShell } from './components/layout/AppShell'
import { useLogcomStore } from './store/useLogcomStore'
import type { ModuleId } from './types/logcom'
import { PlaceholderView } from './views/PlaceholderView'

const isPlaceholderModule = (moduleId: ModuleId): moduleId is Exclude<ModuleId, 'dashboard'> =>
  moduleId !== 'dashboard'

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
          {isPlaceholderModule(activeModule) ? (
            <PlaceholderView moduleId={activeModule} />
          ) : (
            <PlaceholderView moduleId="structure" />
          )}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}
