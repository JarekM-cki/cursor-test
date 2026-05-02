import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

import type { ModuleId } from '../types/logcom'

const moduleCopy: Record<Exclude<ModuleId, 'dashboard'>, { title: string; eyebrow: string; description: string }> = {
  structure: {
    title: 'Struktura organizacyjna',
    eyebrow: 'MODUL 2',
    description: 'Drzewo plutonow, druzyn i stanowisk z edycja etatow oraz stanem osobowym.',
  },
  equipment: {
    title: 'Ewidencja sprzetu',
    eyebrow: 'MODUL 3',
    description: 'Lista wyposazenia, statusy techniczne, resursy i szybkie przejscie do karty sprzetu.',
  },
  map: {
    title: 'Mapa taktyczna APP-6',
    eyebrow: 'MODUL 4',
    description: 'Mapa sytuacyjna z symbolami wojskowymi, konwojami i punktami logistycznymi.',
  },
  convoys: {
    title: 'Transport i konwoje',
    eyebrow: 'MODUL 5',
    description: 'Planowanie marszruty, skladow kolumn, czasow przejazdu i ryzyk transportowych.',
  },
  reports: {
    title: 'Generator meldunkow NATO',
    eyebrow: 'MODUL 6',
    description: 'Meldunki logistyczne generowane z aktualnego stanu danych kompanii.',
  },
  calculator: {
    title: 'Kalkulator DOS / FCU / j.k.',
    eyebrow: 'MODUL 7',
    description: 'Przeliczniki norm naleznosci, zuzycia, jednostek kalkulacyjnych i zapasow.',
  },
}

type PlaceholderViewProps = {
  moduleId: Exclude<ModuleId, 'dashboard'>
}

export function PlaceholderView({ moduleId }: PlaceholderViewProps) {
  const copy = moduleCopy[moduleId]

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/92"
    >
      <p className="font-display text-sm font-bold uppercase tracking-[0.32em] text-army poligon:text-signal">
        {copy.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-olive-dark poligon:text-stone-100">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 poligon:text-stone-300">
        {copy.description}
      </p>
      <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-olive px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-olive transition hover:-translate-y-0.5 hover:bg-olive-dark poligon:bg-signal poligon:text-poligon-bg">
        Zaplanowane w kolejnym kroku
        <ChevronRight size={18} />
      </button>
    </motion.section>
  )
}
