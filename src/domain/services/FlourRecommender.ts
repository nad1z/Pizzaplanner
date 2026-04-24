import { FLOURS } from '../models/FlourType';
import type { FlourData } from '../models/FlourType';
import type { PizzaStyleId } from '../models/PizzaStyle';

export interface FlourWarning {
  message: string;
  level: 'yellow' | 'orange';
}

export interface FlourRecommendation {
  flour: FlourData;
  score: number;
}

const STYLE_DISPLAY_NAME: Record<PizzaStyleId, string> = {
  neapolitan:   'Neapolitan',
  neonapolitan: 'Neo Neapolitan',
  newyork:      'New York',
  roman:        'Roman',
  brooklyn:     'Brooklyn',
  detroit:      'Detroit',
  sicilian:     'Sicilian',
};

export function getFlourWarnings(
  flour: FlourData,
  hydrationPct: number,
  fermentationHours: number,
  styleId: PizzaStyleId,
): FlourWarning[] {
  const warnings: FlourWarning[] = [];

  if (fermentationHours > flour.fermentation_max) {
    warnings.push({ message: 'This flour may break down over long fermentation', level: 'yellow' });
  }
  if (hydrationPct > flour.hydration_max) {
    warnings.push({ message: 'Hydration may be too high for this flour', level: 'orange' });
  }
  if (styleId === 'detroit' && flour.w_value < 300) {
    warnings.push({ message: 'This flour may lack strength for Detroit-style pizza', level: 'yellow' });
  }

  return warnings;
}

export function getFlourRecommendations(
  styleId: PizzaStyleId,
  hydrationPct: number,
  fermentationHours: number,
  count = 3,
): FlourRecommendation[] {
  const styleName = STYLE_DISPLAY_NAME[styleId];

  const scored = FLOURS.map(flour => {
    const styleScore = (flour.style_scores[styleName] ?? 0) * 2;

    const hydDist = Math.abs(hydrationPct - flour.hydration_default);
    const hydScore = Math.max(0, 5 - hydDist / 5);

    let fermScore: number;
    if (fermentationHours >= flour.fermentation_min && fermentationHours <= flour.fermentation_max) {
      fermScore = 3;
    } else if (fermentationHours < flour.fermentation_min) {
      fermScore = Math.max(0, 3 - (flour.fermentation_min - fermentationHours) / 8);
    } else {
      fermScore = Math.max(0, 3 - (fermentationHours - flour.fermentation_max) / 8);
    }

    return { flour, score: styleScore + hydScore + fermScore };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, count);
}
