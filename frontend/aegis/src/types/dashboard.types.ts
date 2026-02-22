// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────

export interface DashboardStats {
  totalPatients: number
  highRiskCases: number
  logsToday: number
  activeCaretakers: number
}

export interface RiskDistribution {
  high: number
  elevated: number
  stable: number
  total: number
}

export interface RecentActivityItem {
  logId: string
  patientId: string
  fullName: string
  riskLevel: 'HIGH' | 'ELEVATED' | 'STABLE'   // backend sends uppercase
  systolic: number
  diastolic: number
  heartRate: number
  symptoms: string[]
  loggedAt: string   // ISO timestamp
}

export interface DashboardData {
  stats: DashboardStats
  riskDistribution: RiskDistribution
  recentActivity: RecentActivityItem[]
  openEmergencies: number
}

export interface DashboardResponse {
  success: boolean
  data: DashboardData
}
