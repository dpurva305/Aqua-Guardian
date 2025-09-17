
export enum Page {
  Home,
  Map,
  Alerts,
  Education,
  Health,
  Community,
}

export enum WaterSourceStatus {
  Safe = 'Safe',
  Warning = 'Warning',
  Unsafe = 'Unsafe',
}

export interface WaterSource {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: WaterSourceStatus;
  lastChecked: string;
}

export interface Alert {
  id: number;
  sourceName: string;
  message: string;
  timestamp: string;
  status: WaterSourceStatus;
}

export enum HealthCenterType {
  Hospital = 'Hospital',
  Clinic = 'Clinic',
  Doctor = 'Doctor',
  Pharmacy = 'Pharmacy',
}

export interface HealthCenter {
  id: number;
  name: string;
  type: HealthCenterType;
  lat: number;
  lng: number;
  contact: string;
  hours: string;
}

export interface Symptom {
  id: string;
  name: string;
}

export interface SymptomReport {
  symptom: string;
  count: number;
  date: string;
}

export interface SymptomCheckResult {
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Unknown';
  possibleConditions: string[];
  recommendations: string[];
}
