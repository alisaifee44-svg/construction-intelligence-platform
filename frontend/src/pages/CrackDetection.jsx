import { useState } from 'react';
import { Search, AlertTriangle, Wrench, Activity } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { analyzeCracks } from '../api/client';

export default function CrackDetection() {
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
      const response = await analyzeCracks(file, context);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="crack-page">
      <div className="page-header">
        <h2>🔍 Structural Crack Detection & Analysis</h2>
        <p>Upload images of cracks in walls, concrete, or foundations for AI-powered structural assessment.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="crack-input-panel">
          <div className="card-header">
            <div className="card-title">Upload Crack Image</div>
          </div>

          <FileUpload onFileSelect={setFile} />

          <div className="form-group" style={{ marginTop: 'var(--space-lg)' }}>
            <label className="form-label">Structure Details (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Describe the structure type, age, material, location of crack..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              id="crack-context-input"
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleAnalyze}
            disabled={!file || loading}
            id="crack-analyze-btn"
          >
            <Search size={18} />
            {loading ? 'Analyzing...' : 'Analyze Cracks'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="card" id="crack-results-panel">
          <div className="card-header">
            <div className="card-title">Crack Analysis Results</div>
          </div>

          {loading && <LoadingSpinner text="Analyzing structural cracks..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <Search size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Upload a crack image to begin analysis</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Overall Condition */}
              <div className="result-header">
                <div className={`result-score ${
                  result.urgency_level === 'low' ? 'score-good' :
                  result.urgency_level === 'medium' ? 'score-warning' : 'score-danger'
                }`}>
                  {result.cracks_detected}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                    Cracks Detected
                  </div>
                  <span className={`badge badge-${result.urgency_level}`}>
                    {result.urgency_level} urgency
                  </span>
                </div>
              </div>

              <div className="result-summary">{result.overall_condition}</div>

              {/* Crack Details */}
              {result.cracks && result.cracks.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Activity className="section-title-icon" size={18} />
                    Crack Details
                  </div>
                  <div className="data-list">
                    {result.cracks.map((crack, i) => (
                      <div className="data-list-item" key={i}>
                        <div
                          className="data-list-item-icon"
                          style={{ background: 'rgba(249, 115, 22, 0.15)' }}
                        >
                          <AlertTriangle size={18} color="#f97316" />
                        </div>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">
                            {crack.crack_type}
                            <span className={`badge badge-${crack.severity}`} style={{ marginLeft: 8 }}>
                              {crack.severity}
                            </span>
                          </div>
                          <div className="data-list-item-desc">
                            <strong>Width:</strong> {crack.estimated_width} · <strong>Length:</strong> {crack.estimated_length}
                          </div>
                          <div className="data-list-item-desc" style={{ marginTop: 4 }}>
                            <strong>Cause:</strong> {crack.probable_cause}
                          </div>
                          <div className="data-list-item-desc" style={{ marginTop: 4 }}>
                            <strong>Impact:</strong> {crack.structural_impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Estimate */}
              {result.estimated_repair_cost_range && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">💰 Estimated Repair Cost</div>
                  <div style={{
                    padding: 'var(--space-md)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 700,
                    color: 'var(--color-primary-light)',
                  }}>
                    {result.estimated_repair_cost_range}
                  </div>
                </div>
              )}

              {/* Recommended Actions */}
              {result.recommended_actions && result.recommended_actions.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Wrench className="section-title-icon" size={18} />
                    Recommended Actions
                  </div>
                  <div className="checklist">
                    {result.recommended_actions.map((action, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet high"></span>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monitoring Advice */}
              {result.monitoring_advice && (
                <div>
                  <div className="section-title">📋 Monitoring Advice</div>
                  <div className="result-summary" style={{ margin: 0 }}>
                    {result.monitoring_advice}
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
