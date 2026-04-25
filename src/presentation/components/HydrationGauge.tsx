import { validityLevel, RING_COLORS } from '../utils/validity';
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

  const color = RING_COLORS[validityLevel(value, styleMin, styleMax)];

  const lo = hasFlour ? Math.min(styleMin, flourMin!) : styleMin;
  const hi = hasFlour ? Math.max(styleMax, flourMax!) : styleMax;

  return (
    <svg viewBox="0 0 180 114" className="w-full max-w-xs mx-auto">
      <path d={arc(0, 100)} fill="none" stroke="#2a1e0e" strokeWidth="12" strokeLinecap="round" />

      {lo > 1   && <path d={arc(0, lo)}   fill="none" stroke="#7f1d1d" strokeWidth="12" strokeLinecap="round" opacity="0.5" />}
      {hi < 99  && <path d={arc(hi, 100)} fill="none" stroke="#7f1d1d" strokeWidth="12" strokeLinecap="round" opacity="0.5" />}

      {hasFlour && (
        <path d={arc(flourMin!, flourMax!)} fill="none" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" opacity="0.55" />
      )}

      <path d={arc(styleMin, styleMax)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" opacity="0.9" />

      <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4.5" fill={color} />

      <text x={cx} y={cy - 18} textAnchor="middle" fill="#f5e6c8"    fontSize="16" fontFamily="Rubik" fontWeight="600">{value}%</text>
      <text x={cx} y={cy -  5} textAnchor="middle" fill="#f5e6c880"  fontSize="9"  fontFamily="Rubik">{t.gauge.hydration}</text>

      <text x="14"  y="99" fill="#f5e6c840" fontSize="9" fontFamily="Rubik">0%</text>
      <text x="166" y="99" fill="#f5e6c840" fontSize="9" fontFamily="Rubik" textAnchor="end">100%</text>

      <text x={cx} y="107" textAnchor="middle" fill={color}    fontSize="9" fontFamily="Rubik" opacity="0.85">{t.gauge.styleRange(styleMin, styleMax)}</text>
      {hasFlour && (
        <text x={cx} y="114" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="Rubik" opacity="0.8">{t.gauge.flourRange(flourMin!, flourMax!)}</text>
      )}
    </svg>
  );
}
