import type {
  OEMOverview,
  OEMOverviewParams,
  OEMModelSummary,
  OEMModelsParams,
  OEMModelPerformance,
  OEMServiceCenter,
  OEMServiceCentersParams,
  OEMServiceCenterDetail,
  OEMChatRequest,
  OEMChatResponse,
} from './types';

// Mock data generators

const MOCK_MODELS = [
  { modelId: 'porsche-911', modelName: 'Porsche 911' },
  { modelId: 'porsche-cayenne', modelName: 'Porsche Cayenne' },
  { modelId: 'porsche-taycan', modelName: 'Porsche Taycan' },
  { modelId: 'porsche-macan', modelName: 'Porsche Macan' },
  { modelId: 'porsche-panamera', modelName: 'Porsche Panamera' },
];

const MOCK_REGIONS = ['North', 'South', 'East', 'West'];

const MOCK_COMPONENTS = [
  'Battery Management System',
  'Brake System',
  'Suspension',
  'Electric Motor',
  'Cooling System',
  'Autopilot Sensors',
  'Charging Port',
  'HVAC System',
];

// Helper to generate random numbers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Get OEM Overview Dashboard Data
 */
export const getOEMOverview = async (_params?: OEMOverviewParams): Promise<OEMOverview> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const totalVehicles = randomInt(45000, 55000);
  const vehiclesWithActiveIssues = randomInt(3000, 5000);
  const highSeverityCases = randomInt(150, 300);
  const forecastedServiceDemand7Days = randomInt(800, 1200);

  // Generate model summary
  const modelSummary: OEMModelSummary[] = MOCK_MODELS.map((model) => {
    const vehicles = randomInt(8000, 12000);
    const activeIssues = randomInt(400, 800);
    const failureRate = randomFloat(0.03, 0.09);
    const trends = ['INCREASING', 'DECREASING', 'STABLE'] as const;
    const trend = trends[randomInt(0, 2)];

    return {
      modelId: model.modelId,
      modelName: model.modelName,
      vehicles,
      activeIssues,
      failureRate,
      trend,
    };
  });

  // Generate regional summary
  const regionalSummary = MOCK_REGIONS.map((region) => ({
    region,
    vehicles: randomInt(10000, 15000),
    activeIssues: randomInt(700, 1200),
    upcomingAppointments: randomInt(200, 400),
  }));

  return {
    totalVehicles,
    vehiclesWithActiveIssues,
    highSeverityCases,
    forecastedServiceDemand7Days,
    modelSummary,
    regionalSummary,
  };
};

/**
 * Get Models List
 */
export const getOEMModels = async (_params?: OEMModelsParams): Promise<OEMModelSummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return MOCK_MODELS.map((model) => {
    const vehicles = randomInt(8000, 12000);
    const activeIssues = randomInt(400, 800);
    const failureRate = randomFloat(0.03, 0.09);
    const trends = ['INCREASING', 'DECREASING', 'STABLE'] as const;
    const trend = trends[randomInt(0, 2)];

    return {
      modelId: model.modelId,
      modelName: model.modelName,
      vehicles,
      activeIssues,
      failureRate,
      trend,
    };
  });
};

/**
 * Get Model Performance Detail
 */
export const getOEMModelPerformance = async (modelId: string): Promise<OEMModelPerformance> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const model = MOCK_MODELS.find((m) => m.modelId === modelId) || MOCK_MODELS[0];
  const totalVehicles = randomInt(8000, 12000);
  const activeIssues = randomInt(400, 800);
  const failureRate = randomFloat(0.03, 0.09);
  const highSeverityCount = randomInt(30, 80);

  // Component breakdown
  const componentBreakdown = MOCK_COMPONENTS.slice(0, 5).map((component) => {
    const incidents = randomInt(50, 200);
    const failurePercentage = randomFloat(5, 25);
    const total = 100;
    const high = randomInt(10, 30);
    const medium = randomInt(30, 50);
    const low = total - high - medium;

    return {
      component,
      incidents,
      failurePercentage,
      severityDistribution: {
        LOW: low,
        MEDIUM: medium,
        HIGH: high,
      },
    };
  });

  // Regional breakdown
  const regionalBreakdown = MOCK_REGIONS.map((region) => ({
    region,
    vehicles: randomInt(1500, 3000),
    issues: randomInt(80, 200),
    highSeverity: randomInt(5, 20),
  }));

  return {
    modelId: model.modelId,
    modelName: model.modelName,
    totalVehicles,
    activeIssues,
    failureRate,
    highSeverityCount,
    componentBreakdown,
    regionalBreakdown,
  };
};

