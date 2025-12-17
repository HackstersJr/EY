import type {
    ManufacturingOverview,
    ManufacturingOverviewParams,
    ManufacturingModelSummary,
    ManufacturingModelsParams,
    ManufacturingModelDefects,
    ManufacturingLocationSummary,
    ManufacturingLocationsParams,
    ManufacturingLocationDefects,
    ManufacturingChatRequest,
    ManufacturingChatResponse,
    Trend,
    CAPAStatus,
    CAPAType,
} from './types';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ============================================================================
// MOCK DATA CONSTANTS
// ============================================================================

const VEHICLE_MODELS = [
    { modelId: 'porsche-911', modelName: 'Porsche 911' },
    { modelId: 'porsche-cayenne', modelName: 'Porsche Cayenne' },
    { modelId: 'porsche-taycan', modelName: 'Porsche Taycan' },
    { modelId: 'porsche-macan', modelName: 'Porsche Macan' },
    { modelId: 'porsche-panamera', modelName: 'Porsche Panamera' },
    { modelId: 'porsche-boxster', modelName: 'Porsche Boxster' },
];

const REGIONS = ['North', 'South', 'East', 'West', 'Central'];

const DEFECT_CATEGORIES = [
    { category: 'Brake System', subcategories: ['Brake Pad Wear', 'Brake Fluid Leak', 'ABS Sensor Failure', 'Rotor Warping'] },
    { category: 'Electrical', subcategories: ['Battery Drain', 'Wiring Harness', 'Sensor Malfunction', 'Fuse Issues'] },
    { category: 'Transmission', subcategories: ['Gear Slipping', 'Clutch Wear', 'Transmission Fluid Leak', 'Solenoid Failure'] },
    { category: 'Engine', subcategories: ['Oil Leak', 'Overheating', 'Timing Belt', 'Fuel Injection'] },
    { category: 'Suspension', subcategories: ['Shock Absorber', 'Spring Failure', 'Control Arm', 'Bushing Wear'] },
    { category: 'HVAC', subcategories: ['AC Compressor', 'Heater Core', 'Blower Motor', 'Thermostat'] },
];

const MANUFACTURING_PLANTS = [
    { locId: 'plant-detroit', name: 'Detroit Assembly Plant', region: 'North' },
    { locId: 'plant-austin', name: 'Austin Manufacturing Hub', region: 'South' },
    { locId: 'plant-california', name: 'California Innovation Center', region: 'West' },
    { locId: 'plant-ohio', name: 'Ohio Production Facility', region: 'Central' },
    { locId: 'plant-georgia', name: 'Georgia Assembly Center', region: 'East' },
    { locId: 'plant-arizona', name: 'Arizona Tech Plant', region: 'West' },
];

const RCA_TEMPLATES = [
    'Root cause analysis indicates {component} degradation due to {factor}. Manufacturing process variation in {process} step contributed to accelerated wear patterns.',
    'Investigation reveals {factor} causing premature {component} failure. Quality control metrics suggest batch-specific issues during {process} phase.',
    'Failure mode analysis shows {component} stress exceeding design parameters under {condition} conditions. Supplier material variance identified as contributing factor.',
    'Data-driven analysis confirms {factor} as primary failure driver. Correlation found between {condition} environment exposure and {component} degradation rate.',
];

const CAPA_ACTIONS = [
    { type: 'WORKSHOP' as CAPAType, action: 'Implement enhanced inspection protocol during routine maintenance' },
    { type: 'WORKSHOP' as CAPAType, action: 'Deploy software update to improve component monitoring' },
    { type: 'WORKSHOP' as CAPAType, action: 'Train technicians on early warning signs and preventive measures' },
    { type: 'MANUFACTURING' as CAPAType, action: 'Update manufacturing tolerances for affected components' },
    { type: 'MANUFACTURING' as CAPAType, action: 'Implement additional quality gate in assembly line' },
    { type: 'MANUFACTURING' as CAPAType, action: 'Source alternative supplier with improved material specs' },
    { type: 'MANUFACTURING' as CAPAType, action: 'Redesign component with improved thermal resistance' },
    { type: 'MANUFACTURING' as CAPAType, action: 'Add automated vision inspection at critical assembly point' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const randomItem = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];
const randomItems = <T>(arr: T[], count: number): T[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, arr.length));
};

const generateTrend = (): Trend => {
    const trends: Trend[] = ['INCREASING', 'DECREASING', 'STABLE'];
    return randomItem(trends);
};

const generateCAPAStatus = (): CAPAStatus => {
    const statuses: CAPAStatus[] = ['PROPOSED', 'ACCEPTED', 'IN_PROGRESS', 'IMPLEMENTED'];
    return randomItem(statuses);
};

