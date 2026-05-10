import { motion } from 'framer-motion'
import { Beef, Bomb, Fuel, Gauge, PackageCheck, Plus, Utensils } from 'lucide-react'
import { useMemo, useState } from 'react'

type CalculatorTab = 'fuel' | 'food' | 'ammo'

const tabs: Array<{ id: CalculatorTab; label: string; icon: typeof Fuel }> = [
  { id: 'fuel', label: 'Paliwo', icon: Fuel },
  { id: 'food', label: 'Żywność', icon: Utensils },
  { id: 'ammo', label: 'Amunicja', icon: Bomb },
]

const fuelCoefficients = [
  { label: 'Teren', value: '1.18' },
  { label: 'Postój', value: '0.92' },
  { label: 'Rezerwa', value: '15%' },
]

const foodCoefficients = [
  { label: 'Racja dobowa', value: '3.2 kg' },
  { label: 'Woda', value: '5 l' },
  { label: 'Bufor', value: '12%' },
]

const ammoCoefficients = [
  { label: 'j.k. bojowa', value: '1.0' },
  { label: 'Trening', value: '0.35' },
  { label: 'Rezerwa', value: '20%' },
]

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-3 rounded-3xl border border-olive/10 bg-white/62 p-4 poligon:border-white/8 poligon:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-field-500 poligon:text-stone-400">
          {label}
        </span>
        <span className="font-display text-3xl font-bold text-charcoal poligon:text-poligon-50">
          {value.toLocaleString('pl-PL')} {unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-olive poligon:accent-radar"
      />
    </label>
  )
}

function CoefficientPills({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item.label}
          className="rounded-full border border-olive/15 bg-parchment px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-olive poligon:border-radar/20 poligon:bg-radar/10 poligon:text-radar"
        >
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  )
}

