import type { LogcomState, ModuleId, NavigationItem } from '../types/logcom'
import {
  BarChart3,
  Ellipsis,
  Map,
  Shield,
  Truck,
} from 'lucide-react'

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Pulpit', shortLabel: 'Pulpit', description: 'Najwazniejsze liczby w 3 sekundy', icon: BarChart3 },
  { id: 'structure', label: 'Struktura', shortLabel: 'Org', description: 'Etat, plutony i stan osobowy', icon: Shield },
  { id: 'equipment', label: 'Sprzet', shortLabel: 'Sprzet', description: 'Sprawnosc i ewidencja wyposazenia', icon: Truck },
  { id: 'map', label: 'Mapa', shortLabel: 'Mapa', description: 'Sytuacja taktyczna APP-6', icon: Map },
  { id: 'more', label: 'Wiecej', shortLabel: 'Wiecej', description: 'Transport, meldunki i kalkulator', icon: Ellipsis },
]

export const viewTitles: Record<ModuleId, string> = {
  dashboard: 'Pulpit dowodcy',
  structure: 'Struktura organizacyjna',
  equipment: 'Ewidencja sprzetu',
  map: 'Mapa taktyczna APP-6',
  more: 'Wiecej modulow LOGCOM',
}

export const fuelTrend = [
  { day: 'Pon', diesel: 74, petrol: 62 },
  { day: 'Wt', diesel: 71, petrol: 61 },
  { day: 'Sr', diesel: 69, petrol: 59 },
  { day: 'Czw', diesel: 66, petrol: 56 },
  { day: 'Pt', diesel: 64, petrol: 53 },
  { day: 'Sob', diesel: 61, petrol: 50 },
]

export const logcomSeed: LogcomState = {
  activeModule: 'dashboard',
  poligonMode: false,
  commander: {
    rank: 'kpt.',
    firstName: 'Jaroslaw',
    lastName: 'MALICKI',
    role: 'Dowodca kompanii logistycznej',
    unit: 'KLog blog brygady',
    brigadeCode: '17 BZ',
    brigadeName: '17 Brygada Zmechanizowana',
    location: '17 Brygada Zmechanizowana · Miedzyrzecz',
    status: 'Dyżur operacyjny',
  },
  navigation: navigationItems,
  quickMetrics: [
    { id: 'readiness', label: 'Gotowosc operacyjna', value: '76', unit: '%', trend: '+4 pp / 24 h', tone: 'success' },
    { id: 'personnel', label: 'Stan osobowy', value: '143/156', trend: '91,7% obsady', tone: 'neutral' },
    { id: 'fuel', label: 'Zapas ON', value: '61', unit: '%', trend: '48 h autonomii', tone: 'warning' },
    { id: 'equipment', label: 'Sprzet sprawny', value: '84', unit: '%', trend: '12 pozycji w obsludze', tone: 'success' },
  ],
  readiness: [
    { name: 'Gotowe', value: 76, color: '#7C9A3F', status: 'ready' },
    { name: 'Ograniczone', value: 16, color: '#D4A017', status: 'limited' },
    { name: 'Niegotowe', value: 8, color: '#A63D2A', status: 'down' },
  ],
  fuel: {
    currentLiters: 18400,
    capacityLiters: 30000,
    dailyBurnLiters: 9200,
    forecastHours: 48,
    criticalThresholdPercent: 35,
  },
  alerts: [
    {
      id: 'fuel-threshold',
      title: 'Prog paliwowy plutonu transportowego',
      detail: 'Sekcja cystern melduje spadek ON do 61%. Wymagana decyzja o priorytecie tankowania.',
      time: '08:40',
      severity: 'medium',
    },
    {
      id: 'vehicle-service',
      title: 'Jelcz P662D.43 wymaga obslugi',
      detail: 'Przekroczono 92% resursu miedzyobslugowego. Zaplanowac okno techniczne.',
      time: '07:15',
      severity: 'high',
    },
    {
      id: 'report-ready',
      title: 'Meldunek LOGSTAT gotowy',
      detail: 'Dane zsynchronizowane z ewidencja sprzetu i stanem paliwa.',
      time: '06:55',
      severity: 'low',
    },
  ],
}
