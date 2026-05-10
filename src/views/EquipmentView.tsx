import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarClock,
  Filter,
  Gauge,
  MapPin,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useLogcomStore } from '../store/useLogcomStore'
import type {
  EquipmentCategory,
  EquipmentItem,
  EquipmentStatus,
  Soldier,
  StructureNode,
} from '../types/logcom'

type StatusFilter = EquipmentStatus | 'all'
type CategoryFilter = EquipmentCategory | 'all'
type EquipmentEditState = Pick<
  EquipmentItem,
  | 'status'
  | 'readinessPercent'
  | 'mileageKm'
  | 'motohours'
  | 'fuelLevelPercent'
  | 'lastInspection'
  | 'nextService'
  | 'serviceWindow'
  | 'serviceStatus'
  | 'notes'
>

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

const categoryLabels: Record<EquipmentCategory, string> = {
  command: 'Dowodzenie',
  truck: 'Transport',
  tanker: 'MPS',
  kitchen: 'Żywienie',
  recovery: 'Remont',
  trailer: 'Przyczepy',
}

function flattenSoldiers(nodes: StructureNode[]): Soldier[] {
  return nodes.flatMap((node) => [
    ...node.soldiers,
    ...flattenSoldiers(node.children ?? []),
  ])
}

function flattenNodes(nodes: StructureNode[]): StructureNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])])
}

function resolveCrew(item: EquipmentItem, soldiers: Soldier[]) {
  return item.crewSoldierIds
    .map((id) => soldiers.find((soldier) => soldier.id === id))
    .filter((soldier): soldier is Soldier => Boolean(soldier))
}

function formatSoldier(soldier: Soldier) {
  return soldier.status === 'vacancy'
    ? 'WAKAT'
    : `${soldier.rank} ${soldier.firstName} ${soldier.lastName}`.trim()
}

function EquipmentCard({
  item,
  index,
  soldiers,
  active,
  onSelect,
}: {
  item: EquipmentItem
  index: number
  soldiers: Soldier[]
  active: boolean
  onSelect: (itemId: string) => void
}) {
  const crew = resolveCrew(item, soldiers)

  return (
      <motion.button
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(item.id)}
      type="button"
      className={`rounded-[1.75rem] border p-5 text-left shadow-command backdrop-blur-xl transition poligon:bg-poligon-surface/90 ${
        active
          ? 'border-olive bg-army/12 ring-2 ring-army/25 poligon:border-radar poligon:bg-radar/10'
          : 'border-white/75 bg-white/82 poligon:border-poligon-border'
      }`}
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
          <span>{crew.length ? crew.map(formatSoldier).join(' · ') : 'Załoga nieprzypisana'}</span>
        </div>
        <div className="flex items-start gap-2 text-field-800 poligon:text-stone-300">
          <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-army poligon:text-radar" />
          <span>Obsługa: {item.nextService} · {item.mileageKm.toLocaleString('pl-PL')} km</span>
        </div>
      </div>
    </motion.button>
  )
}

