import { motion } from 'framer-motion';
import { Bell, Moon, Shield, Signal, Sun, Wifi } from 'lucide-react';

import { useLogcomStore } from '../../store/useLogcomStore';

export function TopBanner() {
  const commander = useLogcomStore((state) => state.commander);
  const poligonMode = useLogcomStore((state) => state.poligonMode);
  const togglePoligonMode = useLogcomStore((state) => state.togglePoligonMode);
  const alertCount = useLogcomStore((state) => state.alerts.filter((alert) => alert.severity !== 'low').length);

  return (
    <motion.header
      className="sticky top-0 z-30 border-b border-black/10 bg-sand/90 px-4 py-3 shadow-command backdrop-blur-xl poligon:border-white/10 poligon:bg-night/90"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-olive text-parchment shadow-command poligon:bg-radar poligon:text-night">
            <Shield className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="font-condensed text-xl font-bold uppercase tracking-[0.18em] text-charcoal poligon:text-parchment">
              LOGCOM
            </p>
            <p className="truncate text-xs font-semibold uppercase tracking-[0.22em] text-olive poligon:text-radar">
              Pulpit dowódcy kompanii logistycznej
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-2xl border border-olive/20 bg-white/70 px-3 py-2 text-xs font-semibold text-olive shadow-command poligon:border-white/10 poligon:bg-white/5 poligon:text-parchment sm:flex">
          <Signal className="h-4 w-4 text-army poligon:text-radar" />
          <span>17 BZ · Międzyrzecz</span>
          <Wifi className="h-4 w-4 text-army poligon:text-radar" />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-charcoal poligon:text-parchment">{commander.name}</p>
            <p className="text-xs text-olive poligon:text-radar">{commander.role}</p>
          </div>

          <button
            className="relative rounded-2xl border border-olive/20 bg-white/80 p-3 text-olive shadow-command transition hover:-translate-y-0.5 hover:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-parchment"
            aria-label={`${alertCount} aktywnych alertów`}
            type="button"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-critical px-1 text-[10px] font-black text-white">
              {alertCount}
            </span>
          </button>

          <button
            className="rounded-2xl border border-olive/20 bg-white/80 p-3 text-olive shadow-command transition hover:-translate-y-0.5 hover:border-army poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar"
            onClick={togglePoligonMode}
            aria-label="Przełącz tryb POLIGON"
            type="button"
          >
            {poligonMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
