import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, Truck, Users, Wrench } from 'lucide-react'
import { useMemo } from 'react'

import { useLogcomStore } from '../store/useLogcomStore'
import type { EquipmentItem, EquipmentStatus, Soldier, StructureNode } from '../types/logcom'

const statusLabels: Record<EquipmentStatus, string> = {
  ready: 'SPRAWNY',
  limited: 'OGRAN.',
  service: 'OBSŁUGA',
  down: 'NIESP.',
}

const statusStyles: Record<EquipmentStatus, string> = {
  ready: 'border-army/35 bg-army/12 text-olive poligon:border-radar/35 poligon:bg-radar/10 poligon:text-radar',
  limited: 'border-warning/35 bg-warning/12 text-warning poligon:border-warning/45 poligon:bg-warning/15 poligon:text-amber-200',
  service: 'border-coyote/45 bg-coyote/16 text-field-800 poligon:border-coyote/45 poligon:bg-coyote/12 poligon:text-coyote',
  down: 'border-critical/35 bg-critical/12 text-critical poligon:border-critical/45 poligon:bg-critical/15 poligon:text-red-200',
}

function flattenSoldiers(nodes: StructureNode[]): Soldier[] {
  return nodes.flatMap((node) => [
    ...node.soldiers,
    ...flattenSoldiers(node.children ?? []),
  ])
}

function crewNames(item: EquipmentItem, soldiers: Soldier[]) {
  return item.crewSoldierIds
    .map((id) => soldiers.find((soldier) => soldier.id === id))
    .filter((soldier): soldier is Soldier => Boolean(soldier))
    .map((soldier) => (soldier.status === 'vacancy' ? 'WAKAT' : `${soldier.rank} ${soldier.lastName}`))
}

function EquipmentCard({ item, index, soldiers }: { item: EquipmentItem; index: number; soldiers: Soldier[] }) {
  const crew = crewNames(item, soldiers)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-[1.75rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid h-16 w-20 place-items-center rounded-3xl border border-olive/12 bg-parchment text-center font-display text-2xl font-bold uppercase text-olive poligon:border-radar/15 poligon:bg-white/5 poligon:text-radar">
          {item.silhouette}
        </div>
        <span className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] ${statusStyles[item.status]}`}>
          {statusLabels[item.status]}
        </span>
      </div>

      <h2 className="mt-5 font-display text-3xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
        {item.name}
      </h2>
      <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">{item.model}</p>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-sand poligon:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${item.readinessPercent}%` }}
          transition={{ delay: 0.2 + index * 0.04, duration: 0.65 }}
          className="h-full rounded-full bg-army poligon:bg-radar"
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-field-500 poligon:text-stone-500">
        <span>Gotowość</span>
        <span className="font-mono text-olive poligon:text-radar">{item.readinessPercent}%</span>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-start gap-2 text-field-800 poligon:text-stone-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-army poligon:text-radar" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-start gap-2 text-field-800 poligon:text-stone-300">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-army poligon:text-radar" />
          <span>{crew.length ? crew.join(' · ') : 'Załoga nieprzypisana'}</span>
        </div>
        <div className="flex items-start gap-2 text-field-800 poligon:text-stone-300">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-army poligon:text-radar" />
          <span>Obsługa: {item.nextService} · {item.mileageKm.toLocaleString('pl-PL')} km</span>
        </div>
      </div>
    </motion.article>
  )
}

export function EquipmentView() {
  const equipment = useLogcomStore((state) => state.equipment)
  const structure = useLogcomStore((state) => state.structure)
  const soldiers = useMemo(() => flattenSoldiers(structure), [structure])
  const readyCount = equipment.filter((item) => item.status === 'ready').length

  return (
    <div className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
              MODUŁ 3 / FUNDAMENT
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Ewidencja sprzętu
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Podstawowe karty pojazdów i urządzeń logistycznych, połączone z obsadą ze struktury kompanii.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-army/30 bg-army/12 p-3 text-center text-olive poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar">
              <p className="font-display text-4xl font-bold leading-none">{readyCount}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Sprawne</p>
            </div>
            <div className="rounded-2xl border border-warning/35 bg-warning/10 p-3 text-center text-warning poligon:text-amber-200">
              <p className="font-display text-4xl font-bold leading-none">{equipment.length - readyCount}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Uwagi</p>
            </div>
            <div className="rounded-2xl border border-olive/15 bg-parchment p-3 text-center text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar">
              <Truck className="mx-auto h-8 w-8" />
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Park</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {equipment.map((item, index) => (
          <EquipmentCard key={item.id} item={item} index={index} soldiers={soldiers} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-[1.75rem] border border-army/20 bg-army/10 p-4 text-sm font-semibold text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar"
      >
        <ShieldCheck className="mr-2 inline h-5 w-5" />
        Fundament modułu 3 jest gotowy pod pełną ewidencję, filtry, kartę szczegółową i edycję resursów.
      </motion.div>
    </div>
  )
}