function EquipmentDetail({
  item,
  soldiers,
  nodes,
  onOpenCard,
}: {
  item: EquipmentItem
  soldiers: Soldier[]
  nodes: StructureNode[]
  onOpenCard: (item: EquipmentItem) => void
}) {
  const crew = resolveCrew(item, soldiers)
  const node = nodes.find((candidate) => candidate.id === item.assignedNodeId)

  return (
    <motion.aside
      key={item.id}
      initial={{ opacity: 0, x: 38 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.28 }}
      className="sticky top-28 rounded-[2rem] border border-white/75 bg-white/86 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/94"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
            Karta sprzętu
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
            {item.name}
          </h2>
          <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">{item.model}</p>
        </div>
        <div className="grid h-20 w-24 place-items-center rounded-3xl bg-olive font-display text-3xl font-bold uppercase text-white shadow-olive poligon:bg-radar poligon:text-night">
          {item.silhouette}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={`rounded-2xl border p-3 ${statusStyles[item.status]}`}>
          <p className="text-[0.64rem] font-black uppercase tracking-[0.18em]">Status</p>
          <p className="font-display text-2xl font-bold">{statusLabels[item.status]}</p>
        </div>
        <div className="rounded-2xl border border-olive/15 bg-parchment p-3 text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar">
          <p className="text-[0.64rem] font-black uppercase tracking-[0.18em]">Kategoria</p>
          <p className="font-display text-2xl font-bold">{categoryLabels[item.category]}</p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-olive/12 bg-parchment/75 p-4 poligon:border-white/8 poligon:bg-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-field-500 poligon:text-stone-500">Gotowość techniczna</span>
          <span className="font-display text-4xl font-bold text-olive poligon:text-radar">{item.readinessPercent}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-sand poligon:bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.readinessPercent}%` }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-army poligon:bg-radar"
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm font-semibold text-field-800 poligon:text-stone-300">
        <div className="flex gap-3 rounded-2xl border border-olive/10 bg-white/55 p-3 poligon:border-white/8 poligon:bg-white/5">
          <MapPin className="h-5 w-5 shrink-0 text-army poligon:text-radar" />
          <span>{item.location}</span>
        </div>
        <div className="flex gap-3 rounded-2xl border border-olive/10 bg-white/55 p-3 poligon:border-white/8 poligon:bg-white/5">
          <CalendarClock className="h-5 w-5 shrink-0 text-army poligon:text-radar" />
          <span>Następna obsługa: {item.nextService}</span>
        </div>
        <div className="flex gap-3 rounded-2xl border border-olive/10 bg-white/55 p-3 poligon:border-white/8 poligon:bg-white/5">
          <Gauge className="h-5 w-5 shrink-0 text-army poligon:text-radar" />
          <span>Przebieg / resurs: {item.mileageKm.toLocaleString('pl-PL')} km</span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-field-500 poligon:text-stone-500">
          Załoga i przypisanie
        </p>
        <div className="mt-3 space-y-2">
          <div className="rounded-2xl border border-olive/10 bg-white/55 p-3 text-sm font-bold text-olive poligon:border-white/8 poligon:bg-white/5 poligon:text-radar">
            {node?.name ?? 'Sekcja nieprzypisana'}
          </div>
          {crew.map((soldier) => (
            <div key={soldier.id} className="rounded-2xl border border-olive/10 bg-parchment/75 p-3 poligon:border-white/8 poligon:bg-white/5">
              <p className="font-display text-xl font-bold uppercase text-charcoal poligon:text-poligon-50">
                {formatSoldier(soldier)}
              </p>
              <p className="text-sm font-semibold text-field-500 poligon:text-stone-400">{soldier.role}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenCard(item)}
        className="mt-5 w-full rounded-2xl bg-olive px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-olive transition hover:scale-[1.01] poligon:bg-radar poligon:text-night"
      >
        Otwórz kartę szczegółową
      </button>
    </motion.aside>
  )
}

function EquipmentDetailModal({
  item,
  soldiers,
  nodes,
  onClose,
}: {
  item: EquipmentItem
  soldiers: Soldier[]
  nodes: StructureNode[]
  onClose: () => void
}) {
  const updateEquipment = useLogcomStore((state) => state.updateEquipment)
  const crew = resolveCrew(item, soldiers)
  const node = nodes.find((candidate) => candidate.id === item.assignedNodeId)
  const [form, setForm] = useState<EquipmentEditState>(() => ({
    status: item.status,
    readinessPercent: item.readinessPercent,
    mileageKm: item.mileageKm,
    motohours: item.motohours,
    fuelLevelPercent: item.fuelLevelPercent,
    lastInspection: item.lastInspection,
    nextService: item.nextService,
    serviceWindow: item.serviceWindow,
    serviceStatus: item.serviceStatus,
    notes: item.notes,
  }))

  const updateForm = <Key extends keyof EquipmentEditState>(field: Key, value: EquipmentEditState[Key]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateEquipment(item.id, form)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-charcoal/60 p-3 backdrop-blur-sm poligon:bg-black/72 lg:place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        initial={{ opacity: 0, x: 90 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 90 }}
        transition={{ duration: 0.26 }}
        onSubmit={handleSubmit}
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/75 bg-parchment p-5 shadow-command poligon:border-poligon-border poligon:bg-poligon-surface"
      >
        <div className="flex flex-col gap-4 border-b border-olive/10 pb-5 poligon:border-white/8 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="grid h-20 w-24 shrink-0 place-items-center rounded-3xl bg-olive font-display text-3xl font-bold uppercase text-white shadow-olive poligon:bg-radar poligon:text-night">
              {item.silhouette}
            </div>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
                Karta szczegółowa sprzętu
              </p>
              <h2 className="mt-1 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
                {item.name}
              </h2>
              <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">
                {item.model} · {item.registration} · {categoryLabels[item.category]}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="self-start rounded-2xl border border-olive/15 bg-white/75 p-3 text-olive transition hover:bg-white poligon:border-white/10 poligon:bg-white/5 poligon:text-radar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-olive/10 bg-white/55 p-4 poligon:border-white/8 poligon:bg-white/5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-army poligon:text-radar">
                Edycja statusu i resursów
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) => updateForm('status', event.target.value as EquipmentStatus)}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <NumberField
                  label="Gotowość [%]"
                  value={form.readinessPercent}
                  min={0}
                  max={100}
                  onChange={(value) => updateForm('readinessPercent', value)}
                />
                <NumberField
                  label="Przebieg [km]"
                  value={form.mileageKm}
                  min={0}
                  onChange={(value) => updateForm('mileageKm', value)}
                />
                <NumberField
                  label="Motogodziny"
                  value={form.motohours}
                  min={0}
                  onChange={(value) => updateForm('motohours', value)}
                />
                <NumberField
                  label="Paliwo [%]"
                  value={form.fuelLevelPercent}
                  min={0}
                  max={100}
                  onChange={(value) => updateForm('fuelLevelPercent', value)}
                />
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
                  Ostatni przegląd
                  <input
                    type="date"
                    value={form.lastInspection}
                    onChange={(event) => updateForm('lastInspection', event.target.value)}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
                  Następna obsługa
                  <input
                    type="date"
                    value={form.nextService}
                    onChange={(event) => updateForm('nextService', event.target.value)}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
                  Okno obsługowe
                  <input
                    value={form.serviceWindow}
                    onChange={(event) => updateForm('serviceWindow', event.target.value)}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400 md:col-span-2">
                  Status obsługi
                  <input
                    value={form.serviceStatus}
                    onChange={(event) => updateForm('serviceStatus', event.target.value)}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400 md:col-span-2">
                  Notatki techniczne
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateForm('notes', event.target.value)}
                    rows={4}
                    className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-olive/10 bg-white/55 p-4 poligon:border-white/8 poligon:bg-white/5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-army poligon:text-radar">
                Historia obsług
              </p>
              <div className="mt-4 space-y-3">
                {item.serviceHistory.map((entry) => (
                  <div key={`${entry.date}-${entry.type}`} className="rounded-2xl border border-olive/10 bg-parchment/75 p-4 poligon:border-white/8 poligon:bg-white/5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-xl font-bold uppercase text-charcoal poligon:text-poligon-50">{entry.type}</p>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">{entry.date} · {entry.technician}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] ${statusStyles[item.status]}`}>
                        {statusLabels[item.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-field-800 poligon:text-stone-300">{entry.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-olive/10 bg-white/55 p-4 poligon:border-white/8 poligon:bg-white/5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-army poligon:text-radar">
                Załoga i przydział
              </p>
              <div className="mt-4 rounded-2xl border border-olive/10 bg-parchment/75 p-3 text-sm font-bold text-olive poligon:border-white/8 poligon:bg-white/5 poligon:text-radar">
                {node?.name ?? 'Sekcja nieprzypisana'}
              </div>
              <div className="mt-3 space-y-2">
                {crew.map((soldier) => (
                  <div key={soldier.id} className="rounded-2xl border border-olive/10 bg-parchment/75 p-3 poligon:border-white/8 poligon:bg-white/5">
                    <p className="font-display text-xl font-bold uppercase text-charcoal poligon:text-poligon-50">
                      {formatSoldier(soldier)}
                    </p>
                    <p className="text-sm font-semibold text-field-500 poligon:text-stone-400">{soldier.role}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-olive/10 bg-white/55 p-4 poligon:border-white/8 poligon:bg-white/5">
              <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-army poligon:text-radar">
                Szybki stan
              </p>
              <div className="mt-4 grid gap-3">
                <ResourceBar label="Gotowość" value={form.readinessPercent} />
                <ResourceBar label="Paliwo" value={form.fuelLevelPercent} />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-olive/15 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-olive poligon:border-white/10 poligon:text-radar"
          >
            Anuluj
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-olive px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-olive poligon:bg-radar poligon:text-night"
          >
            Zapisz kartę
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
      />
    </label>
  )
}

function ResourceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">
        <span>{label}</span>
        <span className="font-mono text-olive poligon:text-radar">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand poligon:bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-army poligon:bg-radar"
        />
      </div>
    </div>
  )
}

export function EquipmentView() {
  const equipment = useLogcomStore((state) => state.equipment)
  const structure = useLogcomStore((state) => state.structure)
  const soldiers = useMemo(() => flattenSoldiers(structure), [structure])
  const nodes = useMemo(() => flattenNodes(structure), [structure])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedId, setSelectedId] = useState(equipment[0]?.id ?? '')
  const [modalItemId, setModalItemId] = useState<string | null>(null)

  const filteredEquipment = equipment.filter((item) => (
    (statusFilter === 'all' || item.status === statusFilter)
    && (categoryFilter === 'all' || item.category === categoryFilter)
  ))
  const selectedItem = equipment.find((item) => item.id === selectedId) ?? filteredEquipment[0] ?? equipment[0]
  const modalItem = modalItemId ? equipment.find((item) => item.id === modalItemId) : null
  const openEquipmentModal = (item: EquipmentItem) => {
    setSelectedId(item.id)
    setModalItemId(item.id)
  }
  const readyCount = equipment.filter((item) => item.status === 'ready').length
  const attentionCount = equipment.length - readyCount
  const averageReadiness = Math.round(
    equipment.reduce((sum, item) => sum + item.readinessPercent, 0) / Math.max(equipment.length, 1),
  )

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
              MODUŁ 3 / EWIDENCJA
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Ewidencja sprzętu
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Pojazdy i urządzenia logistyczne z gotowością, resursami, lokalizacją i załogą pobieraną ze struktury kompanii.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-army/30 bg-army/12 p-3 text-center text-olive poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar">
              <p className="font-display text-4xl font-bold leading-none">{readyCount}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Sprawne</p>
            </div>
            <div className="rounded-2xl border border-warning/35 bg-warning/10 p-3 text-center text-warning poligon:text-amber-200">
              <p className="font-display text-4xl font-bold leading-none">{attentionCount}</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Uwagi</p>
            </div>
            <div className="rounded-2xl border border-olive/15 bg-parchment p-3 text-center text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar">
              <p className="font-display text-4xl font-bold leading-none">{averageReadiness}%</p>
              <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">Śr. got.</p>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-[1.75rem] border border-white/75 bg-white/75 p-4 shadow-soft backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/82"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-bold uppercase text-charcoal poligon:text-poligon-50">
            <Filter className="h-5 w-5 text-army poligon:text-radar" />
            Filtry ewidencji
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'ready', 'limited', 'service', 'down'] as StatusFilter[]).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:scale-[1.03] ${
                  statusFilter === status
                    ? 'border-olive bg-olive text-white poligon:border-radar poligon:bg-radar poligon:text-night'
                    : 'border-olive/15 bg-parchment text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar'
                }`}
              >
                {status === 'all' ? 'Wszystkie' : statusLabels[status]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'truck', 'tanker', 'command', 'kitchen', 'recovery'] as CategoryFilter[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition hover:scale-[1.03] ${
                  categoryFilter === category
                    ? 'border-army bg-army text-white poligon:border-radar poligon:bg-radar poligon:text-night'
                    : 'border-olive/15 bg-parchment text-field-800 poligon:border-white/10 poligon:bg-white/5 poligon:text-stone-300'
                }`}
              >
                {category === 'all' ? 'Kategorie' : categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-[1fr_25rem]">
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredEquipment.map((item, index) => (
            <EquipmentCard
              key={item.id}
              item={item}
              index={index}
              soldiers={soldiers}
              active={selectedItem?.id === item.id}
              onSelect={(itemId) => {
                const item = equipment.find((candidate) => candidate.id === itemId)
                if (item) {
                  openEquipmentModal(item)
                }
              }}
            />
          ))}
          {!filteredEquipment.length ? (
            <div className="rounded-[1.75rem] border border-dashed border-olive/30 bg-white/70 p-8 text-center font-semibold text-field-500 poligon:border-radar/30 poligon:bg-white/5 poligon:text-stone-400">
              Brak sprzętu dla wybranych filtrów.
            </div>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          {selectedItem ? (
            <EquipmentDetail
              item={selectedItem}
              soldiers={soldiers}
              nodes={nodes}
              onOpenCard={openEquipmentModal}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-[1.75rem] border border-army/20 bg-army/10 p-4 text-sm font-semibold text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar"
      >
        <ShieldCheck className="mr-2 inline h-5 w-5" />
        Moduł 3 ma działającą ewidencję, filtrowanie i kartę szczegółową połączoną ze strukturą organizacyjną.
      </motion.div>

      <AnimatePresence>
        {modalItem ? (
          <EquipmentDetailModal
            key={modalItem.id}
            item={modalItem}
            soldiers={soldiers}
            nodes={nodes}
            onClose={() => setModalItemId(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
