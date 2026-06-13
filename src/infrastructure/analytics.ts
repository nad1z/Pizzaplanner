declare function gtag(...args: unknown[]): void;

function track(name: string, params?: Record<string, string | number>) {
  if (typeof gtag === 'undefined') return;
  gtag('event', name, params);
}

export const Analytics = {
  styleSelected: (styleId: string, styleName: string) =>
    track('style_selected', { style_id: styleId, style_name: styleName }),

  recipeViewed: (styleId: string, numPizzas: number, hydrationPct: number, doughMethod: string) =>
    track('recipe_viewed', { style_id: styleId, num_pizzas: numPizzas, hydration_pct: hydrationPct, dough_method: doughMethod }),

  flourGuideOpened: () =>
    track('flour_guide_opened'),

  flourApplied: (flourName: string, hydrationPct: number, fermentationHours: number) =>
    track('flour_applied', { flour_name: flourName, hydration_pct: hydrationPct, fermentation_hours: fermentationHours }),

  shareClicked: (method: string) =>
    track('share', { method }),
};
