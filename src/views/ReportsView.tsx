import { motion } from 'framer-motion'
import { CheckCircle2, ClipboardCopy, FileDown, FileText, Send, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useLogcomStore } from '../store/useLogcomStore'
import type { NatoReportTemplate, Soldier, StructureNode } from '../types/logcom'

type ReportSectionKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type ManualSections = Pick<Record<ReportSectionKey, string>, 'F' | 'G'>

const sectionTitles: Record<ReportSectionKey, string> = {
  A: 'A. Identyfikacja i czas',
  B: 'B. Stan osobowy',
  C: 'C. Sprzęt i gotowość techniczna',
  D: 'D. Paliwo / MPS',
  E: 'E. Transport i konwoje',
  F: 'F. Ocena dowódcy',
  G: 'G. Wnioski / zapotrzebowanie',
}

const priorityStyles: Record<NatoReportTemplate['priority'], string> = {
  routine: 'border-olive/20 bg-parchment text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-stone-300',
  priority: 'border-warning/35 bg-warning/10 text-warning poligon:text-amber-200',
  immediate: 'border-critical/35 bg-critical/10 text-critical poligon:text-red-200',
}

function flattenSoldiers(nodes: StructureNode[]): Soldier[] {
  return nodes.flatMap((node) => [
    ...node.soldiers,
    ...flattenSoldiers(node.children ?? []),
  ])
}

function formatReport(sections: Record<ReportSectionKey, string>) {
  return (Object.keys(sectionTitles) as ReportSectionKey[])
    .map((key) => `${sectionTitles[key]}\n${sections[key]}`)
    .join('\n\n')
}

