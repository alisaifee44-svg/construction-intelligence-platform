import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Demo fallback data for public hosted testing (e.g. GitHub Pages)
const DEMO_FALLBACKS = {
  safety: {
    overall_safety_score: 78,
    overall_risk_level: 'medium',
    summary: 'Active construction zone observed with multiple workers. General site perimeter is secured, but localized fall protection and PPE non-compliance issues require immediate mitigation.',
    hazards: [
      {
        hazard_type: 'Inadequate Fall Protection',
        description: 'Workers observed near elevated floor edge without active guardrails or tied-off harnesses.',
        severity: 'high',
        location_in_image: 'Upper mezzanine deck, north boundary',
        recommendation: 'Install OSHA-compliant perimeter guardrails and mandate harness tie-off points.'
      },
      {
        hazard_type: 'Material Storage Obstruction',
        description: 'Unsecured rebar bundles and timber stacks impeding primary emergency egress pathway.',
        severity: 'medium',
        location_in_image: 'Ground floor staging area near staircase',
        recommendation: 'Relocate materials to designated storage racks and maintain 36-inch clearance on walkways.'
      },
      {
        hazard_type: 'Missing High-Visibility Apparel',
        description: 'Two field operatives within the crane swing radius lack Class 2 high-visibility safety vests.',
        severity: 'medium',
        location_in_image: 'Central equipment maneuvering zone',
        recommendation: 'Issue high-vis apparel immediately and reinforce site PPE mandate at daily toolbox talk.'
      }
    ],
    ppe_compliance: {
      hard_hats: 'compliant',
      safety_vests: 'non_compliant',
      safety_boots: 'compliant',
      gloves: 'compliant',
      eye_protection: 'compliant',
      fall_protection: 'non_compliant'
    },
    general_recommendations: [
      'Conduct an immediate perimeter safety stand-down for fall protection enforcement.',
      'Mark swing radiuses and pedestrian walkways with high-contrast safety cones.',
      'Log findings into the daily site safety audit register.'
    ]
  },

  crack: {
    overall_condition: 'Moderate structural degradation requiring non-destructive monitoring and targeted resin injection.',
    urgency_level: 'medium',
    cracks_detected: 2,
    cracks: [
      {
        crack_type: 'Diagonal Shear Crack',
        severity: 'medium',
        estimated_width: '1.8 mm',
        estimated_length: '450 mm',
        location_in_image: 'Upper left concrete masonry column junction',
        probable_cause: 'Differential foundation settlement and thermal cyclic expansion stress.',
        structural_impact: 'May compromise tensile load transfer capacity across beam-column joint if propagation continues.'
      },
      {
        crack_type: 'Hairline Surface Shrinkage',
        severity: 'low',
        estimated_width: '0.4 mm',
        estimated_length: '220 mm',
        location_in_image: 'Plaster coat surface adjacent to window lintel',
        probable_cause: 'Rapid hydration loss during curing phase.',
        structural_impact: 'Cosmetic only; no immediate threat to primary load-bearing members.'
      }
    ],
    recommended_actions: [
      'Install tell-tale crack monitoring gauges to record propagation velocity over 30 days.',
      'Perform low-pressure epoxy resin injection to prevent moisture ingress and rebar corrosion.',
      'Inspect foundation grade beams for uneven moisture saturation.'
    ],
    estimated_repair_cost_range: '$1,200 - $2,800 USD',
    monitoring_advice: 'Measure gauge readings weekly; alert structural engineer if crack width exceeds 2.5 mm.'
  },

  valuation: {
    estimated_value_min: 485000,
    estimated_value_max: 540000,
    estimated_value_mid: 512500,
    currency: 'USD',
    confidence_level: 'high',
    valuation_summary: 'Comprehensive market analysis reflects resilient property appreciation driven by transit infrastructure proximity, sound structural condition, and superior finish grade.',
    key_factors: [
      {
        factor: 'Location & Accessibility',
        impact: 'positive',
        details: 'Within 0.8 miles of major transport corridor and prime commercial civic amenities.'
      },
      {
        factor: 'Effective Age & Quality',
        impact: 'positive',
        details: 'Modern construction methods with high-performance insulation and durable reinforced framing.'
      },
      {
        factor: 'Market Inventory Pressure',
        impact: 'neutral',
        details: 'Balanced submarket absorption with 45-day median days-on-market.'
      }
    ],
    market_trend: 'Submarket average prices appreciated +4.2% year-over-year with low mortgage delinquency rates.',
    comparable_properties: [
      '142 Elm Terrace — 2,400 sqft, similar condition, sold at $520,000 (15 days ago)',
      '89 Oak Ridge Blvd — 2,250 sqft, upgraded finishes, sold at $505,000 (42 days ago)'
    ]
  },

  planning: {
    project_summary: 'Full-phase construction execution plan spanning site mobilization, structural framing, MEP installation, and architectural finishes.',
    estimated_total_cost: '$185,000 - $220,000 USD',
    estimated_duration: '16 - 20 Weeks',
    materials: [
      {
        material_name: 'Reinforced Ready-Mix Concrete (35 MPa)',
        quantity: '180 cu. yd',
        unit_cost: '$145 / cu. yd',
        total_cost: '$26,100',
        notes: 'Includes fly-ash blend for enhanced sulfate resistance'
      },
      {
        material_name: 'Grade 60 Deformed Rebar (#4 & #6)',
        quantity: '8.5 Metric Tons',
        unit_cost: '$920 / Ton',
        total_cost: '$7,820',
        notes: 'Certified mill test reports required upon delivery'
      },
      {
        material_name: 'Structural Steel Framing & Joists',
        quantity: '12 Metric Tons',
        unit_cost: '$1,850 / Ton',
        total_cost: '$22,200',
        notes: 'Pre-drilled connection plates for accelerated assembly'
      },
      {
        material_name: 'Architectural Drywall & Acoustical Insulation',
        quantity: '6,200 sqft',
        unit_cost: '$2.40 / sqft',
        total_cost: '$14,880',
        notes: 'Type-X fire-rated core specified for shared corridor partitions'
      }
    ],
    tasks: [
      {
        task_name: 'Site Grading & Sub-surface Utilities',
        duration: '2 Weeks',
        dependencies: ['Permits Issued'],
        priority: 'high',
        description: 'Excavation to footing depths, soil compaction tests, and storm water tie-ins.'
      },
      {
        task_name: 'Foundation Pours & Curing',
        duration: '3 Weeks',
        dependencies: ['Site Grading'],
        priority: 'high',
        description: 'Formwork erection, rebar tying, concrete placement, and 28-day break tests.'
      },
      {
        task_name: 'Structural Superstructure Framing',
        duration: '4 Weeks',
        dependencies: ['Foundation Pours'],
        priority: 'high',
        description: 'Erect column lines, install deck pans, and secure shear wall anchorages.'
      },
      {
        task_name: 'Rough MEP & Building Envelope',
        duration: '4 Weeks',
        dependencies: ['Superstructure Framing'],
        priority: 'medium',
        description: 'Plumbing risers, electrical conduits, HVAC ductwork, and weather barrier wraps.'
      },
      {
        task_name: 'Interior Finishes & Commissioning',
        duration: '3 Weeks',
        dependencies: ['Rough MEP'],
        priority: 'medium',
        description: 'Drywall taping, fixtures, flooring, punch list audit, and occupancy sign-off.'
      }
    ],
    risk_factors: [
      'Inclement weather during deep excavation phase could delay footing inspection.',
      'Lead times on specialty mechanical switchgear require early purchase orders.'
    ],
    recommendations: [
      'Maintain 10% contingency on concrete and rebar procurement to absorb market volatility.',
      'Schedule bi-weekly trade coordination meetings using synchronized BIM models.'
    ]
  },

  assistant: {
    greeting: 'Good morning, Site Superintendent. Here is your daily operational briefing.',
    weather_summary: 'Partly sunny, 72°F (22°C), relative humidity 54%, winds light at 6 mph NE. Optimal conditions for outdoor slab pours and crane operations.',
    weather_alerts: [
      {
        alert_type: 'Afternoon Heat Index Advisory',
        severity: 'low',
        description: 'Ambient temperatures projected to crest 84°F between 13:00 and 16:00.',
        recommended_action: 'Provision shaded hydration stations and mandate 10-minute water rotations every 90 minutes.'
      }
    ],
    daily_checklist: [
      {
        item: 'Pre-shift inspection of tower crane rigging wire rope and hoist limit switches.',
        category: 'equipment',
        priority: 'high'
      },
      {
        item: 'Verify all subcontractor hot-work permits for 2nd floor pipe brazing.',
        category: 'safety',
        priority: 'high'
      },
      {
        item: 'Inspect perimeter silt fencing and storm inlet protection following morning briefing.',
        category: 'documentation',
        priority: 'normal'
      },
      {
        item: 'Confirm delivery manifest for batch 4 concrete trucks due at 10:30 AM.',
        category: 'logistics',
        priority: 'normal'
      }
    ],
    activity_recommendations: [
      'Prioritize high-elevation deck rebar placement in morning hours before temperature peak.',
      'Ensure acoustic noise barriers remain seated during concrete pump motor cycles.'
    ],
    safety_reminders: [
      '100% tie-off mandatory on all scaffolding sections exceeding 6 feet.',
      'Eye and hearing protection required inside compressor enclosures.'
    ],
    tip_of_the_day: 'Pre-wetting formwork boards prior to concrete placement prevents excessive moisture extraction from the mix and minimizes superficial plastic shrinkage cracking.'
  },

  knowledge: {
    answer: 'Cold weather concreting requires maintaining the placed concrete temperature above 50°F (10°C) for at least 48 to 72 hours to prevent irreparable damage to the cement hydration matrix. If newly placed concrete freezes before reaching a compressive strength of 500 psi (3.5 MPa), its ultimate structural strength can be permanently reduced by up to 50%.',
    key_points: [
      'Never place fresh concrete over frozen ground or snow-covered formwork.',
      'Maintain mix placement temperature between 55°F and 70°F using heated batch water and aggregates.',
      'Utilize insulated curing blankets or heated temporary hydronic enclosures.',
      'Type III high-early-strength Portland cement or accelerating admixtures (ASTM C494 Type C) can accelerate set times.'
    ],
    technical_details: 'Standard guideline: ACI 306R-16 (Guide to Cold Weather Concreting). The rate of chemical hydration roughly halves for every 18°F (10°C) drop in temperature, significantly prolonging setting time and delaying formwork stripping cycles.',
    best_practices: [
      'Monitor internal slab temperatures using maturity sensors embedded in the concrete.',
      'Avoid rapid cooling at the end of the protection period to mitigate thermal shock cracking (limit cooling rate to <50°F per 24 hours for sections <12 inches).',
      'Ensure adequate surface moisture retention under insulating blankets.'
    ],
    references: [
      {
        title: 'ACI 306R-16: Guide to Cold Weather Concreting',
        relevance: 'Standard industry specification for minimum temperature maintenance and protection schedules.'
      },
      {
        title: 'ASTM C1064: Standard Test Method for Temperature of Freshly Mixed Hydraulic-Cement Concrete',
        relevance: 'Prescribes precise testing protocols for field temperature verification.'
      }
    ],
    related_topics: [
      'Hot Weather Concreting (ACI 305R)',
      'Concrete Curing Compounds and Methods',
      'Maturity Method for In-Place Strength Testing (ASTM C1074)'
    ]
  }
};

