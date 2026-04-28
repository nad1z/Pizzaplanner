export interface AppTranslation {
  dir: 'ltr' | 'rtl';
  nav: {
    calculator: string;
    flourGuide: string;
    recipe: string;
  };
  lang: {
    label: string;
    en: string;
    he: string;
  };
  calc: {
    title: string;
    subtitle: string;
    yourDough: string;
    recipe: string;
    labels: {
      pizzas: string;
      ballWeight: string;
      diameter: string;
      hydration: string;
      flour: string;
      water: string;
      fermentation: string;
      yeastType: string;
      totalDough: string;
      salt: string;
      oil: string;
    };
    perPizza: string;
    buttons: {
      apply: string;
      change: string;
      selectFlour: string;
      reset: string;
      switch: string;
      copyLink: string;
      copied: string;
    };
    flourSuggests: (name: string, hydration: number, fermentation: number) => string;
    hydrationLooksLike: (pct: number, style: string) => string;
    hydrationOutside: (pct: number, severity: string, style: string, min: number, max: number) => string;
    ballWeightOutside: (g: number, severity: string, style: string, min: number, max: number) => string;
    severity: { critically: string; slightly: string };
  };
  guide: {
    title: string;
    subtitle: string;
    recommended: string;
    recommendedFor: (style: string, hydration: number, fermentation: number) => string;
    allFlours: string;
    allFilter: string;
    sortedBy: (style: string) => string;
    apply: string;
  };
  card: {
    protein: string;
    strength: string;
    hydrationLabel: string;
    fermentLabel: string;
    hydrationRange: string;
    moreDetails: string;
    fermentation: string;
    notIdealFor: string;
    selected: string;
    select: string;
    apply: string;
    scoreFor: (style: string) => string;
    optimal: (val: number) => string;
    yours: (val: number) => string;
  };
  gauge: {
    hydration: string;
    styleRange: (min: number, max: number) => string;
    flourRange: (min: number, max: number) => string;
  };
  yeast: {
    idy: { name: string; description: string };
    ady: { name: string; description: string };
    sourdough: { name: string; description: string };
  };
  styles: {
    neapolitan:   { name: string; description: string };
    neonapolitan: { name: string; description: string };
    newyork:      { name: string; description: string };
    roman:        { name: string; description: string };
    brooklyn:     { name: string; description: string };
    detroit:      { name: string; description: string };
    sicilian:     { name: string; description: string };
    focaccia:     { name: string; description: string };
  };
  flourDescriptions: Record<string, string>;
  flourTypes: Record<string, string>;
  warnings: {
    fermentOverrun: string;
    hydrationTooHigh: string;
    detroitTooWeak: string;
  };
  fermentationTypes: {
    room_temp: string;
    short_cold: string;
    cold_ferment: string;
    long_cold: string;
  };
  flourTypeLabel: string;
  doughMethods: {
    straight: { name: string; description: string };
    poolish:  { name: string; description: string };
    biga:     { name: string; description: string };
    sourdough:{ name: string; description: string };
  };
  recipe: {
    title: string;
    noEatDate: string;
    eatDateLabel: string;
    eatDatePlaceholder: string;
    methodLabel: string;
    basicLabel: string;
    advancedLabel: string;
    fermentModeLabel: string;
    roomTempLabel: string;
    coldLabel: string;
    fermentTimeLabel: string;
    totalTimeLabel: (hours: number) => string;
    timelineTitle: string;
    checklistTitle: string;
    resetChecklist: string;
    beforeEat: (h: number, m: number) => string;
    absoluteTime: (dateStr: string) => string;
    stepDuration: (min: number) => string;
    parallel: string;
    tipLabel: string;
    tempLabel: string;
    allDone: string;
    viewRecipe: string;
  };
  share: {
    label: string;
    message: string;
    messages: string;
  };
  validation: {
    invalidNumber: string;
    belowMin: (min: number, unit: string) => string;
    aboveMax: (max: number, unit: string) => string;
  };
}
