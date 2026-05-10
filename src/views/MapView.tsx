import { AnimatePresence, motion } from 'framer-motion'
import {
  Fuel,
  Layers,
  MapPinned,
  Navigation,
  RadioTower,
  Route,
  Shield,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useState } from 'react'

type LayerId = 'units' | 'convoys' | 'logistics'

const layerLabels: Record<LayerId, string> = {
  units: 'Pododdziały',
  convoys: 'Trasy konwojów',
  logistics: 'Urządzenia logistyczne',
}

const app6Units = [
  { id: 'hq', label: 'KLog', detail: 'SD kompanii', x: 17, y: 30, icon: Shield },
  { id: 'transport', label: 'TPT', detail: 'Pluton transportowy', x: 47, y: 43, icon: Truck },
  { id: 'supply', label: 'ZAOP', detail: 'Pluton zaopatrzenia', x: 69, y: 63, icon: Warehouse },
  { id: 'repair', label: 'REM', detail: 'Pluton remontowy', x: 36, y: 70, icon: RadioTower },
]

const logisticsPoints = [
  { id: 'mps', label: 'P-TANK P2', x: 64, y: 48, icon: Fuel },
  { id: 'food', label: 'PŻ-22', x: 76, y: 70, icon: Warehouse },
  { id: 'repair-point', label: 'WPT-62', x: 31, y: 76, icon: Truck },
]