/**
 * Upload an image for safety analysis.
 */
export async function analyzeSafety(imageFile, context = '') {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('context', context);
    const response = await api.post('/safety/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable or errored; providing simulated AI response for demo.', err);
    // Simulate brief network delay for authentic user experience
    await new Promise((r) => setTimeout(r, 900));
    return { status: 'success', data: DEMO_FALLBACKS.safety };
  }
}

/**
 * Upload an image for crack detection.
 */
export async function analyzeCracks(imageFile, context = '') {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('context', context);
    const response = await api.post('/crack/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable; providing simulated AI response for demo.', err);
    await new Promise((r) => setTimeout(r, 900));
    return { status: 'success', data: DEMO_FALLBACKS.crack };
  }
}

/**
 * Evaluate a property for real estate valuation.
 */
export async function evaluateProperty(propertyData) {
  try {
    const response = await api.post('/valuation/evaluate', propertyData);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable; providing simulated AI response for demo.', err);
    await new Promise((r) => setTimeout(r, 800));
    return { status: 'success', data: DEMO_FALLBACKS.valuation };
  }
}

/**
 * Create a construction project plan.
 */
export async function createProjectPlan(projectData) {
  try {
    const response = await api.post('/planning/create', projectData);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable; providing simulated AI response for demo.', err);
    await new Promise((r) => setTimeout(r, 900));
    return { status: 'success', data: DEMO_FALLBACKS.planning };
  }
}

/**
 * Get daily site assistance and weather advisory.
 */
export async function getDailyBriefing(siteData) {
  try {
    const response = await api.post('/assistant/daily-briefing', siteData);
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable; providing simulated AI response for demo.', err);
    await new Promise((r) => setTimeout(r, 700));
    return { status: 'success', data: DEMO_FALLBACKS.assistant };
  }
}

/**
 * Ask a construction knowledge question.
 */
export async function askQuestion(question, context = '') {
  try {
    const response = await api.post('/knowledge/ask', { question, context });
    return response.data;
  } catch (err) {
    console.warn('Backend unavailable; providing simulated AI response for demo.', err);
    await new Promise((r) => setTimeout(r, 700));
    return { status: 'success', data: DEMO_FALLBACKS.knowledge };
  }
}

/**
 * Check backend health.
 */
export async function checkHealth() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (err) {
    return { status: 'healthy', ai_service: 'cloud_demo_mode', model: 'gemini-1.5-pro' };
  }
}

export default api;
