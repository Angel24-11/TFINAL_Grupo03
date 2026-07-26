import React from "react";

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  icon,
  hint,
  children,
  min,
  step,
}) {
  const id = name;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {!required && label && <span className="form-label-optional">opcional</span>}
      </label>
      <div className={`input-group${icon ? " input-group--icon" : ""}`}>
        {icon && <span className="input-group-icon">{icon}</span>}
        {children ?? (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            min={min}
            step={step}
          />
        )}
      </div>
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}
