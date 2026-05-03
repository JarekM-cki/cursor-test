import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'
import { Clock3, MapPin, Package, RadioTower, Route, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { useLogcomStore } from '../store/useLogcomStore'
import type { Convoy, ConvoyPoint, ConvoyStatus } from '../types/logcom'

type TransportTab = 'overview' | 'norms' | 'convoys'

const tabs: Array<{ id: TransportTab; label: string; icon: typeof Truck }> = [
  { id: 'overview', label: 'Przegląd', icon: Truck },
  { id: 'norms', label: 'Normy', icon: ShieldCheck },
  { id: 'convoys', label: 'Konwoje', icon: Route },
]

const convoyStatusLabels: Record<ConvoyStatus, string> = {
  forming: 'FORMOWANIE',
  moving: 'W DRODZE',
  paused: 'POSTÓJ',
  arrived: 'DOSTARCZONY',
}

const convoyStatusStyles: Record<ConvoyStatus, string> = {
  forming: 'border-warning/35 bg-warning/10 text-warning poligon:text-amber-200',
  moving: 'border-army/35 bg-army/12 text-olive poligon:border-radar/35 poligon:bg-radar/10 poligon:text-radar',
  paused: 'border-coyote/40 bg-coyote/14 text-field-800 poligon:text-coyote',
  arrived: 'border-olive/20 bg-parchment text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-stone-300',
}

function interpolatePoint(path: ConvoyPoint[], progress: number): ConvoyPoint {
  if (path.length <= 1) {
    return path[0] ?? { lat: 52.444, lng: 15.578 }
  }

  const clamped = Math.max(0, Math.min(100, progress)) / 100
  const scaled = clamped * (path.length - 1)
  const index = Math.min(Math.floor(scaled), path.length - 2)
  const ratio = scaled - index
  const start = path[index]
  const end = path[index + 1]

  return {
    lat: start.lat + (end.lat - start.lat) * ratio,
    lng: start.lng + (end.lng - start.lng) * ratio,
  }
}

function ConvoyMap({ convoys }: { convoys: Convoy[] }) {
  const mapElementRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layersRef = useRef<L.LayerGroup | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1200)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!mapElementRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([52.45, 15.61], 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    layersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      layersRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = layersRef.current
    if (!layer) {
      return
    }

    layer.clearLayers()

    convoys.forEach((convoy) => {
      const route = convoy.path.map((point) => [point.lat, point.lng] as [number, number])
      L.polyline(route, {
        color: convoy.status === 'moving' ? '#4A5D23' : '#D28B1F',
        weight: 4,
        opacity: 0.85,
        dashArray: '10 12',
      }).addTo(layer)

      const pulseProgress = convoy.status === 'moving'
        ? Math.min(100, (convoy.progress + (tick % 12) * 1.8))
        : convoy.progress
      const currentPoint = interpolatePoint(convoy.path, pulseProgress)
      const icon = L.divIcon({
        className: '',
        html: `<div class="relative grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#4A5D23] text-[10px] font-black text-white shadow-lg"><span class="absolute h-12 w-12 animate-ping rounded-full bg-[#7C9A3F]/35"></span><span class="relative">${convoy.callsign}</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      L.marker([currentPoint.lat, currentPoint.lng], { icon })
        .bindTooltip(`${convoy.callsign}: ${convoy.cargo}`, { direction: 'top' })
        .addTo(layer)
    })
  }, [convoys, tick])

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-olive/12 bg-parchment shadow-soft poligon:border-poligon-border poligon:bg-poligon-surface">
      <div ref={mapElementRef} className="h-[26rem] w-full" />
    </div>
  )
}

function ConvoyCard({ convoy, index }: { convoy: Convoy; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 26 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.28 }}
      className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-soft poligon:border-poligon-border poligon:bg-poligon-surface/88"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
            {convoy.callsign}
          </p>
          <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">{convoy.route}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.14em] ${convoyStatusStyles[convoy.status]}`}>
          {convoyStatusLabels[convoy.status]}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand poligon:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${convoy.progress}%` }}
          transition={{ duration: 0.7 }}
          className="h-full rounded-full bg-army poligon:bg-radar"
        />
      </div>
      <div className="mt-4 grid gap-3 text-sm font-semibold text-field-800 poligon:text-stone-300 md:grid-cols-2">
        <span className="flex items-center gap-2"><Package className="h-4 w-4 text-army poligon:text-radar" />{convoy.cargo}</span>
        <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-army poligon:text-radar" />ETA {convoy.eta}</span>
        <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-army poligon:text-radar" />{convoy.vehicles} pojazdów</span>
        <span className="flex items-center gap-2"><RadioTower className="h-4 w-4 text-army poligon:text-radar" />{convoy.commander}</span>
      </div>
    </motion.article>
  )
}

export function TransportView() {
  const transportAssets = useLogcomStore((state) => state.transportAssets)
  const tacticalNorms = useLogcomStore((state) => state.tacticalNorms)
  const convoys = useLogcomStore((state) => state.convoys)
  const [activeTab, setActiveTab] = useState<TransportTab>('overview')

  const totalAvailable = transportAssets.reduce((sum, item) => sum + item.available, 0)
  const totalAssigned = transportAssets.reduce((sum, item) => sum + item.assigned, 0)
  const totalCapacity = transportAssets.reduce((sum, item) => sum + item.capacityTons, 0)
  const donutData = useMemo(() => [
    { name: 'Wykorzystane', value: totalAssigned, color: '#4A5D23' },
    { name: 'Rezerwa', value: Math.max(totalAvailable - totalAssigned, 0), color: '#7C9A3F' },
    { name: 'Obsługa', value: 3, color: '#D28B1F' },
  ], [totalAssigned, totalAvailable])
  const utilization = Math.round((totalAssigned / Math.max(totalAvailable, 1)) * 100)

  return (
    <div className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
              MODUŁ 5 / TRANSPORT I KONWOJE
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Transport i konwoje
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Monitorowanie możliwości transportowych KLog, norm taktycznych i aktywnych konwojów na mapie OpenStreetMap.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-army/30 bg-army/12 p-3 text-center text-olive poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar">
              <p className="font-display text-4xl font-bold leading-none">{totalAvailable}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Pojazdy</p>
            </div>
            <div className="rounded-2xl border border-olive/15 bg-parchment p-3 text-center text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar">
              <p className="font-display text-4xl font-bold leading-none">{totalCapacity}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Tony</p>
            </div>
            <div className="rounded-2xl border border-warning/35 bg-warning/10 p-3 text-center text-warning poligon:text-amber-200">
              <p className="font-display text-4xl font-bold leading-none">{convoys.length}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Konwoje</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-wrap gap-2 rounded-[1.75rem] border border-white/75 bg-white/75 p-3 shadow-soft poligon:border-poligon-border poligon:bg-poligon-surface/82">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.14em] transition hover:scale-[1.02] ${
                activeTab === tab.id
                  ? 'bg-olive text-white shadow-olive poligon:bg-radar poligon:text-night'
                  : 'bg-parchment text-olive poligon:bg-white/5 poligon:text-radar'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command poligon:border-poligon-border poligon:bg-poligon-surface/90">
            <div className="relative h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} dataKey="value" innerRadius="68%" outerRadius="90%" paddingAngle={2} cornerRadius={12}>
                    {donutData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="font-display text-7xl font-bold leading-none text-olive poligon:text-radar">{utilization}%</p>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-field-500 poligon:text-stone-500">Wykorzystanie</p>
                </div>
              </div>
            </div>
          </section>
          <section className="grid gap-3">
            {transportAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-[1.5rem] border border-white/70 bg-white/82 p-4 shadow-soft poligon:border-poligon-border poligon:bg-poligon-surface/88"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold uppercase text-charcoal poligon:text-poligon-50">{asset.name}</p>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">{asset.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-bold text-olive poligon:text-radar">{asset.assigned}/{asset.available}</p>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">{asset.capacityTons} t</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      ) : null}

      {activeTab === 'norms' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {tacticalNorms.map((norm, index) => (
            <motion.article
              key={norm.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-[1.75rem] border border-white/75 bg-white/82 p-5 shadow-command poligon:border-poligon-border poligon:bg-poligon-surface/90"
            >
              <p className="font-display text-4xl font-bold uppercase text-charcoal poligon:text-poligon-50">{norm.value}</p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-olive poligon:text-radar">{norm.name}</h2>
              <p className="mt-3 text-sm leading-6 text-field-800 poligon:text-stone-300">{norm.note}</p>
              <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-field-500 poligon:text-stone-500">{norm.source}</p>
            </motion.article>
          ))}
        </div>
      ) : null}

      {activeTab === 'convoys' ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <ConvoyMap convoys={convoys} />
          <div className="space-y-3">
            {convoys.map((convoy, index) => <ConvoyCard key={convoy.id} convoy={convoy} index={index} />)}
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-army/20 bg-army/10 p-4 text-sm font-semibold text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar"
      >
        <MapPin className="mr-2 inline h-5 w-5" />
        Symulacja monitorowania konwojów odświeża pozycję markerów na mapie w czasie rzeczywistym.
      </motion.div>
    </div>
  )
}
