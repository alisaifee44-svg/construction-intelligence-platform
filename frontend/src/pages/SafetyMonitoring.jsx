import { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { analyzeSafety } from '../api/client';

export default function SafetyMonitoring() {
  const [file, setFile] = useState(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await analyzeSafety(file, context);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 70) return 'score-good';
    if (score >= 40) return 'score-warning';
    return 'score-danger';
  };

  const getPPEIcon = (status) => {
    if (status === 'compliant') return <CheckCircle size={16} color="#10b981" />;
    if (status === 'non_compliant') return <XCircle size={16} color="#ef4444" />;
    return <Eye size={16} color="#64748b" />;
  };

  return (
    <div id="safety-page">
      <div className="page-header">
        <h2>🛡️ Construction Site Safety Monitoring</h2>
        <p>Upload a construction site image to detect safety hazards, PPE compliance issues, and get recommendations.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="safety-input-panel">
          <div className="card-header">
            <div className="card-title">Upload Site Image</div>
          </div>

          <FileUpload onFileSelect={setFile} />

          <div className="form-group" style={{ marginTop: 'var(--space-lg)' }}>
            <label className="form-label">Additional Context (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the construction site, current activities, weather conditions..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              id="safety-context-input"
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleAnalyze}
            disabled={!file || loading}
            id="safety-analyze-btn"
          >
            <ShieldCheck size={18} />
            {loading ? 'Analyzing...' : 'Analyze Safety'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="card" id="safety-results-panel">
          <div className="card-header">
            <div className="card-title">Analysis Results</div>
          </div>

          {loading && <LoadingSpinner text="Analyzing construction site for safety hazards..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Upload an image and click "Analyze Safety" to get started</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Safety Score */}
              <div className="result-header">
                <div className={`result-score ${getScoreClass(result.overall_safety_score)}`}>
                  {result.overall_safety_score}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                    Safety Score
                  </div>
                  <span className={`badge badge-${result.overall_risk_level}`}>
                    {result.overall_risk_level} risk
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="result-summary">{result.summary}</div>

              {/* Hazards */}
              {result.hazards && result.hazards.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <AlertTriangle className="section-title-icon" size={18} />
                    Detected Hazards ({result.hazards.length})
                  </div>
                  <div className="data-list">
                    {result.hazards.map((hazard, i) => (
                      <div className="data-list-item" key={i}>
                        <div
                          className="data-list-item-icon"
                          style={{ background: 'rgba(239, 68, 68, 0.15)' }}
                        >
                          <AlertTriangle size={18} color="#ef4444" />
                        </div>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">
                            {hazard.hazard_type}
                            <span className={`badge badge-${hazard.severity}`} style={{ marginLeft: 8 }}>
                              {hazard.severity}
                            </span>
                          </div>
                          <div className="data-list-item-desc">{hazard.description}</div>
                          <div className="data-list-item-desc" style={{ color: 'var(--color-accent-cyan)', marginTop: 4 }}>
                            📍 {hazard.location_in_image}
                          </div>
                          <div className="data-list-item-desc" style={{ color: 'var(--color-accent-green)', marginTop: 4 }}>
                            ✅ {hazard.recommendation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PPE Compliance */}
              {result.ppe_compliance && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">PPE Compliance Status</div>
                  <div className="ppe-grid">
                    {Object.entries(result.ppe_compliance).map(([item, status]) => (
                      <div className={`ppe-item ${status}`} key={item}>
                        {getPPEIcon(status)}
                        <span>{item.replace(/_/g, ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.general_recommendations && result.general_recommendations.length > 0 && (
                <div>
                  <div className="section-title">General Recommendations</div>
                  <div className="checklist">
                    {result.general_recommendations.map((rec, i) => (
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
