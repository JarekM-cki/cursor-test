import { motion } from 'framer-motion'
import { useLogcomStore } from '../../store/useLogcomStore'
import { navigationItems } from '../../data/logcomSeed'

export function BottomNavigation() {
  const activeModule = useLogcomStore((state) => state.activeModule)
  const setActiveModule = useLogcomStore((state) => state.setActiveModule)
  const poligonMode = useLogcomStore((state) => state.poligonMode)

  return (
    <motion.nav
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed inset-x-0 bottom-0 z-40 border-t px-3 pb-3 pt-2 shadow-2xl backdrop-blur-2xl ${
        poligonMode
          ? 'border-logcom-radar/25 bg-night-950/92'
          : 'border-field-200/80 bg-white/92'
      }`}
      aria-label="Nawigacja modulow LOGCOM"
    >
      <div className="mx-auto grid max-w-5xl grid-cols-7 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModule(item.id)}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.66rem] font-semibold uppercase tracking-[0.08em] transition ${
                isActive
                  ? poligonMode
                    ? 'text-logcom-radar'
                    : 'text-logcom-olive'
                  : poligonMode
                    ? 'text-slate-500 hover:text-slate-200'
                    : 'text-field-500 hover:text-field-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="nav-active"
                  className={`absolute inset-0 rounded-2xl ${
                    poligonMode
                      ? 'bg-logcom-radar/10 shadow-[0_0_24px_rgba(173,255,47,0.16)]'
                      : 'bg-logcom-sand/80 shadow-inner'
                  }`}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              ) : null}
              <Icon className="relative h-5 w-5" strokeWidth={2.1} />
              <span className="relative hidden sm:inline">{item.label}</span>
              <span className="relative sm:hidden">{item.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
