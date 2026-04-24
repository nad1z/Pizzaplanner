import { validityLevel, RING_COLORS } from '../utils/validity';

interface HydrationGaugeProps {
  value: number;
  styleMin: number;
  styleMax: number;
  flourMin?: number;
  flourMax?: number;
}

export function HydrationGauge({ value, styleMin, styleMax, flourMin, flourMax }: HydrationGaugeProps) {
  const R = 66, cx = 90, cy = 87;
  const hasFlour = flourMin !== undefined && flourMax !== undefined;

  // Map 0-100% hydration to arc angle: 0% = -180°, 100% = 0°
  const pctToRad = (pct: number) => (Math.max(0, Math.min(100, pct)) / 100 - 1) * Math.PI;

  const arc = (startPct: number, endPct: number): string => {
    if (endPct <= startPct) return '';
    const sa = pctToRad(startPct);
    const ea = pctToRad(endPct);
    const sx = cx + R * Math.cos(sa), sy = cy + R * Math.sin(sa);
    const ex = cx + R * Math.cos(ea), ey = cy + R * Math.sin(ea);
    const large = endPct - startPct > 50 ? 1 : 0;
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`;
  };

  // Needle
  const na = pctToRad(Math.max(0, Math.min(100, value)));
  const nx = cx + R * Math.cos(na), ny = cy + R * Math.sin(na);

  const color = RING_COLORS[validityLevel(value, styleMin, styleMax)];

  // Red zones: everything outside the union of both ranges
  const lo = hasFlour ? Math.min(styleMin, flourMin!) : styleMin;
  const hi = hasFlour ? Math.max(styleMax, flourMax!) : styleMax;

  return (
    <svg viewBox="0 0 180 114" className="w-full max-w-xs mx-auto">
      {/* Base arc: full 0–100% */}
      <path d={arc(0, 100)} fill="none" stroke="#2a1e0e" strokeWidth="12" strokeLinecap="round" />

      {/* "Bad" zones: outside all ranges */}
      {lo > 1   && <path d={arc(0, lo)}   fill="none" stroke="#7f1d1d" strokeWidth="12" strokeLinecap="round" opacity="0.5" />}
      {hi < 99  && <path d={arc(hi, 100)} fill="none" stroke="#7f1d1d" strokeWidth="12" strokeLinecap="round" opacity="0.5" />}

      {/* Flour range (teal, drawn first so style overlaps the intersection) */}
      {hasFlour && (
        <path d={arc(flourMin!, flourMax!)} fill="none" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" opacity="0.55" />
      )}

      {/* Style range */}
      <path d={arc(styleMin, styleMax)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" opacity="0.9" />

      {/* Needle */}
      <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4.5" fill={color} />

      {/* Current value */}
      <text x={cx} y={cy - 18} textAnchor="middle" fill="#f5e6c8"    fontSize="16" fontFamily="Playfair Display" fontWeight="600">{value}%</text>
      <text x={cx} y={cy -  5} textAnchor="middle" fill="#f5e6c880"  fontSize="9"  fontFamily="DM Sans">hydration</text>

      {/* Scale endpoints */}
      <text x="14"  y="99" fill="#f5e6c840" fontSize="9" fontFamily="DM Sans">0%</text>
      <text x="166" y="99" fill="#f5e6c840" fontSize="9" fontFamily="DM Sans" textAnchor="end">100%</text>

      {/* Legend */}
      <text x={cx} y="107" textAnchor="middle" fill={color}    fontSize="9" fontFamily="DM Sans" opacity="0.85">style {styleMin}–{styleMax}%</text>
      {hasFlour && (
        <text x={cx} y="114" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="DM Sans" opacity="0.8">flour {flourMin}–{flourMax}%</text>
      )}
    </svg>
  );
}
