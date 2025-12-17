// OEM Types

export type Trend = 'INCREASING' | 'DECREASING' | 'STABLE';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';
export type Region = 'All' | 'North' | 'South' | 'East' | 'West';
export type TimeRange = '7days' | '30days' | '90days';
export type Utilization = 'Low' | 'Medium' | 'High';

export interface OEMModelSummary {
  modelId: string;
  modelName: string;
  vehicles: number;
  activeIssues: number;
  failureRate: number; // 0–1
  trend: Trend;
}

export interface OEMRegionalSummary {
  region: string;
  vehicles: number;
  activeIssues: number;
  upcomingAppointments: number;
}

export interface OEMOverview {
  totalVehicles: number;
  vehiclesWithActiveIssues: number;
  highSeverityCases: number;
  forecastedServiceDemand7Days: number;
  modelSummary: OEMModelSummary[];
  regionalSummary: OEMRegionalSummary[];
}

export interface OEMOverviewParams {
  timeRange?: TimeRange;
  region?: Region;
}

export interface ComponentBreakdown {
  component: string;
  incidents: number;
  failurePercentage: number;
  severityDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
}

export interface RegionalBreakdown {
  region: string;
  vehicles: number;
  issues: number;
  highSeverity: number;
}

export interface OEMModelPerformance {
  modelId: string;
  modelName: string;
  totalVehicles: number;
  activeIssues: number;
  failureRate: number;
  highSeverityCount: number;
  componentBreakdown: ComponentBreakdown[];
  regionalBreakdown: RegionalBreakdown[];
}

export interface OEMServiceCenter {
  id: string;
  name: string;
  region: string;
  vehiclesCovered: number;
  activeIssues: number;
  upcomingAppointments: number;
  utilization: Utilization;
}

export interface OEMServiceCenterDetail {
  id: string;
  name: string;
  location: string;
  region: string;
  currentLoad: number;
  upcomingLoad: number;
  commonIssues: string[];
  modelsServiced: {
    modelName: string;
    count: number;
  }[];
}

export interface OEMChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  context?: {
    timeRange?: TimeRange;
    region?: Region;
    modelId?: string;
  };
}

export interface OEMChatResponse {
  message: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Models List Types
export interface OEMModelsParams {
  timeRange?: TimeRange;
  region?: Region;
}

// Service Centers List Types
export interface OEMServiceCentersParams {
  region?: Region;
}
