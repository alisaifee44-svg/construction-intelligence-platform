import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShieldCheck, Search, Home, ClipboardList,
  CloudSun, BookOpen, HardHat
} from 'lucide-react';

const navItems = [
  {
    section: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Analysis',
    items: [
      { path: '/safety', label: 'Safety Monitoring', icon: ShieldCheck },
      { path: '/crack-detection', label: 'Crack Detection', icon: Search },
    ],
  },
  {
    section: 'Planning',
    items: [
      { path: '/valuation', label: 'Real Estate Valuation', icon: Home },
      { path: '/planning', label: 'Project Planning', icon: ClipboardList },
    ],
  },
  {
    section: 'Assistance',
    items: [
      { path: '/daily-assistant', label: 'Daily Assistant', icon: CloudSun },
      { path: '/knowledge', label: 'Knowledge Hub', icon: BookOpen },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" id="main-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <HardHat size={22} color="#fff" />
        </div>
        <div className="sidebar-logo-text">
          <h1>ConstructAI</h1>
          <span>Intelligence Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav" id="sidebar-navigation">
        {navItems.map((section) => (
          <div key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-link ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
                id={`nav-${item.path.replace('/', '') || 'dashboard'}`}
              >
                <item.icon className="nav-icon" size={18} />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-status">
          <span className="status-dot" id="ai-status-dot"></span>
          <span>AI Engine Ready</span>
        </div>
      </div>
    </aside>
  );
}
