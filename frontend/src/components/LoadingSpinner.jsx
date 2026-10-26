export default function LoadingSpinner({ text = 'Analyzing with AI...' }) {
  return (
    <div className="loading-spinner" id="loading-spinner">
      <div className="spinner"></div>
      <div className="loading-text">{text}</div>
    </div>
  );
}
