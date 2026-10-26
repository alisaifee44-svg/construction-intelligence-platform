import { useState } from 'react';
import { ClipboardList, Package, Calendar, AlertTriangle, Lightbulb } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { createProjectPlan } from '../api/client';

export default function ProjectPlanning() {
  const [formData, setFormData] = useState({
    project_type: '',
    description: '',
    location: '',
    area_sqft: '',
    floors: '1',
    construction_type: '',
    budget_range: '',
    timeline: '',
    special_requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.project_type || !formData.description) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        ...formData,
        area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : null,
        floors: parseInt(formData.floors) || 1,
      };
      const response = await createProjectPlan(payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Planning failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="planning-page">
      <div className="page-header">
        <h2>📋 Construction Project Planning</h2>
        <p>Enter project details to generate material estimates, cost calculations, and task schedules.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="planning-input-panel">
          <div className="card-header">
            <div className="card-title">Project Specifications</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Project Type *</label>
              <select className="form-select" name="project_type" value={formData.project_type} onChange={handleChange} required id="planning-type">
                <option value="">Select project type...</option>
                <option value="residential_house">Residential House</option>
                <option value="apartment_building">Apartment Building</option>
                <option value="commercial_office">Commercial Office</option>
                <option value="warehouse">Warehouse</option>
                <option value="retail_store">Retail Store</option>
                <option value="renovation">Renovation</option>
                <option value="road_construction">Road Construction</option>
                <option value="bridge">Bridge</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description *</label>
              <textarea className="form-textarea" name="description" placeholder="Describe the project in detail..." value={formData.description} onChange={handleChange} required id="planning-description" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input type="text" className="form-input" name="location" placeholder="City, State" value={formData.location} onChange={handleChange} id="planning-location" />
              </div>
              <div className="form-group">
                <label className="form-label">Area (sq ft)</label>
                <input type="number" className="form-input" name="area_sqft" placeholder="e.g., 5000" value={formData.area_sqft} onChange={handleChange} id="planning-area" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Floors</label>
                <input type="number" className="form-input" name="floors" min="1" value={formData.floors} onChange={handleChange} id="planning-floors" />
              </div>
              <div className="form-group">
                <label className="form-label">Construction Type</label>
                <select className="form-select" name="construction_type" value={formData.construction_type} onChange={handleChange} id="planning-construction-type">
                  <option value="">Select type...</option>
                  <option value="rcc">RCC (Reinforced Concrete)</option>
                  <option value="steel_frame">Steel Frame</option>
                  <option value="wood_frame">Wood Frame</option>
                  <option value="masonry">Masonry</option>
                  <option value="prefab">Prefabricated</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Budget Range</label>
                <input type="text" className="form-input" name="budget_range" placeholder="e.g., $200K - $500K" value={formData.budget_range} onChange={handleChange} id="planning-budget" />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline</label>
                <input type="text" className="form-input" name="timeline" placeholder="e.g., 12 months" value={formData.timeline} onChange={handleChange} id="planning-timeline" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Requirements</label>
              <textarea className="form-textarea" name="special_requirements" placeholder="Green building, accessibility, seismic resistance..." value={formData.special_requirements} onChange={handleChange} id="planning-requirements" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!formData.project_type || !formData.description || loading} id="planning-submit-btn">
              <ClipboardList size={18} />
              {loading ? 'Generating Plan...' : 'Generate Project Plan'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="card" id="planning-results-panel">
          <div className="card-header">
            <div className="card-title">Project Plan</div>
          </div>

          {loading && <LoadingSpinner text="Generating comprehensive project plan..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <ClipboardList size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Enter project details to generate a plan</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
                    Estimated Cost
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-primary-light)' }}>
                    {result.estimated_total_cost}
                  </div>
                </div>
                <div style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--color-bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
                    Estimated Duration
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-accent-cyan)' }}>
                    {result.estimated_duration}
                  </div>
                </div>
              </div>

              <div className="result-summary">{result.project_summary}</div>

              {/* Materials Table */}
              {result.materials && result.materials.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Package className="section-title-icon" size={18} />
                    Material Estimates
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Material</th>
                          <th>Quantity</th>
                          <th>Unit Cost</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.materials.map((mat, i) => (
                          <tr key={i}>
                            <td style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{mat.material_name}</td>
                            <td>{mat.quantity}</td>
                            <td>{mat.unit_cost}</td>
                            <td style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>{mat.total_cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Task Schedule */}
              {result.tasks && result.tasks.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Calendar className="section-title-icon" size={18} />
                    Task Schedule
                  </div>
                  <div className="data-list">
                    {result.tasks.map((task, i) => (
                      <div className="data-list-item" key={i}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--gradient-accent)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 700,
                          color: '#fff',
                          flexShrink: 0,
                        }}>
                          {i + 1}
                        </div>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">
                            {task.task_name}
                            <span style={{ marginLeft: 8, fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-cyan)' }}>
                              ⏱ {task.duration}
                            </span>
                          </div>
                          <div className="data-list-item-desc">{task.description}</div>
                          {task.dependencies.length > 0 && (
                            <div className="data-list-item-desc" style={{ marginTop: 4 }}>
                              <strong>Depends on:</strong> {task.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Factors */}
              {result.risk_factors && result.risk_factors.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <AlertTriangle className="section-title-icon" size={18} />
                    Risk Factors
                  </div>
                  <div className="checklist">
                    {result.risk_factors.map((risk, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet high"></span>
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <div className="section-title">
                    <Lightbulb className="section-title-icon" size={18} />
                    Recommendations
                  </div>
                  <div className="checklist">
                    {result.recommendations.map((rec, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet"></span>
                        {rec}
                      </div>
                    ))}
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
