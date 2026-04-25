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
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span style={{ color: '#f5e6c8aa', fontSize: 12 }} className="uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-2">
          {labelExtra}
          {dot && <span className={`w-2 h-2 rounded-full ${dot}`} />}
        </div>
      </div>
      <div
        ref={flashRef}
        className="flex items-center rounded-xl overflow-hidden"
        style={{ background: '#2a1e0e', border: `1px solid ${error ? '#ef4444' : '#3a2a18'}` }}
      >
        <button
          onClick={stepDown}
          style={{ color: '#c0522a', fontSize: 20, width: 44, flexShrink: 0 }}
          className="h-14 flex items-center justify-center hover:bg-white/5 transition-colors"
        >−</button>
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
          style={{ color: error ? '#ef4444' : '#f5e6c8', background: 'transparent', fontSize: 22, fontFamily: 'DM Sans', textAlign: 'center', width: '100%' }}
          className="h-14 outline-none px-1"
        />
        <span style={{ color: '#f5e6c860', fontSize: 13, paddingRight: 8, flexShrink: 0 }}>{unit}</span>
        <button
          onClick={stepUp}
          style={{ color: '#c0522a', fontSize: 20, width: 44, flexShrink: 0 }}
          className="h-14 flex items-center justify-center hover:bg-white/5 transition-colors"
        >+</button>
      </div>
      {error && (
        <span style={{ color: '#ef4444', fontSize: 11, paddingLeft: 2 }}>{error}</span>
      )}
    </div>
  );
}
