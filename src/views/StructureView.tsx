import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgePlus,
  BriefcaseBusiness,
  Car,
  ChevronDown,
  ClipboardPenLine,
  Fuel,
  Radio,
  Shield,
  Soup,
  Truck,
  UserRound,
  Users,
  Wrench,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { useLogcomStore } from '../store/useLogcomStore'
import type { Soldier, SoldierStatus, StructureNode } from '../types/logcom'

type SoldierFormState = Pick<Soldier, 'status' | 'rank' | 'firstName' | 'lastName' | 'role' | 'functionIcon' | 'vehicle'>

type ModalState = {
  nodeId: string
  nodeName: string
  soldier?: Soldier
}

const statusLabels: Record<SoldierStatus, string> = {
  present: 'OBECNY',
  leave: 'URLOP',
  sl: 'S/L',
  vacancy: 'WAKAT',
}

const statusStyles: Record<SoldierStatus, string> = {
  present: 'border-army/35 bg-army/12 text-olive poligon:border-radar/35 poligon:bg-radar/10 poligon:text-radar',
  leave: 'border-warning/35 bg-warning/12 text-warning poligon:border-warning/45 poligon:bg-warning/15 poligon:text-amber-200',
  sl: 'border-coyote/45 bg-coyote/16 text-field-800 poligon:border-coyote/45 poligon:bg-coyote/12 poligon:text-coyote',
  vacancy: 'border-critical/35 bg-critical/12 text-critical poligon:border-critical/45 poligon:bg-critical/15 poligon:text-red-200',
}

const iconMap: Record<string, typeof UserRound> = {
  command: Shield,
  admin: ClipboardPenLine,
  staff: BriefcaseBusiness,
  radio: Radio,
  driver: Car,
  team: Users,
  equipment: Wrench,
  fuel: Fuel,
  food: Soup,
}

const functionOptions = [
  { value: 'command', label: 'Dowodzenie' },
  { value: 'admin', label: 'Administracja' },
  { value: 'staff', label: 'Sztab' },
  { value: 'radio', label: 'Lacznosc' },
  { value: 'driver', label: 'Kierowca' },
  { value: 'team', label: 'Druzyna' },
  { value: 'equipment', label: 'Sprzet' },
  { value: 'fuel', label: 'MPS' },
  { value: 'food', label: 'Zywienie' },
]

const roleIconRules: Array<[string, string]> = [
  ['dowodca', 'command'],
  ['szef kompanii', 'admin'],
  ['ewidencji', 'admin'],
  ['s-4', 'staff'],
  ['radiotelefonista', 'radio'],
  ['lacznosc', 'radio'],
  ['kierowca', 'driver'],
  ['operator hds', 'equipment'],
  ['mechanik', 'equipment'],
  ['diagnosta', 'equipment'],
  ['mps', 'fuel'],
  ['cysterny', 'fuel'],
  ['kuch', 'food'],
  ['zyw', 'food'],
  ['druzyny', 'team'],
]

const defaultFormState: SoldierFormState = {
  status: 'present',
  rank: 'szer.',
  firstName: '',
  lastName: '',
  role: '',
  functionIcon: 'team',
  vehicle: 'brak',
}

function flattenSoldiers(nodes: StructureNode[]): Soldier[] {
  return nodes.flatMap((node) => [
    ...node.soldiers,
    ...flattenSoldiers(node.children ?? []),
  ])
}

function countNodes(nodes: StructureNode[], category: StructureNode['category']): number {
  return nodes.reduce((sum, node) => (
    sum + (node.category === category ? 1 : 0) + countNodes(node.children ?? [], category)
  ), 0)
}

function getFunctionIcon(role: string) {
  const normalizedRole = role.toLowerCase()
  return roleIconRules.find(([needle]) => normalizedRole.includes(needle))?.[1] ?? 'team'
}

function formatSoldierName(soldier: Soldier) {
  if (soldier.status === 'vacancy') {
    return 'WAKAT'
  }

  return `${soldier.firstName} ${soldier.lastName}`.trim()
}

