import { useTranslation } from '../../i18n';

interface HydrationBarProps {
  min: number;
  max: number;
  defaultVal: number;
  current?: number;
}

export function HydrationBar({ min, max, defaultVal, current }: HydrationBarProps) {
  const t = useTranslation();
  const range = max - min;
  const defaultPct = ((defaultVal - min) / range) * 100;
  const currentPct = current !== undefined
    ? Math.min(100, Math.max(0, ((current - min) / range) * 100))
    : null;

  return (
    <div>
      <div style={{ fontSize: 10, color: '#f5e6c870', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span className="uppercase tracking-widest">{t.card.hydrationRange}</span>
      </div>
      <div style={{ position: 'relative', height: 8, background: '#3a2a18', borderRadius: 4 }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
          background: 'linear-gradient(to right, #c0522a33, #c0522a88)',
          borderRadius: 4,
        }} />
        <div style={{
          position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
          left: `${defaultPct}%`,
          width: 14, height: 14, background: '#c0522a', borderRadius: '50%',
          border: '2px solid #1a1209', zIndex: 2,
        }} />
        {currentPct !== null && (
          <div style={{
            position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
            left: `${currentPct}%`,
            width: 10, height: 10, background: '#f5e6c8', borderRadius: '50%',
            border: '2px solid #1a1209', zIndex: 3,
          }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#f5e6c860', marginTop: 4 }}>
        <span>{min}%</span>
        <span style={{ color: '#c0522aaa' }}>
          {t.card.optimal(defaultVal)}{current !== undefined ? ` · ${t.card.yours(current)}` : ''}
        </span>
        <span>{max}%</span>
      </div>
    </div>
  );
}
