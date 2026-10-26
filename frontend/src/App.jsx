import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SafetyMonitoring from './pages/SafetyMonitoring';
import CrackDetection from './pages/CrackDetection';
import RealEstateValuation from './pages/RealEstateValuation';
import ProjectPlanning from './pages/ProjectPlanning';
import DailyAssistant from './pages/DailyAssistant';
import KnowledgeAssistant from './pages/KnowledgeAssistant';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/safety" element={<SafetyMonitoring />} />
        <Route path="/crack-detection" element={<CrackDetection />} />
        <Route path="/valuation" element={<RealEstateValuation />} />
        <Route path="/planning" element={<ProjectPlanning />} />
        <Route path="/daily-assistant" element={<DailyAssistant />} />
        <Route path="/knowledge" element={<KnowledgeAssistant />} />
      </Route>
    </Routes>
  );
}
