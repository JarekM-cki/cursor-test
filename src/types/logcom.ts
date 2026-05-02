import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "structure"
  | "equipment"
  | "map"
  | "more";

export type AlertLevel = "low" | "medium" | "high";
export type ReadinessStatus = "ready" | "limited" | "down";
export type SoldierStatus = "present" | "leave" | "sl" | "vacancy";
export type StructureNodeKind = "command" | "staff" | "platoon" | "squad";
export type EquipmentStatus = "ready" | "service" | "limited" | "down";
export type EquipmentCategory = "truck" | "tanker" | "command" | "kitchen" | "recovery" | "trailer";

export interface CommanderProfile {
  rank: string;
  firstName: string;
  lastName: string;
  role: string;
  unit: string;
  brigadeCode: string;
  brigadeName: string;
  location: string;
  status: string;
}

export interface NavigationItem {
  id: ModuleId;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}

export interface QuickMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend: string;
  tone: "success" | "warning" | "danger" | "neutral";
}

export interface CapabilityMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
  detail: string;
}

export interface ReadinessSlice {
  name: string;
  value: number;
  color: string;
  status: ReadinessStatus;
}

export interface FuelState {
  currentLiters: number;
  capacityLiters: number;
  dailyBurnLiters: number;
  forecastHours: number;
  criticalThresholdPercent: number;
  dos: number;
  trend: Array<{
    time: string;
    level: number;
    forecast: number;
  }>;
}

export interface AlertItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: AlertLevel;
}

export interface Soldier {
  id: string;
  status: SoldierStatus;
  rank: string;
  firstName: string;
  lastName: string;
  role: string;
  functionIcon: string;
  vehicle: string;
}

export interface StructureNode {
  id: string;
  name: string;
  category: StructureNodeKind;
  callsign: string;
  description: string;
  soldiers: Soldier[];
  children?: StructureNode[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  model: string;
  category: EquipmentCategory;
  silhouette: string;
  status: EquipmentStatus;
  registration: string;
  location: string;
  assignedNodeId: string;
  crewSoldierIds: string[];
  readinessPercent: number;
  mileageKm: number;
  motohours: number;
  fuelLevelPercent: number;
  lastInspection: string;
  nextService: string;
  serviceWindow: string;
  serviceStatus: string;
  notes: string;
}

export interface LogcomState {
  activeModule: ModuleId;
  poligonMode: boolean;
  commander: CommanderProfile;
  navigation: NavigationItem[];
  quickMetrics: QuickMetric[];
  capabilities: CapabilityMetric[];
  readiness: ReadinessSlice[];
  fuel: FuelState;
  alerts: AlertItem[];
  structure: StructureNode[];
  equipment: EquipmentItem[];
}
