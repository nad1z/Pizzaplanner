import { validityLevel, RING_COLORS } from '../utils/validity';

interface HydrationGaugeProps {
  value: number;
  min: number;
  max: number;
}

export function HydrationGauge({ value, min, max }: HydrationGaugeProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min - 5), max + 5);
  const pct = (clamp(value) - (min - 5)) / ((max + 5) - (min - 5));
  const angle = -180 + pct * 180;
  const rad = angle * Math.PI / 180;
  const R = 70, cx = 90, cy = 90;
  const nx = cx + R * Math.cos(rad);
  const ny = cy + R * Math.sin(rad);
  const color = RING_COLORS[validityLevel(value, min, max)];

  const arcPath = (startDeg: number, endDeg: number) => {
    const s = startDeg * Math.PI / 180;
    const e = endDeg * Math.PI / 180;
    return `M ${cx + R * Math.cos(s)} ${cy + R * Math.sin(s)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(e)} ${cy + R * Math.sin(e)}`;
  };

  return (
    <svg viewBox="0 0 180 100" className="w-full max-w-xs mx-auto">
      <path d={arcPath(-180, 0)} fill="none" stroke="#3a2a18" strokeWidth="12" strokeLinecap="round" />
      <path d={arcPath(-180, angle)} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill={color} />
      <text x="18" y="96" fill="#f5e6c880" fontSize="10" fontFamily="DM Sans">{min}%</text>
      <text x="152" y="96" fill="#f5e6c880" fontSize="10" fontFamily="DM Sans">{max}%</text>
      <text x={cx} y={cy - 18} textAnchor="middle" fill="#f5e6c8" fontSize="16" fontFamily="Playfair Display" fontWeight="600">{value}%</text>
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#f5e6c880" fontSize="9" fontFamily="DM Sans">hydration</text>
    </svg>
  );
}
