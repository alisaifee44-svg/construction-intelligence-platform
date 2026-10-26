import { useState, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = 'image/*' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    onFileSelect(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className={`file-upload-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
      onClick={() => !file && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      id="file-upload-zone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files[0])}
        style={{ display: 'none' }}
        id="file-upload-input"
      />

      {!file ? (
        <>
          <Upload className="file-upload-icon" size={48} />
          <div className="file-upload-text">
            <strong>Click to upload</strong> or drag and drop
          </div>
          <div className="file-upload-hint">
            PNG, JPG, WEBP up to 10MB
          </div>
        </>
      ) : (
        <div className="file-preview">
          {preview && <img src={preview} alt="Preview" />}
          <div>
            <div className="file-preview-name">
              <ImageIcon size={14} style={{ display: 'inline', marginRight: 4 }} />
              {file.name}
            </div>
            <button
              className="btn btn-sm btn-secondary"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              style={{ marginTop: 8 }}
              id="clear-file-btn"
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
