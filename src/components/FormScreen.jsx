import { useState } from 'react';
import './FormScreen.css';

export function FormScreen({ title, subtitle, children, accent = 'blue' }) {
  return (
    <div className={`form-screen form-screen--${accent}`}>
      <div className="form-container">
        <h1 className="form-title">{title}</h1>
        {subtitle && <p className="form-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

export function Field({ label, type = 'text', placeholder, value, onChange, required, error, id }) {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s/g, '-')}`;
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && visible ? 'text' : type;

  return (
    <div className="field">
      <label className={`field-label ${required ? 'field-label--required' : ''}`} htmlFor={fieldId}>
        {label}{required && ' *'}
      </label>
      <div className={isPassword ? 'field-input-wrap' : undefined}>
        <input
          id={fieldId}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`field-input ${required ? 'field-input--required' : ''} ${error ? 'field-input--error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="field-toggle-visibility"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {visible ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {error && <p className="field-error" id={`${fieldId}-error`}>{error}</p>}
    </div>
  );
}

export function SelectField({ label, options, value, onChange, id }) {
  const fieldId = id || `select-${label.toLowerCase().replace(/\s/g, '-')}`;
  return (
    <div className="field">
      <label className="field-label" htmlFor={fieldId}>{label}</label>
      <select
        id={fieldId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export function Button({ children, onClick, variant = 'filled', type = 'button' }) {
  return (
    <button type={type} className={`form-btn form-btn--${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
