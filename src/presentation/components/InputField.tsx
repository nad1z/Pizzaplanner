import { useEffect, useRef, useState } from 'react';
import type { ValidityLevel } from '../utils/validity';
import { DOT_CLASSES } from '../utils/validity';

interface InputFieldProps {
  label: string;
  unit: string;
  value: number;
  onChange: (value: number) => void;
  validity?: ValidityLevel;
  error?: string;
  step?: number;
  min?: number;
  max?: number;
  snapToStep?: boolean;
  labelExtra?: React.ReactNode;
}

export function InputField({ label, unit, value, onChange, validity, error, step = 1, min: fmin, max: fmax, snapToStep = true, labelExtra }: InputFieldProps) {
  const flashRef = useRef<HTMLDivElement>(null);
  const prevVal = useRef(value);
  const [localValue, setLocalValue] = useState<string>(String(value));
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) {
      setLocalValue(String(value));
      if (prevVal.current !== value && flashRef.current) {
        flashRef.current.classList.remove('flash');
        void flashRef.current.offsetWidth;
        flashRef.current.classList.add('flash');
      }
    }
    prevVal.current = value;
  }, [value]);

  const dot = validity && !error ? DOT_CLASSES[validity] : null;

  // Snap to the nearest step-grid boundary before moving (snapToStep=true, the
  // default). This means a typed-in 583g snaps to 580 on the first − click,
  // then 570, 560… Primary/stored fields benefit from this; derived/back-
  // calculated fields (flour, water) must use snapToStep=false because the
  // round-trip through compute() creates a fixed-point trap where snapping
  // always resolves to the same intermediate value and the button appears stuck.
  const stepDown = () => {
    const clamped = fmax !== undefined ? Math.min(fmax, value) : value;
    const next = snapToStep
      ? (() => { const base = Math.floor(clamped / step) * step; return base < clamped ? base : base - step; })()
      : clamped - step;
    onChange(Math.max(fmin ?? -Infinity, next));
  };
  const stepUp = () => {
    const clamped = fmin !== undefined ? Math.max(fmin, value) : value;
    const next = snapToStep
      ? (() => { const base = Math.ceil(clamped / step) * step; return base > clamped ? base : base + step; })()
      : clamped + step;
    onChange(Math.min(fmax ?? Infinity, next));
  };

  return (
    <div className="input-field">
      <div className="input-field__header">
        <span className="input-field__label uppercase tracking-widest">{label}</span>
        <div className="input-field__extras">
          {labelExtra}
          {dot && <span className={`input-field__dot ${dot}`} />}
        </div>
      </div>
      <div
        ref={flashRef}
        className={`input-field__box${error ? ' input-field__box--error' : ''}`}
      >
        <button onClick={stepDown} className="input-field__step">−</button>
        <input
          type="number"
          value={localValue}
          min={fmin}
          max={fmax}
          step="any"
          onChange={e => {
            const str = e.target.value;
            setLocalValue(str);
            const n = Number(str);
            if (str !== '' && Number.isFinite(n)) onChange(n);
          }}
          onFocus={e => {
            focusedRef.current = true;
            e.target.select();
          }}
          onBlur={() => {
            focusedRef.current = false;
            const n = Number(localValue);
            if (localValue === '' || !Number.isFinite(n)) {
              setLocalValue(String(value));
            } else {
              onChange(n);
            }
          }}
          className={`input-field__input${error ? ' input-field__input--error' : ''}`}
        />
        <span className="input-field__unit">{unit}</span>
        <button onClick={stepUp} className="input-field__step">+</button>
      </div>
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
}
