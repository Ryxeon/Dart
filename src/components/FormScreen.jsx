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
  return (
    <div className="field">
      <label className={`field-label ${required ? 'field-label--required' : ''}`} htmlFor={fieldId}>
        {label}{required && ' *'}
      </label>
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`field-input ${required ? 'field-input--required' : ''} ${error ? 'field-input--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      />
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
