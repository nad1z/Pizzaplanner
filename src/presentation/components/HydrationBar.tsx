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
      <div className="hydration-bar__header">
        <span className="uppercase tracking-widest">{t.card.hydrationRange}</span>
      </div>
      <div className="hydration-bar__track">
        <div className="hydration-bar__fill" />
        <div
          className="hydration-bar__marker hydration-bar__marker--default"
          style={{ left: `${defaultPct}%` }}
        />
        {currentPct !== null && (
          <div
            className="hydration-bar__marker hydration-bar__marker--current"
            style={{ left: `${currentPct}%` }}
          />
        )}
      </div>
      <div className="hydration-bar__footer">
        <span>{min}%</span>
        <span className="hydration-bar__optimal">
          {t.card.optimal(defaultVal)}{current !== undefined ? ` · ${t.card.yours(current)}` : ''}
        </span>
        <span>{max}%</span>
      </div>
    </div>
  );
}