const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get Manufacturing Overview Dashboard Data
 */
export const getManufacturingOverview = async (
    _params?: ManufacturingOverviewParams
): Promise<ManufacturingOverview> => {
    await simulateDelay(350);

    const modelsWithRisingDefects = VEHICLE_MODELS.slice(0, 4).map(model => ({
        modelId: model.modelId,
        modelName: model.modelName,
        trend: generateTrend(),
        increasePercentage: randomFloat(5, 35),
        topDefect: randomItem(DEFECT_CATEGORIES).category,
    })).filter(m => m.trend === 'INCREASING' || Math.random() > 0.5);

    const topDefectCategories = DEFECT_CATEGORIES.slice(0, 5).map(cat => ({
        category: cat.category,
        incidents: randomInt(120, 450),
        affectedModels: randomInt(2, 5),
    })).sort((a, b) => b.incidents - a.incidents);

    return {
        period: '30 days',
        modelsWithRisingDefects,
        topDefectCategories,
        capaStatus: {
            proposed: randomInt(15, 35),
            accepted: randomInt(20, 40),
            inProgress: randomInt(25, 50),
            implemented: randomInt(80, 150),
        },
        totalDefects: randomInt(800, 1500),
        resolvedThisMonth: randomInt(200, 400),
        avgResolutionTime: randomFloat(4, 12),
    };
};

/**
 * Get Manufacturing Models List
 */
export const getManufacturingModels = async (
    _params?: ManufacturingModelsParams
): Promise<ManufacturingModelSummary[]> => {
    await simulateDelay(280);

    return VEHICLE_MODELS.map(model => {
        const trend = generateTrend();
        const trendPercentage = trend === 'STABLE' ? 0 : randomFloat(3, 25);

        return {
            modelId: model.modelId,
            modelName: model.modelName,
            totalDefects: randomInt(80, 350),
            openCAPA: randomInt(5, 25),
            closedCAPA: randomInt(15, 60),
            trend,
            trendPercentage,
            topDefectCategory: randomItem(DEFECT_CATEGORIES).category,
            affectedRegions: randomItems(REGIONS, randomInt(2, 4)),
        };
    });
};

/**
 * Get Model Defects Detail with RCA/CAPA
 */
