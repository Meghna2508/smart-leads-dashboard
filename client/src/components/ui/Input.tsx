import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {label && <label className="input-label">{label}</label>}
        <div style={{ position: 'relative' }}>
          {icon && (
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center',
            }}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={`input-field ${error ? 'error' : ''} ${className}`}
            style={icon ? { paddingLeft: 38 } : undefined}
          />
        </div>
        {error && (
          <span style={{ fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4 }}>
            ⚠ {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;