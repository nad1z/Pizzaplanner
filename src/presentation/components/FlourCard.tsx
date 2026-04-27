import { useState } from 'react';
import type { FlourData } from '../../domain/models/FlourType';
import type { PizzaStyleId } from '../../domain/models/PizzaStyle';
import { useTranslation } from '../../i18n';
import { HydrationBar } from './HydrationBar';

const SCORE_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));

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

const EN_TO_STYLE_ID: Record<string, PizzaStyleId> = {
  'Neapolitan':     'neapolitan',
  'Neo Neapolitan': 'neonapolitan',
  'New York':       'newyork',
  'Roman':          'roman',
  'Brooklyn':       'brooklyn',
  'Detroit':        'detroit',
  'Sicilian':       'sicilian',
  'Focaccia':       'focaccia',
};

interface FlourCardProps {
  flour: FlourData;
  isSelected: boolean;
  filterStyleId: PizzaStyleId | null;
  currentHydration?: number;
  onSelect: (flour: FlourData | null) => void;
  onApply: () => void;
}

export function FlourCard({ flour, isSelected, filterStyleId, currentHydration, onSelect, onApply }: FlourCardProps) {
  const t = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const filterStyleEnName = filterStyleId ? STYLE_ID_TO_EN[filterStyleId] : null;
  const filterScore = filterStyleEnName !== null ? flour.style_scores[filterStyleEnName] : undefined;

  return (
    <div className={`flour-card${isSelected ? ' flour-card--selected' : ''}`}>
      <div className="flour-card__body">
        <div className="flour-card__header">
          <div>
            <h3 className="flour-card__name">{flour.name}</h3>
            <span className="flour-card__meta">{flour.brand} · {t.flourTypeLabel} {t.flourTypes[flour.type] ?? flour.type}</span>
          </div>
          <div className="flour-card__actions">
            <button
              onClick={() => onSelect(isSelected ? null : flour)}
              className={`flour-card__select${isSelected ? ' flour-card__select--selected' : ''}`}
            >
              {isSelected ? t.card.selected : t.card.select}
            </button>
            <button onClick={onApply} className="flour-card__apply">
              {t.card.apply}
            </button>
          </div>
        </div>

        <div className="flour-card__stats">
          {([
            [t.card.protein,       flour.protein],
            [t.card.strength,      flour.strength_w],
            [t.card.hydrationLabel,flour.hydration],
            [t.card.fermentLabel,  flour.fermentation_hours + 'h'],
          ] as [string, string][]).map(([label, val]) => (
            <div key={label} className="flour-stat">
              <div className="flour-stat__label">{label}</div>
              <div className="flour-stat__value">{val}</div>
            </div>
          ))}
        </div>

        <HydrationBar
          min={flour.hydration_min}
          max={flour.hydration_max}
          defaultVal={flour.hydration_default}
          current={currentHydration}
        />

        <div className="flour-card__styles">
          {flour.recommended_styles.map(s => {
            const id = EN_TO_STYLE_ID[s];
            return (
              <span key={s} className="style-badge">
                {id ? t.styles[id].name : s}
              </span>
            );
          })}
          {flour.secondary_styles.map(s => {
            const id = EN_TO_STYLE_ID[s];
            return (
              <span key={s} className="style-badge style-badge--secondary">
                {id ? t.styles[id].name : s}
              </span>
            );
          })}
        </div>

        {filterStyleId && filterScore !== undefined && (
          <div className="flour-card__score">
            {SCORE_STARS(filterScore)} {t.card.scoreFor(t.styles[filterStyleId].name)}
          </div>
        )}
      </div>

      <button onClick={() => setExpanded(!expanded)} className="flour-card__toggle">
        <span>{t.card.moreDetails}</span>
        <span className="flour-card__toggle-icon">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="flour-card__details">
          <p className="flour-card__description">
            {t.flourDescriptions[flour.name] ?? flour.description}
          </p>
          <div className="flour-card__details-grid">
            <div>
              <div className="flour-card__detail-label">{t.card.fermentation}</div>
              <p className="flour-card__detail-value">{flour.fermentation_hours}h</p>
              <p className="flour-card__detail-sub">
                {flour.fermentation_type.map(ft => t.fermentationTypes[ft as keyof typeof t.fermentationTypes] ?? ft.replace(/_/g, ' ')).join(', ')}
              </p>
            </div>
            <div>
              <div className="flour-card__detail-label">{t.card.notIdealFor}</div>
              <div className="flour-card__unsuitable-list">
                {flour.not_ideal_for.map(s => {
                  const id = EN_TO_STYLE_ID[s];
                  return (
                    <span key={s} className="flour-card__unsuitable-item">
                      {id ? t.styles[id].name : s}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
