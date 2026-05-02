import { motion } from 'framer-motion'
import { Moon, Radio, Shield, Sun, UserRound, Wifi } from 'lucide-react'

import { useLogcomStore } from '../../store/useLogcomStore'

export function TopBanner() {
  const commander = useLogcomStore((state) => state.commander)
  const poligonMode = useLogcomStore((state) => state.poligonMode)
  const togglePoligonMode = useLogcomStore((state) => state.togglePoligonMode)

  return (
    <motion.header
      className="sticky top-3 z-30 rounded-[1.75rem] border border-olive/15 bg-parchment/88 px-3 py-3 shadow-command backdrop-blur-2xl transition-colors duration-300 poligon:border-radar/20 poligon:bg-night/86 sm:px-4"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-olive text-parchment shadow-soft poligon:bg-radar poligon:text-night"
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="h-6 w-6" strokeWidth={2.4} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-parchment bg-army poligon:border-night poligon:bg-radar" />
          </motion.div>
          <div className="min-w-0">
            <p className="font-condensed text-2xl font-bold uppercase tracking-[0.18em] text-charcoal poligon:text-parchment">
              LOGCOM
            </p>
            <p className="hidden truncate text-xs font-semibold uppercase tracking-[0.22em] text-olive poligon:text-radar sm:block">
              Pulpit dowódcy kompanii logistycznej
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-olive/15 bg-white/62 px-3 py-2 shadow-soft poligon:border-radar/15 poligon:bg-white/5 lg:flex">
          <motion.span
            className="h-2.5 w-2.5 rounded-full bg-army poligon:bg-radar"
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Wifi className="h-4 w-4 text-army poligon:text-radar" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-olive poligon:text-radar">
            SYNC 08:42 · ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-olive/15 bg-white/62 px-3 py-2 shadow-soft poligon:border-radar/15 poligon:bg-white/5 md:flex">
            <UserRound className="h-4 w-4 text-olive poligon:text-radar" />
            <div className="leading-tight">
              <p className="font-condensed text-base font-bold uppercase tracking-[0.12em] text-charcoal poligon:text-parchment">
                {commander.rank} MALICKI · 17 BZ
              </p>
              <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-olive/75 poligon:text-radar/75">
                {commander.status}
              </p>
            </div>
          </div>

          <motion.button
            className="inline-flex items-center gap-2 rounded-2xl border border-olive/15 bg-white/75 px-3 py-3 text-olive shadow-soft transition-colors hover:border-army hover:bg-white poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar poligon:hover:bg-radar/15 sm:px-4"
            onClick={togglePoligonMode}
            aria-label="Przełącz tryb POLIGON"
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {poligonMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="hidden font-condensed text-sm font-bold uppercase tracking-[0.16em] sm:inline">
              POLIGON
            </span>
          </motion.button>

          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-olive/15 bg-white/70 text-olive shadow-soft poligon:border-radar/15 poligon:bg-white/5 poligon:text-radar md:hidden">
            <Radio className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}
