import { motion } from 'framer-motion'
import { useLogcomStore } from '../../store/useLogcomStore'

export function BottomNavigation() {
  const activeModule = useLogcomStore((state) => state.activeModule)
  const setActiveModule = useLogcomStore((state) => state.setActiveModule)
  const poligonMode = useLogcomStore((state) => state.poligonMode)
  const navigationItems = useLogcomStore((state) => state.navigation)

  return (
    <motion.nav
      initial={{ y: 96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed inset-x-0 bottom-0 z-40 border-t px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl backdrop-blur-2xl ${
        poligonMode
          ? 'border-radar/25 bg-night/92'
          : 'border-field-200/80 bg-white/92'
      }`}
      aria-label="Nawigacja modulow LOGCOM"
    >
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1 rounded-[1.65rem]">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeModule === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveModule(item.id)}
              title={item.description}
              className={`relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[0.66rem] font-bold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-army focus-visible:ring-offset-2 focus-visible:ring-offset-white poligon:focus-visible:ring-radar poligon:focus-visible:ring-offset-night sm:min-h-[4.25rem] ${
                isActive
                  ? poligonMode
                    ? 'text-radar'
                    : 'text-olive'
                  : poligonMode
                    ? 'text-stone-500 hover:text-stone-200'
                    : 'text-field-500 hover:text-field-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="nav-active"
                  className={`absolute inset-0 rounded-2xl ${
                    poligonMode
                      ? 'bg-radar/10 shadow-[0_0_24px_rgba(159,232,112,0.16)] ring-1 ring-radar/20'
                      : 'bg-sand/80 shadow-inner ring-1 ring-olive/10'
                  }`}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              ) : null}
              <Icon className="relative h-5 w-5" strokeWidth={2.1} />
              <span className="relative hidden leading-none sm:inline">{item.label}</span>
              <span className="relative leading-none sm:hidden">{item.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}
