import { motion } from 'framer-motion'
import { Calculator, FileText, Route } from 'lucide-react'
import { useState } from 'react'

import { CalculatorView } from './CalculatorView'
import { ReportsView } from './ReportsView'
import { TransportView } from './TransportView'

type MoreModule = 'transport' | 'reports' | 'calculator'

const modules: Array<{ id: MoreModule; label: string; description: string; icon: typeof Route }> = [
  {
    id: 'transport',
    label: 'Transport i konwoje',
    description: 'Monitorowanie tras, norm marszowych i aktywnych kolumn.',
    icon: Route,
  },
  {
    id: 'calculator',
    label: 'Kalkulator DOS / FCU',
    description: 'Paliwo, żywność i amunicja z przeliczeniem live.',
    icon: Calculator,
  },
  {
    id: 'reports',
    label: 'Meldunki NATO',
    description: 'LOGSITREP, LOGDEFREP, LOGASSESSREP i LOGREQ.',
    icon: FileText,
  },
]

export function MoreView() {
  const [activeModule, setActiveModule] = useState<MoreModule>('transport')

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/75 bg-white/80 p-4 shadow-soft backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/86"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon
            const isActive = activeModule === module.id

            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveModule(module.id)}
                className={`rounded-[1.5rem] border p-4 text-left transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-army focus-visible:ring-offset-2 focus-visible:ring-offset-white poligon:focus-visible:ring-radar poligon:focus-visible:ring-offset-night ${
                  isActive
                    ? 'border-olive bg-army/12 text-olive ring-2 ring-army/20 poligon:border-radar poligon:bg-radar/10 poligon:text-radar'
                    : 'border-olive/10 bg-parchment/72 text-field-800 poligon:border-white/8 poligon:bg-white/5 poligon:text-stone-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`rounded-2xl p-3 ${
                    isActive
                      ? 'bg-olive text-white poligon:bg-radar poligon:text-night'
                      : 'bg-white/70 text-olive poligon:bg-white/5 poligon:text-radar'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-2xl font-bold uppercase leading-none">{module.label}</span>
                    <span className="mt-1 block text-sm font-semibold opacity-80">{module.description}</span>
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </motion.section>

      {activeModule === 'transport' ? (
        <TransportView />
      ) : activeModule === 'reports' ? (
        <ReportsView />
      ) : (
        <CalculatorView />
      )}
    </div>
  )
}