export function CalculatorView() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('fuel')
  const [vehicles, setVehicles] = useState(26)
  const [fuelNorm, setFuelNorm] = useState(42)
  const [hours, setHours] = useState(24)
  const [fuelStock, setFuelStock] = useState(25200)

  const [personnel, setPersonnel] = useState(68)
  const [days, setDays] = useState(3)
  const [foodStock, setFoodStock] = useState(920)

  const [ammoUnits, setAmmoUnits] = useState(18)
  const [ammoNorm, setAmmoNorm] = useState(0.72)
  const [ammoStock, setAmmoStock] = useState(21)

  const fuelResult = useMemo(() => {
    const consumption = vehicles * fuelNorm * (hours / 24) * 1.18
    const reserve = consumption * 1.15
    return {
      requirement: Math.round(reserve),
      dos: fuelStock / Math.max(consumption, 1),
      consumption: Math.round(consumption),
    }
  }, [fuelNorm, fuelStock, hours, vehicles])

  const foodResult = useMemo(() => {
    const requirement = personnel * days * 3.2 * 1.12
    return {
      requirement: Math.round(requirement),
      dos: foodStock / Math.max(personnel * 3.2, 1),
      water: personnel * days * 5,
    }
  }, [days, foodStock, personnel])

  const ammoResult = useMemo(() => {
    const requirement = ammoUnits * ammoNorm * 1.2
    return {
      requirement: Number(requirement.toFixed(1)),
      dos: ammoStock / Math.max(ammoUnits * ammoNorm, 1),
      reserve: Number((requirement - ammoUnits * ammoNorm).toFixed(1)),
    }
  }, [ammoNorm, ammoStock, ammoUnits])

  const hero = activeTab === 'fuel'
    ? {
        title: 'DOS paliwa',
        value: fuelResult.dos.toFixed(1),
        unit: 'doby',
        detail: `Wymagane ${fuelResult.requirement.toLocaleString('pl-PL')} l z rezerwą.`,
        icon: Fuel,
      }
    : activeTab === 'food'
      ? {
          title: 'DOS żywności',
          value: foodResult.dos.toFixed(1),
          unit: 'doby',
          detail: `Potrzeba ${foodResult.requirement.toLocaleString('pl-PL')} kg i ${foodResult.water.toLocaleString('pl-PL')} l wody.`,
          icon: Beef,
        }
      : {
          title: 'DOS amunicji',
          value: ammoResult.dos.toFixed(1),
          unit: 'j.k.',
          detail: `Wymagane ${ammoResult.requirement} j.k. z rezerwą ${ammoResult.reserve} j.k.`,
          icon: Bomb,
        }
  const HeroIcon = hero.icon

  return (
    <div className="space-y-5">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="overflow-hidden rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.28em] text-army poligon:text-radar">
              MODUŁ 7 / KALKULATOR DOS-FCU
            </p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-charcoal poligon:text-poligon-50 md:text-6xl">
              Kalkulator logistyczny
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-field-800 poligon:text-stone-300">
              Szybkie przeliczenia zapasu dobowego, jednostek kalkulacyjnych i współczynników według logiki Kompendium.
            </p>
          </div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] bg-olive p-5 text-white shadow-olive poligon:bg-radar poligon:text-night"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em]">{hero.title}</p>
                <p className="mt-2 font-display text-7xl font-bold leading-none">{hero.value}</p>
                <p className="font-display text-2xl font-bold uppercase">{hero.unit}</p>
              </div>
              <HeroIcon className="h-10 w-10" />
            </div>
            <p className="mt-4 text-sm font-semibold opacity-85">{hero.detail}</p>
          </motion.div>
        </div>
      </motion.header>

      <section className="rounded-[1.75rem] border border-white/75 bg-white/75 p-4 shadow-soft backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/82">
        <div className="grid gap-2 sm:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-black uppercase tracking-[0.14em] transition hover:scale-[1.02] ${
                  isActive
                    ? 'border-olive bg-olive text-white poligon:border-radar poligon:bg-radar poligon:text-night'
                    : 'border-olive/15 bg-parchment text-olive poligon:border-white/10 poligon:bg-white/5 poligon:text-radar'
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </section>

      <motion.section
        key={activeTab}
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="grid gap-5 lg:grid-cols-[1fr_22rem]"
      >
        <div className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90">
          <div className="flex items-center gap-3">
            <Gauge className="h-6 w-6 text-army poligon:text-radar" />
            <h2 className="font-display text-3xl font-bold uppercase text-charcoal poligon:text-poligon-50">
              Parametry wejściowe
            </h2>
          </div>
          <div className="mt-5 grid gap-4">
            {activeTab === 'fuel' ? (
              <>
                <SliderField label="Pojazdy" value={vehicles} min={1} max={40} onChange={setVehicles} />
                <SliderField label="Norma dobowa" value={fuelNorm} min={20} max={80} unit="l" onChange={setFuelNorm} />
                <SliderField label="Horyzont" value={hours} min={6} max={72} unit="h" onChange={setHours} />
                <SliderField label="Zapas MPS" value={fuelStock} min={5000} max={40000} step={100} unit="l" onChange={setFuelStock} />
              </>
            ) : activeTab === 'food' ? (
              <>
                <SliderField label="Stan osobowy" value={personnel} min={20} max={120} onChange={setPersonnel} />
                <SliderField label="Dni zabezpieczenia" value={days} min={1} max={10} onChange={setDays} />
                <SliderField label="Zapas żywności" value={foodStock} min={100} max={2000} step={10} unit="kg" onChange={setFoodStock} />
              </>
            ) : (
              <>
                <SliderField label="Pododdziały" value={ammoUnits} min={1} max={30} onChange={setAmmoUnits} />
                <SliderField label="Norma j.k." value={ammoNorm} min={0.1} max={1.5} step={0.05} onChange={setAmmoNorm} />
                <SliderField label="Zapas amunicji" value={ammoStock} min={1} max={50} step={0.5} unit="j.k." onChange={setAmmoStock} />
              </>
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-white/75 bg-white/82 p-5 shadow-command backdrop-blur-xl poligon:border-poligon-border poligon:bg-poligon-surface/90">
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-army poligon:text-radar">
            Współczynniki
          </p>
          <div className="mt-4">
            <CoefficientPills
              items={
                activeTab === 'fuel'
                  ? fuelCoefficients
                  : activeTab === 'food'
                    ? foodCoefficients
                    : ammoCoefficients
              }
            />
          </div>
          <div className="mt-5 rounded-3xl border border-olive/10 bg-parchment/75 p-4 poligon:border-white/8 poligon:bg-white/5">
            <PackageCheck className="h-6 w-6 text-army poligon:text-radar" />
            <p className="mt-3 text-sm font-semibold leading-6 text-field-800 poligon:text-stone-300">
              Wynik przelicza się na żywo po zmianie suwaków. Wartość DOS pokazuje, ile dób lub jednostek kalkulacyjnych
              zabezpiecza aktualny zapas.
            </p>
          </div>
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-olive px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-olive transition hover:scale-[1.01] poligon:bg-radar poligon:text-night">
            <Plus className="h-5 w-5" />
            Zapisz wariant
          </button>
        </aside>
      </motion.section>
    </div>
  )
}