function SoldierCard({
  soldier,
  nodeId,
  onEdit,
}: {
  soldier: Soldier
  nodeId: string
  onEdit: (modalState: ModalState) => void
}) {
  const Icon = iconMap[soldier.functionIcon] ?? UserRound
  const isDimmed = soldier.status === 'leave' || soldier.status === 'sl'
  const isVacancy = soldier.status === 'vacancy'

  return (
    <motion.button
      layout
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={() => onEdit({ nodeId, nodeName: '', soldier })}
      className={`group rounded-2xl p-4 text-left shadow-soft transition poligon:border-white/8 ${
        isVacancy
          ? 'border-2 border-dashed border-critical/60 bg-critical/12 poligon:border-critical/70 poligon:bg-critical/15'
          : 'border border-olive/10 bg-parchment/78 poligon:bg-white/5'
      } ${isDimmed ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-2xl p-3 transition group-hover:bg-olive group-hover:text-white poligon:group-hover:bg-radar poligon:group-hover:text-night ${
          isVacancy
            ? 'bg-critical/15 text-critical poligon:bg-critical/20 poligon:text-red-200'
            : 'bg-army/14 text-olive poligon:bg-radar/12 poligon:text-radar'
        }`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-display text-lg font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
                {soldier.rank} {formatSoldierName(soldier)}
              </p>
              <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">{soldier.role}</p>
            </div>
            <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.16em] ${statusStyles[soldier.status]}`}>
              {statusLabels[soldier.status]}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-field-500 poligon:text-stone-500">
            <Truck className="h-4 w-4" />
            {soldier.vehicle}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function StructureBranch({
  node,
  depth = 0,
  expandedIds,
  onToggle,
  onOpenModal,
}: {
  node: StructureNode
  depth?: number
  expandedIds: Set<string>
  onToggle: (nodeId: string) => void
  onOpenModal: (modalState: ModalState) => void
}) {
  const isExpanded = expandedIds.has(node.id)
  const childCount = node.children?.length ?? 0

  return (
    <motion.section
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, delay: depth * 0.04 }}
      className="rounded-[1.75rem] border border-white/70 bg-white/82 p-4 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => onToggle(node.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <motion.span
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.18 }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-olive text-white poligon:bg-radar poligon:text-night"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.span>
          <span className="min-w-0">
            <span className="block font-display text-2xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
              {node.name}
            </span>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-500">
              {node.callsign} · {node.category} · {node.soldiers.length} stanowisk
            </span>
          </span>
        </button>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-olive/15 bg-parchment px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar">
            {childCount} sekcje
          </span>
          <button
            type="button"
            onClick={() => onOpenModal({ nodeId: node.id, nodeName: node.name })}
            className="inline-flex items-center gap-2 rounded-full bg-olive px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white shadow-olive transition hover:-translate-y-0.5 poligon:bg-radar poligon:text-night"
          >
            <BadgePlus className="h-4 w-4" />
            Dodaj
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-field-800 poligon:text-stone-300">{node.description}</p>

      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            key="branch-content"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.26 }}
            className="mt-4 space-y-4"
          >
            <div className="grid gap-3 xl:grid-cols-2">
              {node.soldiers.map((soldier) => (
                <SoldierCard
                  key={soldier.id}
                  soldier={soldier}
                  nodeId={node.id}
                  onEdit={(modalState) => onOpenModal({ ...modalState, nodeName: node.name })}
                />
              ))}
            </div>
            {node.children?.length ? (
              <div className="space-y-3 border-l-2 border-olive/15 pl-3 poligon:border-radar/15 md:pl-5">
                {node.children.map((child) => (
                  <StructureBranch
                    key={child.id}
                    node={child}
                    depth={depth + 1}
                    expandedIds={expandedIds}
                    onToggle={onToggle}
                    onOpenModal={onOpenModal}
                  />
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}

function SoldierModal({
  modalState,
  onClose,
}: {
  modalState: ModalState | null
  onClose: () => void
}) {
  const upsertSoldier = useLogcomStore((state) => state.upsertSoldier)
  const [form, setForm] = useState<SoldierFormState>(() => ({
    ...defaultFormState,
    ...(modalState?.soldier ?? {}),
  }))

  if (!modalState) {
    return null
  }

  const updateForm = (field: keyof SoldierFormState, value: string) => {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'role') {
        next.functionIcon = getFunctionIcon(value)
      }
      if (field === 'status' && value === 'vacancy') {
        next.firstName = ''
        next.lastName = 'WAKAT'
      }
      return next
    })
  }

  const markVacancy = () => {
    setForm((current) => ({
      ...current,
      status: 'vacancy',
      firstName: '',
      lastName: 'WAKAT',
      functionIcon: getFunctionIcon(current.role),
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    upsertSoldier(modalState.nodeId, {
      id: modalState.soldier?.id ?? `${modalState.nodeId}-${Date.now()}`,
      ...form,
      functionIcon: getFunctionIcon(form.role),
      firstName: form.status === 'vacancy' ? '' : form.firstName.trim(),
      lastName: form.status === 'vacancy' ? 'WAKAT' : form.lastName.trim().toUpperCase(),
    })
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-charcoal/55 p-3 backdrop-blur-sm poligon:bg-black/70 md:place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.24 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-[2rem] border border-white/75 bg-parchment p-5 shadow-command poligon:border-poligon-border poligon:bg-poligon-surface"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
              {modalState.soldier ? 'Edycja zolnierza' : 'Dodaj zolnierza'}
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold uppercase text-charcoal poligon:text-poligon-50">
              {modalState.nodeName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-olive/15 bg-white/75 p-3 text-olive transition hover:bg-white poligon:border-white/10 poligon:bg-white/5 poligon:text-radar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-3xl border border-olive/10 bg-white/45 p-3 poligon:border-white/8 poligon:bg-white/5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Status
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Object.entries(statusLabels).map(([value, label]) => {
              const status = value as SoldierStatus
              const active = form.status === status
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateForm('status', status)}
                  className={`rounded-2xl border px-3 py-3 text-xs font-black uppercase tracking-[0.14em] transition hover:scale-[1.02] ${
                    active
                      ? statusStyles[status]
                      : 'border-olive/12 bg-parchment/70 text-field-500 poligon:border-white/8 poligon:bg-white/5 poligon:text-stone-400'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Stopien
            <input
              value={form.rank}
              onChange={(event) => updateForm('rank', event.target.value)}
              className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Imie
            <input
              value={form.firstName}
              onChange={(event) => updateForm('firstName', event.target.value)}
              disabled={form.status === 'vacancy'}
              className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army disabled:opacity-50 poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Nazwisko
            <input
              value={form.lastName}
              onChange={(event) => updateForm('lastName', event.target.value)}
              disabled={form.status === 'vacancy'}
              className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army disabled:opacity-50 poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Funkcja
            <input
              value={form.role}
              onChange={(event) => updateForm('role', event.target.value)}
              className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
            />
          </label>
          <div className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400">
            Ikona funkcji
            <div className="rounded-2xl border border-olive/15 bg-white/65 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50">
              Auto: {functionOptions.find((option) => option.value === getFunctionIcon(form.role))?.label ?? 'Druzyna'}
            </div>
          </div>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.16em] text-field-500 poligon:text-stone-400 md:col-span-2">
            Pojazd
            <input
              value={form.vehicle}
              onChange={(event) => updateForm('vehicle', event.target.value)}
              className="rounded-2xl border border-olive/15 bg-white/80 px-4 py-3 text-sm font-semibold normal-case tracking-normal text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={markVacancy}
            className="mr-auto rounded-2xl border border-dashed border-critical/45 bg-critical/10 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-critical poligon:bg-critical/15 poligon:text-red-200"
          >
            Oznacz jako WAKAT
          </button>
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
            Zapisz
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export function StructureView() {
  const structure = useLogcomStore((state) => state.structure)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['command', 'staff', 'transport-platoon', 'transport-team-1', 'supply-platoon', 'maintenance-platoon']),
  )
  const [modalState, setModalState] = useState<ModalState | null>(null)

  const soldiers = useMemo(() => flattenSoldiers(structure), [structure])
  const counters = useMemo(() => ({
    total: soldiers.length,
    present: soldiers.filter((soldier) => soldier.status === 'present').length,
    vacancy: soldiers.filter((soldier) => soldier.status === 'vacancy').length,
    sl: soldiers.filter((soldier) => soldier.status === 'sl').length,
    leave: soldiers.filter((soldier) => soldier.status === 'leave').length,
    platoons: countNodes(structure, 'platoon'),
    squads: countNodes(structure, 'squad'),
  }), [soldiers, structure])

  const toggleNode = (nodeId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const pills = [
    { label: 'OBECNI', value: counters.present, tone: 'text-olive bg-army/12 border-army/30 poligon:text-radar poligon:bg-radar/10 poligon:border-radar/30' },
    { label: 'WAKATY', value: counters.vacancy, tone: 'text-critical bg-critical/10 border-critical/30 poligon:text-red-200 poligon:bg-critical/15' },
    { label: 'S/L', value: counters.sl, tone: 'text-field-800 bg-coyote/16 border-coyote/40 poligon:text-coyote poligon:bg-coyote/12' },
    { label: 'URLOP', value: counters.leave, tone: 'text-warning bg-warning/10 border-warning/35 poligon:text-amber-200 poligon:bg-warning/15' },
  ]

  return (
    <>
      <div className="space-y-5">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
        >
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
                MODUL 2 / STRUKTURA
              </p>
              <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
                Struktura organizacyjna kompanii
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
                Hierarchia dowodzenia, plutony, druzyny i obsada stanowisk. Zmiana statusu zolnierza
                natychmiast aktualizuje liczniki stanu osobowego.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {pills.map((pill) => (
                <div key={pill.label} className={`rounded-2xl border p-3 text-center ${pill.tone}`}>
                  <p className="font-display text-4xl font-bold leading-none">{pill.value}</p>
                  <p className="mt-1 text-[0.64rem] font-black uppercase tracking-[0.18em]">{pill.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-3 border-t border-olive/10 pt-4 poligon:border-white/8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-field-500 poligon:text-stone-500">Stan etatowy</p>
              <p className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">{counters.total}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-field-500 poligon:text-stone-500">Plutony</p>
              <p className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">{counters.platoons}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-field-500 poligon:text-stone-500">Druzyny</p>
              <p className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">{counters.squads}</p>
            </div>
          </div>
        </motion.header>

        <div className="space-y-4">
          {structure.map((node) => (
            <StructureBranch
              key={node.id}
              node={node}
              expandedIds={expandedIds}
              onToggle={toggleNode}
              onOpenModal={setModalState}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalState ? (
          <SoldierModal
            key={`${modalState.nodeId}-${modalState.soldier?.id ?? 'new'}`}
            modalState={modalState}
            onClose={() => setModalState(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
