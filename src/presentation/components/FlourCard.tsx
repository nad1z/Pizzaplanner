import { useState } from 'react';
import type { FlourData } from '../../domain/models/FlourType';
import { HydrationBar } from './HydrationBar';

const SCORE_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));

interface FlourCardProps {
  flour: FlourData;
  isSelected: boolean;
  filterStyle: string | null;
  currentHydration?: number;
  onSelect: (flour: FlourData | null) => void;
  onApply: () => void;
}

export function FlourCard({ flour, isSelected, filterStyle, currentHydration, onSelect, onApply }: FlourCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: '#21160a',
      border: `1px solid ${isSelected ? '#c0522a' : '#3a2a18'}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ padding: '16px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 17, fontFamily: 'Playfair Display', color: '#fafaf0', marginBottom: 2 }}>{flour.name}</h3>
            <span style={{ fontSize: 12, color: '#f5e6c870' }}>{flour.brand} · Type {flour.type}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
            <button onClick={() => onSelect(isSelected ? null : flour)} style={{
              fontSize: 12, borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 500,
              color: isSelected ? '#c0522a' : '#f5e6c8aa',
              background: isSelected ? '#c0522a11' : 'none',
              border: `1px solid ${isSelected ? '#c0522a' : '#3a2a1866'}`,
            }}>
              {isSelected ? '✓ Selected' : 'Select'}
            </button>
            <button onClick={onApply} style={{
              fontSize: 12, color: '#c0522a', background: '#c0522a11',
              border: '1px solid #c0522a44', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
            }}>
              Apply
            </button>
          </div>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
          {([
            ['Protein',   flour.protein],
            ['Strength',  flour.strength_w],
            ['Hydration', flour.hydration],
            ['Ferment',   flour.fermentation_hours + 'h'],
          ] as [string, string][]).map(([label, val]) => (
            <div key={label} style={{ background: '#2a1e0e', borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ fontSize: 9, color: '#f5e6c870', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 12, color: '#f5e6c8', fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>

        <HydrationBar
          min={flour.hydration_min}
          max={flour.hydration_max}
          defaultVal={flour.hydration_default}
          current={currentHydration}
        />

        {/* Style badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 12 }}>
          {flour.recommended_styles.map(s => (
            <span key={s} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 999, background: '#c0522a22', color: '#c0522a', border: '1px solid #c0522a44' }}>{s}</span>
          ))}
          {flour.secondary_styles.map(s => (
            <span key={s} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 999, background: '#3a2a18', color: '#f5e6c870', border: '1px solid #3a2a18' }}>{s}</span>
          ))}
        </div>

        {/* Style score when filtered */}
        {filterStyle && flour.style_scores[filterStyle] !== undefined && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#c0522a' }}>
            {SCORE_STARS(flour.style_scores[filterStyle])} for {filterStyle}
          </div>
        )}
      </div>

      {/* Expandable details toggle */}
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', padding: '9px 20px', background: '#1e1308',
        border: 'none', borderTop: '1px solid #3a2a1855',
        cursor: 'pointer', color: '#f5e6c860', fontSize: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>More details</span>
        <span style={{ fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ padding: '16px 20px', background: '#1a1209', borderTop: '1px solid #3a2a1833' }}>
          <p style={{ fontSize: 13, color: '#f5e6c8cc', marginBottom: 14, lineHeight: 1.6 }}>{flour.description}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, color: '#f5e6c870', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Fermentation</div>
              <p style={{ fontSize: 13, color: '#f5e6c8', marginBottom: 4 }}>{flour.fermentation_hours}h</p>
              <p style={{ fontSize: 11, color: '#f5e6c870' }}>
                {flour.fermentation_type.map(t => t.replace(/_/g, ' ')).join(', ')}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 10, color: '#f5e6c870', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Not Ideal For</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {flour.not_ideal_for.map(s => (
                  <span key={s} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#3a1a0a', color: '#f58668aa', border: '1px solid #5a2a1844' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