export const getManufacturingModelDefects = async (
    modelId: string
): Promise<ManufacturingModelDefects> => {
    await simulateDelay(400);

    const model = VEHICLE_MODELS.find(m => m.modelId === modelId) || VEHICLE_MODELS[0];
    const selectedCategories = randomItems(DEFECT_CATEGORIES, randomInt(4, 6));

    const defectTypes = selectedCategories.map((cat, idx) => {
        const trend = generateTrend();
        const trendPercentage = trend === 'STABLE' ? 0 : randomFloat(5, 30);
        const defectName = randomItem(cat.subcategories);

        // Generate realistic RCA
        const rcaTemplate = randomItem(RCA_TEMPLATES);
        const rca = rcaTemplate
            .replace('{component}', defectName.toLowerCase())
            .replace('{factor}', randomItem(['thermal stress', 'material fatigue', 'contamination', 'vibration exposure']))
            .replace('{process}', randomItem(['assembly', 'welding', 'coating', 'testing']))
            .replace('{condition}', randomItem(['high temperature', 'humid', 'corrosive', 'high-load']));

        // Generate CAPA items
        const capaCount = randomInt(2, 5);
        const capaItems = CAPA_ACTIONS.slice(0, capaCount).map((capa, capaIdx) => ({
            id: `CAPA-${model.modelId.toUpperCase().slice(0, 3)}-${(idx + 1).toString().padStart(2, '0')}${capaIdx + 1}`,
            type: capa.type,
            action: capa.action,
            status: generateCAPAStatus(),
            estimatedImpact: `${randomInt(15, 40)}% reduction in incidents`,
            assignedTo: randomItem(['Engineering Team A', 'Quality Control', 'Production Lead', 'Supplier Relations']),
            dueDate: new Date(Date.now() + randomInt(7, 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            aiConfidence: capa.type === 'MANUFACTURING' ? randomFloat(0.75, 0.95) : undefined,
        }));

        return {
            defectId: `DEF-${idx + 1}`,
            defect: defectName,
            incidents: randomInt(25, 150),
            regions: randomItems(REGIONS, randomInt(1, 4)),
            mileageRange: `${randomInt(10, 30)}k - ${randomInt(50, 100)}k miles`,
            trend,
            trendPercentage,
            rca,
            rcaConfidence: randomFloat(0.72, 0.96),
            capaItems,
            rootCauseDetails: `Contributing factors include ${randomItem(['supplier variation', 'environmental conditions', 'design limitations', 'process drift'])} and ${randomItem(['insufficient testing coverage', 'material specification gaps', 'assembly sequence sensitivity', 'component interaction effects'])}.`,
            impactedComponents: randomItems(['Sensor Module', 'Control Unit', 'Actuator', 'Mounting Bracket', 'Wiring Harness', 'Fluid Lines'], randomInt(2, 4)),
        };
    });

    return {
        modelId: model.modelId,
        modelName: model.modelName,
        totalDefects: defectTypes.reduce((sum, d) => sum + d.incidents, 0),
        regionsImpacted: [...new Set(defectTypes.flatMap(d => d.regions))],
        topDefectCategory: defectTypes.sort((a, b) => b.incidents - a.incidents)[0]?.defect || 'Unknown',
        defectTypes,
    };
};

/**
 * Get Manufacturing Locations List
 */
export const getManufacturingLocations = async (
    _params?: ManufacturingLocationsParams
): Promise<ManufacturingLocationSummary[]> => {
    await simulateDelay(300);

    return MANUFACTURING_PLANTS.map(plant => ({
        locId: plant.locId,
        name: plant.name,
        region: plant.region,
        dominantModels: randomItems(VEHICLE_MODELS, randomInt(2, 4)).map(m => m.modelName),
        defectCount: randomInt(50, 200),
        topDefectCategory: randomItem(DEFECT_CATEGORIES).category,
        openCAPACount: randomInt(3, 15),
        trend: generateTrend(),
    }));
};

/**
 * Get Location Defects Detail
 */
export const getManufacturingLocationDefects = async (
    locId: string
): Promise<ManufacturingLocationDefects> => {
    await simulateDelay(350);

    const plant = MANUFACTURING_PLANTS.find(p => p.locId === locId) || MANUFACTURING_PLANTS[0];
    const modelsAtLocation = randomItems(VEHICLE_MODELS, randomInt(3, 5));

    const defectsByModel = modelsAtLocation.map(model => ({
        modelId: model.modelId,
        modelName: model.modelName,
        incidents: randomInt(15, 80),
        keyDefects: randomItems(
            DEFECT_CATEGORIES.flatMap(c => c.subcategories),
            randomInt(2, 4)
        ),
        trend: generateTrend(),
    }));

    const capaStatus = Array.from({ length: randomInt(4, 8) }, (_, idx) => ({
        capaId: `CAPA-${plant.locId.slice(-3).toUpperCase()}-${(idx + 1).toString().padStart(3, '0')}`,
        defect: randomItem(DEFECT_CATEGORIES.flatMap(c => c.subcategories)),
        action: randomItem(CAPA_ACTIONS).action,
        status: generateCAPAStatus(),
        model: randomItem(modelsAtLocation).modelName,
    }));

    return {
        locId: plant.locId,
        name: plant.name,
        region: plant.region,
        modelsPresent: modelsAtLocation.map(m => m.modelName),
        totalDefects: defectsByModel.reduce((sum, d) => sum + d.incidents, 0),
        defectsByModel,
        capaStatus,
    };
};

/**
 * Send Manufacturing Chat Message
 */
export const sendManufacturingChatMessage = async (
    request: ManufacturingChatRequest
): Promise<ManufacturingChatResponse> => {
    try {
        const response = await axios.post(`${BASE_URL}/agent/chat`, {
            query: request.message,
            context: {
                ...request.context,
                agent_type: 'manufacturing_insight' // Hint for Master Agent
            }
        });

        // The backend returns { master_decision: ..., agent_result: ... }
        // We need to extract the message from agent_result
        const agentResult = response.data.agent_result;

        // Handle different response structures from different agents if needed
        // For manufacturing agent, it returns { top_defects, root_cause_hypothesis, recommendations }
        // We need to format this into a string message for the chat UI

        let message = "Here is the analysis:\n\n";
        if (agentResult.root_cause_hypothesis) {
            message += `**Root Cause Hypothesis:** ${agentResult.root_cause_hypothesis}\n\n`;
        }
        if (agentResult.top_defects && agentResult.top_defects.length > 0) {
            message += `**Top Defects:**\n${agentResult.top_defects.map((d: string) => `• ${d}`).join('\n')}\n\n`;
        }
        if (agentResult.recommendations && agentResult.recommendations.length > 0) {
            message += `**Recommendations:**\n${agentResult.recommendations.map((r: string) => `• ${r}`).join('\n')}`;
        }

        if (!agentResult.root_cause_hypothesis && !agentResult.top_defects) {
            message = JSON.stringify(agentResult, null, 2);
        }

        return {
            message: message,
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Chat API Error:", error);
        return {
            message: "Sorry, I'm having trouble connecting to the manufacturing insights engine.",
            timestamp: new Date().toISOString(),
        };
    }
};
