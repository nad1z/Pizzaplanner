import { useState, useMemo } from 'react';
import { FLOURS } from '../../domain/models/FlourType';
import type { FlourData } from '../../domain/models/FlourType';
import { PizzaStyle } from '../../domain/models/PizzaStyle';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';
import { StorageManager } from '../../infrastructure/StorageManager';
import { getFlourRecommendations } from '../../domain/services/FlourRecommender';
import { useTranslation } from '../../i18n';
import { FlourCard } from './FlourCard';

// English style names are the keys used in flour.style_scores
const STYLE_ID_TO_EN: Record<PizzaStyleId, string> = {
  neapolitan:   'Neapolitan',
  neonapolitan: 'Neo Neapolitan',
  newyork:      'New York',
  roman:        'Roman',
  brooklyn:     'Brooklyn',
  detroit:      'Detroit',
  sicilian:     'Sicilian',
  focaccia:     'Focaccia',
};

interface FlourGuideProps {
  selectedFlour: FlourData | null;
  onSelectFlour: (flour: FlourData | null) => void;
  onApplyFlour: (flour: FlourData, hydration: number, fermentation: number) => void;
}

export function FlourGuide({ selectedFlour, onSelectFlour, onApplyFlour }: FlourGuideProps) {
  const t = useTranslation();
  const [filterStyle, setFilterStyle] = useState<PizzaStyleId | null>(null);

  const saved = StorageManager.load();
  const calcStyleId: PizzaStyleId = saved?.styleId ?? 'neapolitan';
  const calcHydration = saved?.hydrationPct ?? 62;
  const calcFermentation = saved?.fermentationHours ?? 24;

  const sortedFlours = useMemo(() => {
    if (filterStyle) {
      const enName = STYLE_ID_TO_EN[filterStyle];
      return [...FLOURS].sort((a, b) =>
        (b.style_scores[enName] ?? 0) - (a.style_scores[enName] ?? 0),
      );
    }
    return [...FLOURS].sort((a, b) => b.w_value - a.w_value);
  }, [filterStyle]);

  const recommendations = useMemo(
    () => getFlourRecommendations(calcStyleId, calcHydration, calcFermentation, 3),
    [calcStyleId, calcHydration, calcFermentation],
  );

  const handleApply = (flour: FlourData) => {
    const fermentation = Math.round((flour.fermentation_min + flour.fermentation_max) / 2);
    onApplyFlour(flour, flour.hydration_default, fermentation);
  };

  return (
    <div style={{ color: '#f5e6c8', padding: '72px 16px 48px', maxWidth: 800, margin: '0 auto' }}>
      <div className="mb-8">
        <h1 className="serif" style={{ fontSize: 32, color: '#fafaf0', marginBottom: 4 }}>{t.guide.title}</h1>
        <p style={{ color: '#f5e6c870', fontSize: 14 }}>{t.guide.subtitle}</p>
      </div>

      {/* Recommendations */}
      <section style={{ marginBottom: 36 }}>
        <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 4 }}>{t.guide.recommended}</h2>
        <p style={{ fontSize: 12, color: '#f5e6c860', marginBottom: 14 }}>
          {t.guide.recommendedFor(t.styles[calcStyleId].name, calcHydration, calcFermentation)}
        </p>
        <div className="flex flex-col gap-3">
          {recommendations.map(({ flour }) => {
            const isSelected = selectedFlour?.name === flour.name;
            return (
              <div
                key={flour.name}
                onClick={() => onSelectFlour(isSelected ? null : flour)}
                style={{
                  background: isSelected ? '#2a1e0e' : '#21160a',
                  border: `1px solid ${isSelected ? '#c0522a' : '#3a2a18'}`,
                  borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#fafaf0' }}>{flour.name}</span>
                    <span style={{ color: '#f5e6c870', fontSize: 12, marginLeft: 8 }}>{flour.brand} · {t.flourTypeLabel} {t.flourTypes[flour.type] ?? flour.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, marginLeft: 12 }}>
                    <span style={{ fontSize: 11, background: '#c0522a22', color: '#c0522a', padding: '2px 8px', borderRadius: 999 }}>
                      {flour.strength_w}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); handleApply(flour); }}
                      style={{ fontSize: 12, color: '#c0522a', background: 'none', border: '1px solid #c0522a44', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}
                    >
                      {t.guide.apply}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#f5e6c870', marginTop: 4 }}>{t.flourDescriptions[flour.name] ?? flour.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Filter pills */}
      <div style={{ marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 20, color: '#fafaf0', marginBottom: 12 }}>{t.guide.allFlours}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStyle(null)} style={{
            padding: '6px 14px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
            background: !filterStyle ? '#c0522a' : '#2a1e0e',
            color:      !filterStyle ? '#fafaf0'  : '#f5e6c8aa',
            border: `1px solid ${!filterStyle ? '#c0522a' : '#3a2a18'}`,
          }}>{t.guide.allFilter}</button>
          {(Object.keys(PizzaStyle.STYLES) as PizzaStyleId[]).map(id => (
            <button key={id} onClick={() => setFilterStyle(id)} style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
              background: filterStyle === id ? '#c0522a' : '#2a1e0e',
              color:      filterStyle === id ? '#fafaf0'  : '#f5e6c8aa',
              border: `1px solid ${filterStyle === id ? '#c0522a' : '#3a2a18'}`,
            }}>{t.styles[id].name}</button>
          ))}
        </div>
        {filterStyle && (
          <p style={{ fontSize: 12, color: '#f5e6c860', marginTop: 8 }}>
            {t.guide.sortedBy(t.styles[filterStyle].name)}
          </p>
        )}
      </div>

      {/* Flour cards */}
      <div className="flex flex-col gap-4">
        {sortedFlours.map(flour => (
          <FlourCard
            key={flour.name}
            flour={flour}
            isSelected={selectedFlour?.name === flour.name}
            filterStyleId={filterStyle}
            currentHydration={calcHydration}
            onSelect={onSelectFlour}
            onApply={() => handleApply(flour)}
          />
        ))}
      </div>
    </div>
  );
}
