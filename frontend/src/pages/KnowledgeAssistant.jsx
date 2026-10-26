import { useState } from 'react';
import { BookOpen, Send, Lightbulb, ExternalLink, Hash } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { askQuestion } from '../api/client';

export default function KnowledgeAssistant() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || question.trim().length < 5) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await askQuestion(question, context);
      setResult(response.data);
      setHistory(prev => [...prev, { question, answer: response.data.answer }]);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "What is the difference between RCC and steel frame construction?",
    "How to prevent concrete cracks during curing?",
    "What are the OSHA safety requirements for scaffolding?",
    "Best waterproofing methods for basements?",
    "How to calculate concrete mix ratio for M25 grade?",
    "What are the latest sustainable construction practices?",
  ];

  return (
    <div id="knowledge-page">
      <div className="page-header">
        <h2>🧠 Construction Knowledge Hub</h2>
        <p>Ask any construction-related question and receive expert-level answers with best practices.</p>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <div className="page-split">
        {/* Input Panel */}
        <div className="card" id="knowledge-input-panel">
          <div className="card-header">
            <div className="card-title">Ask a Question</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Question *</label>
              <textarea
                className="form-textarea"
                placeholder="Type your construction-related question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                style={{ minHeight: 120 }}
                required
                id="knowledge-question"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Additional Context (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., residential, tropical climate, high-rise..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                id="knowledge-context"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={!question.trim() || question.trim().length < 5 || loading}
              id="knowledge-submit-btn"
            >
              <Send size={18} />
              {loading ? 'Processing...' : 'Ask Question'}
            </button>
          </form>

          {/* Sample Questions */}
          <div style={{ marginTop: 'var(--space-xl)' }}>
            <div className="section-title" style={{ fontSize: 'var(--font-size-xs)' }}>
              💡 Try asking
            </div>
            <div className="tag-list">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  className="tag"
                  onClick={() => setQuestion(q)}
                  style={{ cursor: 'pointer', border: '1px solid var(--color-border)' }}
                >
                  {q.length > 45 ? q.slice(0, 45) + '...' : q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card" id="knowledge-results-panel">
          <div className="card-header">
            <div className="card-title">Expert Answer</div>
          </div>

          {loading && <LoadingSpinner text="Researching your question..." />}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--color-text-muted)' }}>
              <BookOpen size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p>Ask a question to get started</p>
            </div>
          )}

          {result && (
            <div className="result-container">
              {/* Main Answer */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="knowledge-answer" style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.8,
                }}>
                  {result.answer}
                </div>
              </div>

              {/* Key Points */}
              {result.key_points && result.key_points.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Hash className="section-title-icon" size={18} />
                    Key Points
                  </div>
                  <div className="checklist">
                    {result.key_points.map((point, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet"></span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Details */}
              {result.technical_details && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">🔧 Technical Details</div>
                  <div style={{
                    padding: 'var(--space-md)',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                  }}>
                    {result.technical_details}
                  </div>
                </div>
              )}

              {/* Best Practices */}
              {result.best_practices && result.best_practices.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <Lightbulb className="section-title-icon" size={18} />
                    Best Practices
                  </div>
                  <div className="checklist">
                    {result.best_practices.map((practice, i) => (
                      <div className="checklist-item" key={i}>
                        <span className="checklist-bullet"></span>
                        {practice}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {result.references && result.references.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div className="section-title">
                    <ExternalLink className="section-title-icon" size={18} />
                    References
                  </div>
                  <div className="data-list">
                    {result.references.map((ref, i) => (
                      <div className="data-list-item" key={i}>
                        <div className="data-list-item-content">
                          <div className="data-list-item-title">{ref.title}</div>
                          <div className="data-list-item-desc">{ref.relevance}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Topics */}
              {result.related_topics && result.related_topics.length > 0 && (
                <div>
                  <div className="section-title">🔗 Related Topics</div>
                  <div className="tag-list">
                    {result.related_topics.map((topic, i) => (
                      <button
                        key={i}
                        className="tag"
                        onClick={() => setQuestion(topic)}
                        style={{ cursor: 'pointer' }}
                      >
                        {topic}
                      </button>
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
