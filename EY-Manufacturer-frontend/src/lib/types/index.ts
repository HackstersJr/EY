// Manufacturing Portal Types

export type Trend = 'INCREASING' | 'DECREASING' | 'STABLE';
export type TimeRange = '30days' | '90days' | '180days';
export type Region = 'All' | 'North' | 'South' | 'East' | 'West' | 'Central';
export type CAPAStatus = 'PROPOSED' | 'ACCEPTED' | 'IN_PROGRESS' | 'IMPLEMENTED';
export type CAPAType = 'WORKSHOP' | 'MANUFACTURING';

// Manufacturing Overview
export interface ManufacturingOverview {
    period: string;
    modelsWithRisingDefects: {
        modelId: string;
        modelName: string;
        trend: Trend;
        increasePercentage: number;
        topDefect: string;
    }[];
    topDefectCategories: {
        category: string;
        incidents: number;
        affectedModels: number;
    }[];
    capaStatus: {
        proposed: number;
        accepted: number;
        inProgress: number;
        implemented: number;
    };
    totalDefects: number;
    resolvedThisMonth: number;
    avgResolutionTime: number; // in days
}

export interface ManufacturingOverviewParams {
    timeRange?: TimeRange;
    region?: Region;
}

// Model Summary
export interface ManufacturingModelSummary {
    modelId: string;
    modelName: string;
    totalDefects: number;
    openCAPA: number;
    closedCAPA: number;
    trend: Trend;
    trendPercentage: number;
    topDefectCategory: string;
    affectedRegions: string[];
}

export interface ManufacturingModelsParams {
    timeRange?: TimeRange;
    region?: Region;
}

// Model Defects Detail
export interface CAPAItem {
    id: string;
    type: CAPAType;
    action: string;
    status: CAPAStatus;
    estimatedImpact?: string;
    assignedTo?: string;
    dueDate?: string;
    aiConfidence?: number;
}

export interface DefectType {
    defectId: string;
    defect: string;
    incidents: number;
    regions: string[];
    mileageRange?: string;
    trend: Trend;
    trendPercentage: number;
    rca: string;
    rcaConfidence: number;
    capaItems: CAPAItem[];
    rootCauseDetails?: string;
    impactedComponents?: string[];
}

export interface ManufacturingModelDefects {
    modelId: string;
    modelName: string;
    totalDefects: number;
    regionsImpacted: string[];
    topDefectCategory: string;
    defectTypes: DefectType[];
}

// Location Summary
export interface ManufacturingLocationSummary {
    locId: string;
    name: string;
    region: string;
    dominantModels: string[];
    defectCount: number;
    topDefectCategory: string;
    openCAPACount: number;
    trend: Trend;
}

export interface ManufacturingLocationsParams {
    region?: Region;
}

// Location Defects Detail
export interface LocationModelDefect {
    modelId: string;
    modelName: string;
    incidents: number;
    keyDefects: string[];
    trend: Trend;
}

export interface LocationCAPAStatus {
    capaId: string;
    defect: string;
    action: string;
    status: CAPAStatus;
    model: string;
}

export interface ManufacturingLocationDefects {
    locId: string;
    name: string;
    region: string;
    modelsPresent: string[];
    totalDefects: number;
    defectsByModel: LocationModelDefect[];
    capaStatus: LocationCAPAStatus[];
}

// Chat Types
export interface ManufacturingChatRequest {
    message: string;
    conversationHistory?: ChatMessage[];
    context?: {
        timeRange?: TimeRange;
        region?: Region;
        modelId?: string;
        locId?: string;
    };
}

export interface ManufacturingChatResponse {
    message: string;
    timestamp: string;
    suggestedActions?: string[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
    timestamp: string;
}
