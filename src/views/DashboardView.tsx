import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  Beef,
  Boxes,
  ChevronRight,
  CircleDot,
  Fuel,
  PackageCheck,
  Route,
  ShieldCheck,
  Truck,
  Users,
  Weight,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { useLogcomStore } from '../store/useLogcomStore'
import type { AlertItem, CapabilityMetric, QuickMetric } from '../types/logcom'

const metricIcons: Record<string, typeof Users> = {
  personnel: Users,
  vehicles: Truck,
  equipment: PackageCheck,
  convoys: Route,
}

const capabilityIcons: Record<string, typeof Weight> = {
  payload: Weight,
  meals: Beef,
  column: Route,
}

const severityStyles: Record<AlertItem['severity'], string> = {
  high: 'border-critical/30 bg-critical/10 text-critical poligon:border-critical/45 poligon:bg-critical/15 poligon:text-red-200',
  medium: 'border-warning/35 bg-warning/10 text-warning poligon:border-warning/45 poligon:bg-warning/15 poligon:text-amber-200',
  low: 'border-army/35 bg-army/10 text-olive poligon:border-radar/35 poligon:bg-radar/10 poligon:text-radar',
}

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.055, duration: 0.38 },
  }),
}

const percentTooltipFormatter = (value: unknown) => {
  const numericValue = typeof value === 'number' ? value : Number(value ?? 0)
  return `${numericValue}%`
}

function DashboardCard({
  children,
  className = '',
  index,
}: {
  children: React.ReactNode
  className?: string
  index: number
}) {
  return (
    <motion.section
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl transition-colors poligon:border-poligon-border poligon:bg-poligon-surface/90 ${className}`}
    >
      {children}
    </motion.section>
  )
}

function QuickMetricCard({ metric, index }: { metric: QuickMetric; index: number }) {
  const Icon = metricIcons[metric.id] ?? CircleDot

  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="group min-h-36 rounded-[1.75rem] border border-white/75 bg-white/85 p-5 text-left shadow-soft backdrop-blur-xl transition poligon:border-poligon-border poligon:bg-poligon-surface/88"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-army/14 p-3 text-olive transition group-hover:bg-olive group-hover:text-white poligon:bg-radar/12 poligon:text-radar poligon:group-hover:bg-radar poligon:group-hover:text-night">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-field-500 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-olive poligon:text-radar/70" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-field-500 poligon:text-stone-400">
        {metric.label}
      </p>
      <div className="mt-1 flex items-end gap-1">
        <span className="font-display text-5xl font-bold leading-none tracking-tight text-charcoal poligon:text-poligon-50">
          {metric.value}
        </span>
        {metric.unit ? (
          <span className="pb-1 font-display text-xl font-bold text-olive poligon:text-radar">{metric.unit}</span>
        ) : null}
      </div>
      <p className="mt-3 text-sm font-semibold text-olive poligon:text-radar">{metric.trend}</p>
    </motion.button>
  )
}

function OperationalReadiness() {
  const readiness = useLogcomStore((state) => state.readiness)
  const total = readiness.reduce((sum, item) => sum + item.value, 0)
  const ready = readiness.find((item) => item.status === 'ready')?.value ?? 0

  return (
    <DashboardCard index={5} className="lg:col-span-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="relative h-64 flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={readiness}
                dataKey="value"
                innerRadius="70%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={12}
                paddingAngle={2}
              >
                {readiness.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={percentTooltipFormatter} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.35 }}
            >
              <p className="font-display text-7xl font-bold leading-none text-army poligon:text-radar">{ready}%</p>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-field-500 poligon:text-stone-400">
                Gotowosc
              </p>
            </motion.div>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
            MODUL 1 / PULPIT
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
            Gotowosc operacyjna
          </h2>
          <p className="mt-3 text-sm leading-6 text-field-800 poligon:text-stone-300">
            Stan bojowy kompanii logistycznej w ukladzie „3 sekundy do kazdej liczby”.
            Dane sa zasilane ze wspolnego stanu LOGCOM.
          </p>
          <div className="mt-5 space-y-3">
            {readiness.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold text-charcoal poligon:text-stone-200">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-olive poligon:text-radar">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-army/20 bg-army/10 p-3 text-sm font-semibold text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar">
            {ready} z {total}% kluczowych zasobow w gotowosci natychmiastowej.
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

function CapabilityCard() {
  const capabilities = useLogcomStore((state) => state.capabilities)

  return (
    <DashboardCard index={6} className="lg:col-span-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
            Mozliwosci KLog
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase text-charcoal poligon:text-poligon-50">
            Zdolnosci dobowe
          </h2>
        </div>
        <Boxes className="h-7 w-7 text-olive poligon:text-radar" />
      </div>
      <div className="mt-5 grid gap-3">
        {capabilities.map((item: CapabilityMetric) => {
          const Icon = capabilityIcons[item.id] ?? ShieldCheck

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-olive/12 bg-parchment/75 p-4 poligon:border-white/8 poligon:bg-white/5"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-field-800 poligon:text-stone-300">
                  <Icon className="h-5 w-5 text-army poligon:text-radar" />
                  {item.label}
                </span>
                <span className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">
                  {item.value}
                </span>
              </div>
              <p className="mt-1 pl-8 text-xs font-semibold text-field-500 poligon:text-stone-500">{item.detail}</p>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}

function FuelCard() {
  const fuel = useLogcomStore((state) => state.fuel)
  const fuelPercent = Math.round((fuel.currentLiters / fuel.capacityLiters) * 100)

  return (
    <DashboardCard index={7} className="lg:col-span-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
            Paliwo / DOS
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase text-charcoal poligon:text-poligon-50">
            Zapas operacyjny
          </h2>
        </div>
        <div className="rounded-2xl bg-olive px-4 py-3 text-right text-white shadow-olive poligon:bg-radar poligon:text-night">
          <p className="text-xs font-bold uppercase tracking-[0.18em]">DOS</p>
          <p className="font-display text-3xl font-bold leading-none">{fuel.dos.toFixed(1)}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="flex items-end gap-2">
            <Fuel className="mb-2 h-6 w-6 text-army poligon:text-radar" />
            <span className="font-display text-6xl font-bold leading-none text-charcoal poligon:text-poligon-50">
              {fuelPercent}
            </span>
            <span className="pb-2 font-display text-2xl font-bold text-olive poligon:text-radar">%</span>
          </div>
          <p className="mt-2 text-sm text-field-800 poligon:text-stone-300">
            {fuel.currentLiters.toLocaleString('pl-PL')} l / {fuel.capacityLiters.toLocaleString('pl-PL')} l
          </p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-sand poligon:bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fuelPercent}%` }}
              transition={{ delay: 0.35, duration: 0.75, ease: 'easeOut' }}
              className="h-full rounded-full bg-army poligon:bg-radar"
            />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">
            Prog krytyczny: {fuel.criticalThresholdPercent}%
          </p>
        </div>
        <div className="h-44 rounded-2xl border border-olive/12 bg-parchment/70 p-3 poligon:border-white/8 poligon:bg-white/5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fuel.trend} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C9A3F" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#7C9A3F" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip formatter={percentTooltipFormatter} />
              <Area
                type="monotone"
                dataKey="level"
                stroke="#4A5D23"
                strokeWidth={3}
                fill="url(#fuelGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardCard>
  )
}

