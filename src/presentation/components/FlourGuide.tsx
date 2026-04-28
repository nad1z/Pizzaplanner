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
    <div className="guide">
      <div className="mb-8">
        <h1 className="serif guide__title">{t.guide.title}</h1>
        <p className="guide__subtitle">{t.guide.subtitle}</p>
      </div>

      <section className="guide__section">
        <h2 className="serif guide__section-title">{t.guide.recommended}</h2>
        <p className="guide__section-subtitle">
          {t.guide.recommendedFor(t.styles[calcStyleId].name, calcHydration, calcFermentation)}
        </p>
        <div className="flex flex-col gap-3">
          {recommendations.map(({ flour }) => {
            const isSelected = selectedFlour?.name === flour.name;
            return (
              <div
                key={flour.name}
                onClick={() => onSelectFlour(isSelected ? null : flour)}
                className={`recommendation${isSelected ? ' recommendation--selected' : ''}`}
              >
                <div className="recommendation__top">
                  <div>
                    <span className="recommendation__name">{flour.name}</span>
                    <span className="recommendation__meta">{flour.brand} · {t.flourTypeLabel} {t.flourTypes[flour.type] ?? flour.type}</span>
                  </div>
                  <div className="recommendation__actions">
                    <span className="recommendation__strength">{flour.strength_w}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleApply(flour); }}
                      className="recommendation__apply"
                    >
                      {t.guide.apply}
                    </button>
                  </div>
                </div>
                <p className="recommendation__description">{t.flourDescriptions[flour.name] ?? flour.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="guide__filters">
        <h2 className="serif guide__section-title guide__section-title--filters">{t.guide.allFlours}</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterStyle(null)} className={`filter-pill${!filterStyle ? ' filter-pill--active' : ''}`}>
            {t.guide.allFilter}
          </button>
          {(Object.keys(PizzaStyle.STYLES) as PizzaStyleId[]).map(id => (
            <button key={id} onClick={() => setFilterStyle(id)} className={`filter-pill${filterStyle === id ? ' filter-pill--active' : ''}`}>
              {t.styles[id].name}
            </button>
          ))}
        </div>
        {filterStyle && (
          <p className="guide__sorted-note">{t.guide.sortedBy(t.styles[filterStyle].name)}</p>
        )}
      </div>

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