/**
 * Get Service Centers List
 */
export const getOEMServiceCenters = async (
  _params?: OEMServiceCentersParams
): Promise<OEMServiceCenter[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const serviceCenters: OEMServiceCenter[] = [];
  const centerNames = [
    'Downtown Service Hub',
    'North Plaza Center',
    'Eastside Facility',
    'West End Station',
    'South Bay Center',
    'Central Service Point',
    'Airport Service Center',
    'Industrial District Hub',
  ];

  centerNames.forEach((name, idx) => {
    const region = MOCK_REGIONS[idx % MOCK_REGIONS.length];
    const utilizations = ['Low', 'Medium', 'High'] as const;

    serviceCenters.push({
      id: `sc-${idx + 1}`,
      name,
      region,
      vehiclesCovered: randomInt(3000, 8000),
      activeIssues: randomInt(200, 600),
      upcomingAppointments: randomInt(50, 150),
      utilization: utilizations[randomInt(0, 2)],
    });
  });

  return serviceCenters;
};

/**
 * Get Service Center Detail
 */
export const getOEMServiceCenterDetail = async (id: string): Promise<OEMServiceCenterDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const centers = await getOEMServiceCenters();
  const center = centers.find((c) => c.id === id) || centers[0];

  const commonIssues = [
    'Battery Management System Alerts',
    'Brake Pad Wear',
    'Suspension Adjustment',
    'Software Updates',
    'Tire Rotation',
  ];

  const modelsServiced = MOCK_MODELS.slice(0, 4).map((model) => ({
    modelName: model.modelName,
    count: randomInt(200, 800),
  }));

  return {
    id: center.id,
    name: center.name,
    location: `${randomInt(100, 999)} Main Street, ${center.region} District`,
    region: center.region,
    currentLoad: randomInt(60, 95),
    upcomingLoad: randomInt(40, 80),
    commonIssues,
    modelsServiced,
  };
};

/**
 * Send OEM Chat Message
 */
export const sendOEMChatMessage = async (request: OEMChatRequest): Promise<OEMChatResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { message } = request;
  const lowerMessage = message.toLowerCase();

  let responseText = '';

  // Context-aware responses
  if (lowerMessage.includes('failure rate') || lowerMessage.includes('highest')) {
    responseText = `Based on current data, the Model X has the highest failure rate at 8.3%, primarily due to brake system issues concentrated in the South region. The Model 3 follows at 6.2%, with battery management alerts being the most common issue.`;
  } else if (lowerMessage.includes('region') || lowerMessage.includes('area')) {
    responseText = `The South region currently shows the highest incident rate with 1,184 active issues across 12,450 vehicles. This is largely attributed to brake system failures in Model X vehicles. The North region has the lowest incident rate at 4.8%.`;
  } else if (lowerMessage.includes('forecast') || lowerMessage.includes('demand')) {
    responseText = `For the next 7 days, we're forecasting approximately 1,050 service appointments. Peak demand is expected on Tuesday and Wednesday. I recommend ensuring the South Bay and Central Service Point centers are fully staffed during this period.`;
  } else if (lowerMessage.includes('component') || lowerMessage.includes('part')) {
    responseText = `The top three components requiring attention are: 1) Brake Systems (18% of all issues), 2) Battery Management Systems (15%), and 3) Suspension components (12%). Brake system issues have increased by 3% over the past 30 days.`;
  } else if (lowerMessage.includes('service center') || lowerMessage.includes('utilization')) {
    responseText = `Currently, 3 service centers are at high utilization (>85%). The West End Station is at 92% capacity. Consider routing non-urgent cases to the North Plaza Center, which is at 68% utilization.`;
  } else if (lowerMessage.includes('trend') || lowerMessage.includes('increasing')) {
    responseText = `Model X issues are trending up (+12% over 30 days), primarily in brake systems. Model S and Model Y are stable, while Model 3 shows a slight decrease (-4%). The Cybertruck has limited data but shows promising reliability so far.`;
  } else {
    responseText = `I can help you analyze fleet performance, regional trends, component failure rates, service center utilization, and forecasted demand. What specific metrics would you like to explore?`;
  }

  return {
    message: responseText,
    timestamp: new Date().toISOString(),
  };
};