function AlertsPanel() {
  const alerts = useLogcomStore((state) => state.alerts)

  return (
    <DashboardCard index={8} className="lg:col-span-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
            Aktualne alerty
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase text-charcoal poligon:text-poligon-50">
            Wymaga uwagi
          </h2>
        </div>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          className="rounded-2xl bg-critical/10 p-3 text-critical poligon:bg-critical/15 poligon:text-red-200"
        >
          <AlertTriangle className="h-6 w-6" />
        </motion.div>
      </div>
      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <motion.button
            key={alert.id}
            whileHover={{ x: 4 }}
            type="button"
            className="w-full rounded-2xl border border-olive/12 bg-parchment/75 p-4 text-left transition poligon:border-white/8 poligon:bg-white/5"
          >
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 rounded-xl border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${severityStyles[alert.severity]}`}>
                {alert.severity}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-charcoal poligon:text-poligon-50">{alert.title}</h3>
                  <span className="font-mono text-xs font-bold text-field-500 poligon:text-stone-500">{alert.time}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-field-800 poligon:text-stone-300">{alert.detail}</p>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-field-500 poligon:text-radar/70" />
            </div>
          </motion.button>
        ))}
      </div>
    </DashboardCard>
  )
}

export function DashboardView() {
  const commander = useLogcomStore((state) => state.commander)
  const quickMetrics = useLogcomStore((state) => state.quickMetrics)

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-[2.25rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(231,220,195,0.82))] p-6 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-[linear-gradient(135deg,rgba(17,25,14,0.94),rgba(8,16,8,0.9))]"
      >
        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr] lg:items-center">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.32em] text-army poligon:text-radar">
              Pulpit dowodcy / LOGCOM v0.3
            </p>
            <h1 className="mt-3 font-display text-5xl font-bold uppercase leading-none tracking-tight text-charcoal poligon:text-poligon-50 md:text-7xl">
              Witaj, Dowodco!
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-field-800 poligon:text-stone-300">
              {commander.rank} {commander.firstName} {commander.lastName} · {commander.brigadeName}.
              Najwazniejsze wskazniki kompanii logistycznej sa gotowe do decyzji operacyjnej.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-olive/15 bg-parchment/80 p-5 poligon:border-radar/15 poligon:bg-white/5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-field-500 poligon:text-stone-500">
              Profil dyzurny
            </p>
            <p className="mt-2 font-display text-4xl font-bold uppercase text-charcoal poligon:text-poligon-50">
              {commander.rank} {commander.lastName}
            </p>
            <p className="mt-1 text-sm font-semibold text-olive poligon:text-radar">{commander.brigadeCode}</p>
            <p className="mt-4 rounded-2xl bg-army/12 px-4 py-3 text-sm font-bold text-olive poligon:bg-radar/10 poligon:text-radar">
              {commander.status}
            </p>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickMetrics.map((metric, index) => (
          <QuickMetricCard key={metric.id} metric={metric} index={index + 1} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-8">
        <OperationalReadiness />
        <CapabilityCard />
        <FuelCard />
        <AlertsPanel />
      </div>
    </div>
  )
}
