import { useState } from 'react';
import { CloudSun, AlertTriangle, CheckSquare, Lightbulb, Shield, Star } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getDailyBriefing } from '../api/client';

export default function DailyAssistant() {
  const [formData, setFormData] = useState({
    location: '',
    weather: '',
    temperature: '',
    current_phase: '',
    planned_activities: '',
    worker_count: '',
    concerns: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        ...formData,
        worker_count: formData.worker_count ? parseInt(formData.worker_count) : null,
      };
      const response = await getDailyBriefing(payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="assistant-page">
      <div className="page-header">
        <h2>🌤️ Daily Site Assistance & Weather Advisory</h2>
        <p>Get AI-powered daily briefings with weather alerts, safety checklists, and activity recommendations.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="assistant-input-panel">
          <div className="card-header">
            <div className="card-title">Site Information</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Site Location *</label>
              <input type="text" className="form-input" name="location" placeholder="City, State/Country" value={formData.location} onChange={handleChange} required id="assistant-location" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Weather</label>
                <select className="form-select" name="weather" value={formData.weather} onChange={handleChange} id="assistant-weather">
                  <option value="">Select...</option>
                  <option value="sunny">Sunny</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="rainy">Rainy</option>
                  <option value="stormy">Stormy</option>
                  <option value="snowy">Snowy</option>
                  <option value="windy">Windy</option>
                  <option value="hot">Extremely Hot</option>
                  <option value="cold">Extremely Cold</option>
                  <option value="foggy">Foggy</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Temperature</label>
                <input type="text" className="form-input" name="temperature" placeholder="e.g., 35°C / 95°F" value={formData.temperature} onChange={handleChange} id="assistant-temp" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Construction Phase</label>
              <select className="form-select" name="current_phase" value={formData.current_phase} onChange={handleChange} id="assistant-phase">
                <option value="">Select phase...</option>
                <option value="excavation">Excavation & Foundation</option>
                <option value="structure">Structural Work</option>
                <option value="roofing">Roofing</option>
                <option value="electrical">Electrical & Plumbing</option>
                <option value="finishing">Interior Finishing</option>
                <option value="exterior">Exterior Work</option>
                <option value="landscaping">Landscaping</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Planned Activities Today</label>
              <textarea className="form-textarea" name="planned_activities" placeholder="Concrete pouring, steel erection, crane operations..." value={formData.planned_activities} onChange={handleChange} id="assistant-activities" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Workers on Site</label>
                <input type="number" className="form-input" name="worker_count" placeholder="e.g., 25" value={formData.worker_count} onChange={handleChange} id="assistant-workers" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Concerns</label>
              <textarea className="form-textarea" name="concerns" placeholder="New workers, equipment delivery, inspections..." value={formData.concerns} onChange={handleChange} id="assistant-concerns" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!formData.location || loading} id="assistant-submit-btn">
              <CloudSun size={18} />
              {loading ? 'Generating Briefing...' : 'Get Daily Briefing'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="card" id="assistant-results-panel">
          <div className="card-header">
            <div className="card-title">Daily Briefing</div>
          </div>

          {loading && <LoadingSpinner text="Generating daily briefing..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <CloudSun size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Enter site details to get your daily briefing</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Greeting */}
              <div style={{
                padding: 'var(--space-lg)',
                background: 'var(--gradient-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--space-lg)',
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text-primary)',
                lineHeight: 1.7,
              }}>
                {result.greeting}
              </div>

              {/* Weather Summary */}
              {result.weather_summary && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">🌤️ Weather Summary</div>
                  <div className="result-summary" style={{ margin: 0 }}>{result.weather_summary}</div>
                </div>
              )}

              {/* Weather Alerts */}
              {result.weather_alerts && result.weather_alerts.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <AlertTriangle className="section-title-icon" size={18} />
                    Weather Alerts
                  </div>
                  <div className="data-list">
                    {result.weather_alerts.map((alert, i) => (
                      <div className="data-list-item" key={i}>
                        <div className="data-list-item-icon" style={{
                          background: alert.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' :
                            alert.severity === 'high' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(245, 158, 11, 0.15)'
                        }}>
                          <AlertTriangle size={18} color={
                            alert.severity === 'critical' ? '#ef4444' :
                            alert.severity === 'high' ? '#f97316' : '#f59e0b'
                          } />
                        </div>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">
                            {alert.alert_type}
                            <span className={`badge badge-${alert.severity}`} style={{ marginLeft: 8 }}>
                              {alert.severity}
                            </span>
                          </div>
                          <div className="data-list-item-desc">{alert.description}</div>
                          <div className="data-list-item-desc" style={{ color: 'var(--color-accent-green)', marginTop: 4 }}>
                            ✅ {alert.recommended_action}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Checklist */}
              {result.daily_checklist && result.daily_checklist.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <CheckSquare className="section-title-icon" size={18} />
                    Daily Checklist
                  </div>
                  <div className="checklist">
                    {result.daily_checklist.map((item, i) => (
                      <div className="checklist-item" key={i}>
                        <span className={`checklist-bullet ${item.priority}`}></span>
                        <span>{item.item}</span>
                        <span className="tag" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>{item.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Recommendations */}
              {result.activity_recommendations && result.activity_recommendations.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Lightbulb className="section-title-icon" size={18} />
                    Activity Recommendations
                  </div>
                  <div className="checklist">
                    {result.activity_recommendations.map((rec, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet"></span>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Reminders */}
              {result.safety_reminders && result.safety_reminders.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Shield className="section-title-icon" size={18} />
                    Safety Reminders
                  </div>
                  <div className="checklist">
                    {result.safety_reminders.map((rem, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet high"></span>
                        {rem}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tip of the Day */}
              {result.tip_of_the_day && (
                <div style={{
                  padding: 'var(--space-lg)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--color-primary-light)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                    <Star size={16} /> Tip of the Day
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {result.tip_of_the_day}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
