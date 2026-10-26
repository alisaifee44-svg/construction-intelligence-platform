import { AlertTriangle } from 'lucide-react';

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" id="error-banner">
      <AlertTriangle size={18} />
      <span>{message}</span>
      {onDismiss && (
        <button
          className="btn btn-sm btn-secondary"
          onClick={onDismiss}
          style={{ marginLeft: 'auto' }}
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
