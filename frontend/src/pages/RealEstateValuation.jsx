import { useState } from 'react';
import { Home, TrendingUp, DollarSign, MapPin } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { evaluateProperty } from '../api/client';

export default function RealEstateValuation() {
  const [formData, setFormData] = useState({
    location: '',
    property_type: 'residential',
    area_sqft: '',
    bedrooms: '',
    bathrooms: '',
    year_built: '',
    condition: 'average',
    amenities: '',
    additional_notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location || !formData.area_sqft) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        ...formData,
        area_sqft: parseFloat(formData.area_sqft) || 0,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
      };
      const response = await evaluateProperty(payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Valuation failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: result?.currency || 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div id="valuation-page">
      <div className="page-header">
        <h2>🏠 Real Estate Valuation</h2>
        <p>Enter property details for an AI-powered valuation estimate with market analysis.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="valuation-input-panel">
          <div className="card-header">
            <div className="card-title">Property Details</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Location / Address *</label>
              <input
                type="text"
                className="form-input"
                name="location"
                placeholder="e.g., Manhattan, New York"
                value={formData.location}
                onChange={handleChange}
                required
                id="valuation-location"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Property Type *</label>
                <select className="form-select" name="property_type" value={formData.property_type} onChange={handleChange} id="valuation-type">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed_use">Mixed Use</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Area (sq ft) *</label>
                <input
                  type="number"
                  className="form-input"
                  name="area_sqft"
                  placeholder="e.g., 2000"
                  value={formData.area_sqft}
                  onChange={handleChange}
                  required
                  id="valuation-area"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input type="number" className="form-input" name="bedrooms" placeholder="e.g., 3" value={formData.bedrooms} onChange={handleChange} id="valuation-bedrooms" />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input type="number" className="form-input" name="bathrooms" placeholder="e.g., 2" value={formData.bathrooms} onChange={handleChange} id="valuation-bathrooms" />
              </div>
              <div className="form-group">
                <label className="form-label">Year Built</label>
                <input type="number" className="form-input" name="year_built" placeholder="e.g., 2010" value={formData.year_built} onChange={handleChange} id="valuation-year" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <select className="form-select" name="condition" value={formData.condition} onChange={handleChange} id="valuation-condition">
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amenities</label>
              <input type="text" className="form-input" name="amenities" placeholder="Pool, garage, garden, smart home..." value={formData.amenities} onChange={handleChange} id="valuation-amenities" />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Notes</label>
              <textarea className="form-textarea" name="additional_notes" placeholder="Any additional details..." value={formData.additional_notes} onChange={handleChange} id="valuation-notes" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={!formData.location || !formData.area_sqft || loading} id="valuation-submit-btn">
              <DollarSign size={18} />
              {loading ? 'Evaluating...' : 'Get Valuation'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="card" id="valuation-results-panel">
          <div className="card-header">
            <div className="card-title">Valuation Results</div>
          </div>

          {loading && <LoadingSpinner text="Evaluating property value..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <Home size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Enter property details to get an AI valuation</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Value Range */}
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-xl)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--space-lg)',
              }}>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
                  Estimated Market Value
                </div>
                <div style={{
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 900,
                  background: 'var(--gradient-primary)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {formatCurrency(result.estimated_value_mid)}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 8 }}>
                  Range: {formatCurrency(result.estimated_value_min)} — {formatCurrency(result.estimated_value_max)}
                </div>
                <span className={`badge ${
                  result.confidence_level === 'high' ? 'badge-low' :
                  result.confidence_level === 'moderate' ? 'badge-medium' : 'badge-high'
                }`} style={{ marginTop: 12 }}>
                  {result.confidence_level} confidence
                </span>
              </div>

              {/* Summary */}
              <div className="result-summary">{result.valuation_summary}</div>

              {/* Key Factors */}
              {result.key_factors && result.key_factors.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <TrendingUp className="section-title-icon" size={18} />
                    Key Valuation Factors
                  </div>
                  <div className="data-list">
                    {result.key_factors.map((factor, i) => (
                      <div className="data-list-item" key={i}>
                        <div className="data-list-item-icon" style={{
                          background: factor.impact === 'positive' ? 'rgba(16, 185, 129, 0.15)' :
                            factor.impact === 'negative' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)'
                        }}>
                          {factor.impact === 'positive' ? '📈' : factor.impact === 'negative' ? '📉' : '➡️'}
                        </div>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">{factor.factor}</div>
                          <div className="data-list-item-desc">{factor.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Trend */}
              {result.market_trend && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">📊 Market Trend</div>
                  <div className="result-summary" style={{ margin: 0 }}>{result.market_trend}</div>
                </div>
              )}

              {/* Comparable Properties */}
              {result.comparable_properties && result.comparable_properties.length > 0 && (
                <div>
                  <div className="section-title">
                    <MapPin className="section-title-icon" size={18} />
                    Comparable Properties
                  </div>
                  <div className="checklist">
                    {result.comparable_properties.map((prop, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet"></span>
                        {prop}
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
