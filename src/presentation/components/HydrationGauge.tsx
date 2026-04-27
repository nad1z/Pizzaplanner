import { validityLevel } from '../utils/validity';
import { useTranslation } from '../../i18n';

interface HydrationGaugeProps {
  value: number;
  styleMin: number;
  styleMax: number;
  flourMin?: number;
  flourMax?: number;
}

export function HydrationGauge({ value, styleMin, styleMax, flourMin, flourMax }: HydrationGaugeProps) {
  const t = useTranslation();
  const R = 66, cx = 90, cy = 87;
  const hasFlour = flourMin !== undefined && flourMax !== undefined;

  const pctToRad = (pct: number) => (Math.max(0, Math.min(100, pct)) / 100 - 1) * Math.PI;

  const arc = (startPct: number, endPct: number): string => {
    if (endPct <= startPct) return '';
    const sa = pctToRad(startPct);
    const ea = pctToRad(endPct);
    const sx = cx + R * Math.cos(sa), sy = cy + R * Math.sin(sa);
    const ex = cx + R * Math.cos(ea), ey = cy + R * Math.sin(ea);
    // Semicircle arcs are always ≤ 180° so large-arc flag is always 0
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };

  const na = pctToRad(Math.max(0, Math.min(100, value)));
  const nx = cx + R * Math.cos(na), ny = cy + R * Math.sin(na);

  const validity = validityLevel(value, styleMin, styleMax);

  const lo = hasFlour ? Math.min(styleMin, flourMin!) : styleMin;
  const hi = hasFlour ? Math.max(styleMax, flourMax!) : styleMax;

  return (
    <svg viewBox="0 0 180 114" className={`gauge gauge--${validity}`}>
      <path d={arc(0, 100)} className="gauge__background" />

      {lo > 1   && <path d={arc(0, lo)}   className="gauge__out-of-range" />}
      {hi < 99  && <path d={arc(hi, 100)} className="gauge__out-of-range" />}

      {hasFlour && (
        <path d={arc(flourMin!, flourMax!)} className="gauge__flour-range" />
      )}

      <path d={arc(styleMin, styleMax)} className="gauge__style-range" />

      <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)} className="gauge__needle" />
      <circle cx={cx} cy={cy} r="4.5" className="gauge__center" />

      <text x={cx} y={cy - 18} textAnchor="middle" className="gauge__value">{value}%</text>
      <text x={cx} y={cy -  5} textAnchor="middle" className="gauge__label">{t.gauge.hydration}</text>

      <text x="14"  y="99" className="gauge__bound">0%</text>
      <text x="166" y="99" textAnchor="end" className="gauge__bound">100%</text>

      <text x={cx} y="107" textAnchor="middle" className="gauge__style-text">{t.gauge.styleRange(styleMin, styleMax)}</text>
      {hasFlour && (
        <text x={cx} y="114" textAnchor="middle" className="gauge__flour-text">{t.gauge.flourRange(flourMin!, flourMax!)}</text>
      )}
    </svg>
  );
}
