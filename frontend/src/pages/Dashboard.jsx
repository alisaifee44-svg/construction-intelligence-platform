import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Search, Home, ClipboardList,
  CloudSun, BookOpen, ArrowRight
} from 'lucide-react';

const features = [
  {
    title: 'Safety Monitoring',
    description: 'Upload construction site images to detect hazards, PPE violations, and unsafe conditions with AI-powered analysis.',
    icon: ShieldCheck,
    iconClass: 'safety',
    path: '/safety',
    color: '#10b981',
  },
  {
    title: 'Crack Detection',
    description: 'Analyze structural cracks in concrete, walls, and foundations. Get severity assessment and repair recommendations.',
    icon: Search,
    iconClass: 'crack',
    path: '/crack-detection',
    color: '#f97316',
  },
  {
    title: 'Real Estate Valuation',
    description: 'Get AI-powered property valuations based on location, area, amenities, and current market trends.',
    icon: Home,
    iconClass: 'valuation',
    path: '/valuation',
    color: '#8b5cf6',
  },
  {
    title: 'Project Planning',
    description: 'Generate comprehensive project plans with material estimates, cost calculations, and task scheduling.',
    icon: ClipboardList,
    iconClass: 'planning',
    path: '/planning',
    color: '#3b82f6',
  },
  {
    title: 'Daily Assistant',
    description: 'Receive weather-aware daily briefings, safety checklists, and activity recommendations for your site.',
    icon: CloudSun,
    iconClass: 'assistant',
    path: '/daily-assistant',
    color: '#06b6d4',
  },
  {
    title: 'Knowledge Hub',
    description: 'Ask any construction-related question and receive expert-level answers with references and best practices.',
    icon: BookOpen,
    iconClass: 'knowledge',
    path: '/knowledge',
    color: '#ec4899',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div id="dashboard-page">
      <div className="dashboard-hero">
        <h1>Construction Intelligence</h1>
        <p>
          Leverage multimodal AI to analyze images, plan projects, and make
          smarter construction decisions — all in one platform.
        </p>
      </div>

      <div className="dashboard-grid">
        {features.map((feature) => (
          <div
            key={feature.path}
            className="dashboard-card"
            onClick={() => navigate(feature.path)}
            id={`card-${feature.iconClass}`}
          >
            <div className={`dashboard-card-icon ${feature.iconClass}`}>
              <feature.icon size={24} color={feature.color} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <div className="dashboard-card-arrow">
              <ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