function LayerToggle({
  layer,
  active,
  onToggle,
}: {
  layer: LayerId
  active: boolean
  onToggle: (layer: LayerId) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(layer)}
      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:scale-[1.03] ${
        active
          ? 'border-olive bg-olive text-white shadow-olive poligon:border-radar poligon:bg-radar poligon:text-night'
          : 'border-olive/15 bg-parchment text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar'
      }`}
    >
      {layerLabels[layer]}
    </button>
  )
}

function App6Symbol({
  label,
  detail,
  x,
  y,
  icon: Icon,
}: {
  label: string
  detail: string
  x: number
  y: number
  icon: typeof Shield
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, x: '-50%', y: '-50%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
      whileHover={{ scale: 1.06, x: '-50%', y: '-50%' }}
      className="absolute z-20 w-28 rounded-xl border-2 border-charcoal bg-parchment/95 p-2 text-center shadow-command poligon:border-radar poligon:bg-night/95"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="mx-auto mb-1 flex h-7 w-16 items-center justify-center border border-charcoal/60 poligon:border-radar/70">
        <Icon className="h-4 w-4 text-olive poligon:text-radar" />
      </div>
      <p className="font-mono text-[0.68rem] font-black uppercase text-charcoal poligon:text-poligon-50">{label}</p>
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-field-500 poligon:text-stone-400">{detail}</p>
    </motion.div>
  )
}

function LogisticsMarker({
  label,
  x,
  y,
  icon: Icon,
}: {
  label: string
  x: number
  y: number
  icon: typeof Fuel
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      className="absolute z-20 rounded-2xl border border-army/35 bg-army/15 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-olive shadow-soft poligon:border-radar/40 poligon:bg-radar/10 poligon:text-radar"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <Icon className="mr-1 inline h-4 w-4" />
      {label}
    </motion.div>
  )
}

export function MapView() {
  const [activeLayers, setActiveLayers] = useState<Record<LayerId, boolean>>({
    units: true,
    convoys: true,
    logistics: true,
  })

  const toggleLayer = (layer: LayerId) => {
    setActiveLayers((current) => ({ ...current, [layer]: !current[layer] }))
  }

  return (
    <div className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
              MODUŁ 4 / MAPA APP-6
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Mapa taktyczna
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Stylizowana sytuacja logistyczna: pododdziały, trasy konwojów, punkty MPS i urządzenia zabezpieczenia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(layerLabels) as LayerId[]).map((layer) => (
              <LayerToggle key={layer} layer={layer} active={activeLayers[layer]} onToggle={toggleLayer} />
            ))}
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        className="relative min-h-[38rem] overflow-hidden rounded-[2rem] border border-white/75 bg-[#cfc093] shadow-command poligon:border-poligon-border poligon:bg-[#182112]"
      >
        <div className="absolute inset-0 grid-map opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(74,93,35,0.24),transparent_14rem),radial-gradient(circle_at_70%_70%,rgba(124,154,63,0.22),transparent_15rem)] poligon:bg-[radial-gradient(circle_at_18%_24%,rgba(159,232,112,0.08),transparent_14rem),radial-gradient(circle_at_70%_70%,rgba(159,232,112,0.06),transparent_15rem)]" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 510 C 170 455, 290 455, 470 505 S 760 575, 1040 500" fill="none" stroke="rgba(74,93,35,0.26)" strokeWidth="22" />
          <path d="M-20 510 C 170 455, 290 455, 470 505 S 760 575, 1040 500" fill="none" stroke="rgba(247,242,231,0.45)" strokeWidth="7" strokeDasharray="18 16" />
          <path d="M55 85 C 220 125, 335 80, 500 145 S 780 200, 935 125" fill="none" stroke="rgba(63,103,142,0.58)" strokeWidth="24" />
          <path d="M40 92 C 215 137, 342 93, 505 158 S 774 210, 940 137" fill="none" stroke="rgba(231,242,247,0.42)" strokeWidth="5" />
          {[70, 135, 210, 300, 390].map((y, index) => (
            <path
              key={y}
              d={`M40 ${y} C 190 ${y - 48}, 325 ${y + 50}, 480 ${y - 4} S 780 ${y - 30}, 960 ${y + 18}`}
              fill="none"
              stroke="rgba(74,93,35,0.18)"
              strokeWidth="2"
              strokeDasharray={index % 2 ? '10 10' : '4 8'}
            />
          ))}
          {activeLayers.convoys ? (
            <>
              <motion.path
                d="M170 190 C 275 255, 375 275, 470 315 S 610 410, 765 395"
                fill="none"
                stroke="#4A5D23"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="20 18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                className="poligon:stroke-radar"
              />
              <motion.circle
                r="12"
                fill="#7C9A3F"
                initial={{ cx: 170, cy: 190 }}
                animate={{ cx: [170, 310, 470, 610, 765], cy: [190, 260, 315, 405, 395] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }}
              />
            </>
          ) : null}
        </svg>

        <div className="absolute left-5 top-5 z-30 rounded-2xl border border-olive/20 bg-parchment/90 p-3 shadow-soft backdrop-blur poligon:border-radar/20 poligon:bg-night/90">
          <p className="flex items-center gap-2 font-display text-xl font-bold uppercase text-charcoal poligon:text-poligon-50">
            <Layers className="h-5 w-5 text-olive poligon:text-radar" />
            Warstwy aktywne
          </p>
          <p className="mt-1 font-mono text-xs font-bold text-field-500 poligon:text-stone-400">
            {Object.values(activeLayers).filter(Boolean).length}/3 · GRID 1 KM
          </p>
        </div>

        <AnimatePresence>
          {activeLayers.units ? app6Units.map((unit) => <App6Symbol key={unit.id} {...unit} />) : null}
          {activeLayers.logistics ? logisticsPoints.map((point) => <LogisticsMarker key={point.id} {...point} />) : null}
        </AnimatePresence>

        <div className="absolute bottom-5 left-5 right-5 z-30 grid gap-3 md:grid-cols-3">
          {[
            { label: 'Konwój T-03', value: 'ETA 10:30', icon: Route },
            { label: 'Punkt MPS', value: 'DOS 4.2', icon: Fuel },
            { label: 'Łączność', value: 'SYNC OK', icon: Navigation },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-white/65 bg-parchment/88 p-4 shadow-soft backdrop-blur poligon:border-radar/20 poligon:bg-night/88"
              >
                <Icon className="h-5 w-5 text-olive poligon:text-radar" />
                <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-field-500 poligon:text-stone-400">{item.label}</p>
                <p className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">{item.value}</p>
              </motion.div>
            )
          })}
        </div>

        <MapPinned className="absolute right-6 top-6 z-20 h-10 w-10 text-olive/45 poligon:text-radar/35" />
      </motion.section>
    </div>
  )
}
