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
  { time: '06:00', level: 88, forecast: 4.7 },
  { time: '09:00', level: 86, forecast: 4.5 },
  { time: '12:00', level: 84, forecast: 4.2 },
  { time: '15:00', level: 82, forecast: 4.0 },
  { time: '18:00', level: 81, forecast: 3.9 },
  { time: '21:00', level: 79, forecast: 3.8 },
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
    { id: 'personnel', label: 'Personel', value: '68/72', trend: '94,4% obsady', tone: 'success' },
    { id: 'vehicles', label: 'Pojazdy', value: '26', trend: '24 gotowe do marszu', tone: 'success' },
    { id: 'equipment', label: 'Sprzet', value: '47', trend: '3 pozycje w obsludze', tone: 'neutral' },
    { id: 'convoys', label: 'Konwoje', value: '5', trend: '2 w oknie 6 h', tone: 'warning' },
  ],
  readiness: [
    { name: 'Gotowe', value: 94, color: '#7C9A3F', status: 'ready' },
    { name: 'Ograniczone', value: 4, color: '#D4A017', status: 'limited' },
    { name: 'Niegotowe', value: 2, color: '#A63D2A', status: 'down' },
  ],
  fuel: {
    currentLiters: 25200,
    capacityLiters: 30000,
    dailyBurnLiters: 6000,
    forecastHours: 101,
    criticalThresholdPercent: 35,
    dos: 4.2,
    trend: fuelTrend,
  },
  capabilities: [
    { id: 'payload', label: 'Ladownosc', value: '86', unit: 't', detail: 'gotowe do przerzutu w 1 rzucie' },
    { id: 'meals', label: 'Posilki', value: '720', unit: 'porcji', detail: 'dobowa wydajnosc sekcji zywienia' },
    { id: 'column', label: 'Kolumna marszowa', value: '31', unit: 'pojazdow', detail: 'maksymalny sklad kolumny KLog' },
  ],
  alerts: [
    {
      id: 'fuel-threshold',
      title: 'Dos uzupelniony do 4.2',
      detail: 'Sekcja MPS potwierdza zapas paliwa powyzej normy dla 101 h dzialania.',
      time: '08:40',
      severity: 'low',
    },
    {
      id: 'vehicle-service',
      title: 'Dwa pojazdy w obsludze biezacej',
      detail: 'Jelcz i Star oczekuja na zamkniecie kart pracy przed wyjazdem kolumny.',
      time: '07:15',
      severity: 'medium',
    },
    {
      id: 'report-ready',
      title: 'Konwoj zaopatrzenia T-03',
      detail: 'Gotowosc kolumny marszowej: 5 konwojow, pierwszy slot 10:30.',
      time: '06:55',
      severity: 'high',
    },
  ],
}
