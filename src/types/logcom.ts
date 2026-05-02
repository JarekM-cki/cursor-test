import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "structure"
  | "equipment"
  | "map"
  | "more";

export type AlertLevel = "low" | "medium" | "high";
export type ReadinessStatus = "ready" | "limited" | "down";

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
}

export interface AlertItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  severity: AlertLevel;
}

export interface LogcomState {
  activeModule: ModuleId;
  poligonMode: boolean;
  commander: CommanderProfile;
  navigation: NavigationItem[];
  quickMetrics: QuickMetric[];
  readiness: ReadinessSlice[];
  fuel: FuelState;
  alerts: AlertItem[];
}
