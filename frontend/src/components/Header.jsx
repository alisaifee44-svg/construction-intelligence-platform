import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of all modules' },
  '/safety': { title: 'Safety Monitoring', subtitle: 'AI-powered site safety analysis' },
  '/crack-detection': { title: 'Crack Detection', subtitle: 'Structural crack analysis' },
  '/valuation': { title: 'Real Estate Valuation', subtitle: 'AI property valuation' },
  '/planning': { title: 'Project Planning', subtitle: 'Material estimation & scheduling' },
  '/daily-assistant': { title: 'Daily Assistant', subtitle: 'Weather-aware site advisory' },
  '/knowledge': { title: 'Knowledge Hub', subtitle: 'Construction expertise Q&A' },
};

export default function Header() {
  const location = useLocation();
  const meta = pageMeta[location.pathname] || pageMeta['/'];

  return (
    <header className="header" id="main-header">
      <div className="header-left">
        <div>
          <div className="header-title">{meta.title}</div>
          <div className="header-subtitle">{meta.subtitle}</div>
        </div>
      </div>
      <div className="header-badge">
        <Sparkles size={12} />
        AI-Powered
      </div>
    </header>
  );
}