export function ReportsView() {
  const commander = useLogcomStore((state) => state.commander)
  const reportTemplates = useLogcomStore((state) => state.reportTemplates)
  const structure = useLogcomStore((state) => state.structure)
  const equipment = useLogcomStore((state) => state.equipment)
  const fuel = useLogcomStore((state) => state.fuel)
  const convoys = useLogcomStore((state) => state.convoys)
  const [activeReportId, setActiveReportId] = useState(reportTemplates[0]?.id ?? 'LOGSITREP')
  const [manualSections, setManualSections] = useState<ManualSections>({
    F: 'Zdolność kompanii logistycznej utrzymana. Ryzyko średnie: obsługa WPT LOG-62 i ograniczona gotowość Star 266.',
    G: 'Wnioskować o priorytet części pneumatycznych do Star 266 oraz potwierdzić slot tankowania dla K-12.',
  })
  const [actionStatus, setActionStatus] = useState('Gotowy do generowania')

  const soldiers = useMemo(() => flattenSoldiers(structure), [structure])
  const activeTemplate = reportTemplates.find((item) => item.id === activeReportId) ?? reportTemplates[0]
  const present = soldiers.filter((soldier) => soldier.status === 'present').length
  const vacancies = soldiers.filter((soldier) => soldier.status === 'vacancy').length
  const readyEquipment = equipment.filter((item) => item.status === 'ready').length
  const serviceEquipment = equipment.filter((item) => item.status === 'service' || item.status === 'limited').length
  const movingConvoys = convoys.filter((convoy) => convoy.status === 'moving').length
  const fuelPercent = Math.round((fuel.currentLiters / fuel.capacityLiters) * 100)

  const sections: Record<ReportSectionKey, string> = {
    A: `${activeTemplate.id} / ${commander.brigadeCode} / ${commander.unit}. Czas: ${new Date().toLocaleString('pl-PL')}. Odpowiedzialny: ${commander.rank} ${commander.lastName}.`,
    B: `Stan osobowy: ${present}/${soldiers.length} obecnych. WAKATY: ${vacancies}. S/L: ${soldiers.filter((soldier) => soldier.status === 'sl').length}. URLOP: ${soldiers.filter((soldier) => soldier.status === 'leave').length}.`,
    C: `Sprzęt: ${readyEquipment}/${equipment.length} pozycji sprawnych. Ograniczenia/obsługa: ${serviceEquipment}. Kluczowe pozycje: ${equipment.map((item) => `${item.name} ${item.readinessPercent}%`).join('; ')}.`,
    D: `MPS: ${fuel.currentLiters.toLocaleString('pl-PL')} l / ${fuel.capacityLiters.toLocaleString('pl-PL')} l (${fuelPercent}%). DOS: ${fuel.dos.toFixed(1)}. Prognoza autonomii: ${fuel.forecastHours} h.`,
    E: `Konwoje aktywne: ${convoys.length}; w ruchu: ${movingConvoys}. ${convoys.map((convoy) => `${convoy.callsign}: ${convoy.route}, ładunek: ${convoy.cargo}, ETA ${convoy.eta}`).join(' | ')}.`,
    F: manualSections.F,
    G: manualSections.G,
  }
  const reportText = formatReport(sections)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText)
    setActionStatus('Skopiowano tekst meldunku do schowka')
  }

  const handleExport = () => {
    const blob = new Blob([reportText], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${activeTemplate.id}-LOGCOM.docx`
    anchor.click()
    URL.revokeObjectURL(url)
    setActionStatus('Wygenerowano plik DOCX z treścią meldunku')
  }

  const handleApprove = () => {
    setActionStatus(`Meldunek ${activeTemplate.id} zatwierdzony i oznaczony jako wysłany`)
  }

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
              MODUŁ 6 / NATO REPORTS
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Generator meldunków NATO
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Meldunki logistyczne generowane z jednego źródła danych LOGCOM: personel, sprzęt, paliwo i konwoje.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-army/25 bg-army/12 p-4 text-olive poligon:border-radar/30 poligon:bg-radar/10 poligon:text-radar">
            <p className="text-xs font-black uppercase tracking-[0.2em]">Auto-fill</p>
            <p className="font-display text-7xl font-bold leading-none">{activeTemplate.autoFillPercent}%</p>
            <p className="mt-2 text-sm font-semibold">Sekcje A-E wypełnione automatycznie z danych aplikacji.</p>
          </div>
        </div>
      </motion.header>

      <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
        <section className="space-y-3">
          {reportTemplates.map((template, index) => {
            const isActive = template.id === activeTemplate.id
            return (
              <motion.button
                key={template.id}
                type="button"
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setActiveReportId(template.id)}
                className={`w-full rounded-[1.5rem] border p-4 text-left shadow-soft transition hover:scale-[1.01] ${
                  isActive
                    ? 'border-olive bg-army/12 ring-2 ring-army/20 poligon:border-radar poligon:bg-radar/10'
                    : 'border-white/70 bg-white/82 poligon:border-poligon-border poligon:bg-poligon-surface/88'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-3xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50">
                      {template.id}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-field-800 poligon:text-stone-300">{template.name}</p>
                  </div>
                  <FileText className="h-5 w-5 text-olive poligon:text-radar" />
                </div>
                <p className="mt-3 text-sm leading-6 text-field-800 poligon:text-stone-300">{template.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`rounded-full border px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] ${priorityStyles[template.priority]}`}>
                    {template.priority}
                  </span>
                  <span className="font-mono text-xs font-bold text-olive poligon:text-radar">{template.autoFillPercent}% auto</span>
                </div>
              </motion.button>
            )
          })}
        </section>

        <section className="rounded-[2rem] border border-white/75 bg-white/86 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/92">
          <div className="flex flex-col gap-3 border-b border-olive/10 pb-4 poligon:border-white/8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
                Szczegół meldunku
              </p>
              <h2 className="mt-1 font-display text-4xl font-bold uppercase text-charcoal poligon:text-poligon-50">
                {activeTemplate.id}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleCopy} className="inline-flex items-center gap-2 rounded-2xl border border-olive/15 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-olive transition hover:scale-[1.02] poligon:border-white/10 poligon:text-radar">
                <ClipboardCopy className="h-4 w-4" />
                Kopiuj tekst
              </button>
              <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 rounded-2xl border border-olive/15 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-olive transition hover:scale-[1.02] poligon:border-white/10 poligon:text-radar">
                <FileDown className="h-4 w-4" />
                Eksport DOCX
              </button>
              <button type="button" onClick={handleApprove} className="inline-flex items-center gap-2 rounded-2xl bg-olive px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white shadow-olive transition hover:scale-[1.02] poligon:bg-radar poligon:text-night">
                <Send className="h-4 w-4" />
                Zatwierdź i wyślij
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {(Object.keys(sectionTitles) as ReportSectionKey[]).map((sectionKey) => (
              <motion.article
                key={sectionKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-olive/10 bg-parchment/75 p-4 poligon:border-white/8 poligon:bg-white/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold uppercase text-charcoal poligon:text-poligon-50">
                    {sectionTitles[sectionKey]}
                  </h3>
                  {sectionKey === 'F' || sectionKey === 'G' ? (
                    <span className="rounded-full border border-warning/35 bg-warning/10 px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-warning poligon:text-amber-200">
                      manual
                    </span>
                  ) : (
                    <span className="rounded-full border border-army/25 bg-army/10 px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.14em] text-olive poligon:text-radar">
                      auto
                    </span>
                  )}
                </div>
                {sectionKey === 'F' || sectionKey === 'G' ? (
                  <textarea
                    value={manualSections[sectionKey]}
                    onChange={(event) => setManualSections((current) => ({ ...current, [sectionKey]: event.target.value }))}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-olive/15 bg-white/85 px-4 py-3 text-sm font-semibold leading-6 text-charcoal outline-none focus:border-army poligon:border-white/10 poligon:bg-white/5 poligon:text-poligon-50"
                  />
                ) : (
                  <p className="mt-3 text-sm font-semibold leading-6 text-field-800 poligon:text-stone-300">{sections[sectionKey]}</p>
                )}
              </motion.article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-army/20 bg-army/10 p-4 text-sm font-semibold text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar">
            <CheckCircle2 className="mr-2 inline h-5 w-5" />
            {actionStatus}
          </div>
          <div className="mt-3 rounded-2xl border border-critical/20 bg-critical/8 p-4 text-sm font-semibold text-field-800 poligon:border-critical/35 poligon:bg-critical/10 poligon:text-red-100">
            <ShieldAlert className="mr-2 inline h-5 w-5 text-critical" />
            Sekcje F i G wymagają weryfikacji dowódcy przed wysłaniem.
          </div>
        </section>
      </div>
    </div>
  )
}
