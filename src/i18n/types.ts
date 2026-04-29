export interface RecipeI18n {
  // ── shared helpers ───────────────────────────────────────────────────────────
  idyInstruction:  (yeastG: string) => string;
  adyInstruction:  (yeastG: string, waterG: string, temp: string) => string;
  idyTrace:        string;
  adyTrace:        string;
  drizzleOil:      (oilG: string) => string;
  bakeNote:        Record<string, string>;
  panNote:         Record<string, string>;
  panNoteFallback: string;

  // ── step titles ──────────────────────────────────────────────────────────────
  t: {
    miseEnPlace:         string;
    autolyse:            string;
    developGluten:       string;
    bulkRoom:            (hours: number) => string;
    ballDiv:             (n: number, g: number) => string;
    proofFinal:          string;
    preheat:             string;
    preheatRemove:       string;
    stretchPan:          string;
    stretchShape:        string;
    bake:                string;
    restEat:             string;
    shortBulk:           string;
    coldRetard:          (hours: number) => string;
    coldFerment:         (hours: number) => string;
    warmUp:              string;
    warmUp2h:            string;
    poolishMix:          string;
    poolishMainMix:      string;
    bigaMix:             string;
    bigaMainMix:         string;
    roomTempFerment:     (hours: number) => string;
    feedStarter:         string;
    addStarterSalt:      string;
    bulkSourdough:       (hours: number) => string;
    bulkSourdoughPartial: string;
    preShape:            string;
    finalShape:          string;
    shapeColdProof:      (hours: number) => string;
  };

  // ── common baking steps (shared across all methods) ──────────────────────────
  panPress: {
    d1:   (oilG: string, hasOil: boolean) => string;
    d2:   string;
    d4:   (n: number) => string;
    tip1: string;
    tip2: string;
  };
  handStretch: {
    d1:   string;
    d2:   (diamCm: number, diamIn: number) => string;
    d3:   string;
    d4:   (drizzle: string) => string;
    d5:   (n: number) => string;
    tip1: string;
    tip2: string;
  };
  bakeStep: {
    d1:   string;
    d2:   (temp: string, minMin: number, maxMin: number) => string;
    d4:   string;
    tip1: string;
    tip2: string;
  };
  restStep: {
    d1:   string;
    d2:   string;
    tip1: string;
  };

  // ── straight / room-temp ─────────────────────────────────────────────────────
  str: {
    mise: {
      d1:   (flour: string, water: string, salt: string, yeast: string, yeastType: string, oilInfo: string) => string;
      d2:   (mainWater: string, temp: string, reserved: string) => string;
      d3:   string;
      tip1: string;
    };
    autolyse: {
      d1:   (mainWater: string, flour: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    gluten: {
      d1:   (salt: string, water: string) => string;
      d3:   string;
      d4:   string;
      d5:   string;
      d6:   (oil: string) => string;
      tip1: string;
    };
    bulk: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   (targetTemp: string) => string;
      d3:   (sets: number, totalMin: number) => string;
      d4:   string;
      d5:   string;
      d6:   string;
      tip1: (temp: string) => string;
      tip2: string;
    };
    ball: {
      d1:   string;
      d2:   (n: number, grams: number) => string;
      d3:   string;
      d4:   string;
      tip1: string;
    };
    proof: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    preheat: {
      d1:   (temp: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
  };

  // ── straight / cold ──────────────────────────────────────────────────────────
  stc: {
    mise: {
      d1:   (flour: string, water: string, salt: string, yeast: string, yeastType: string, oilInfo: string) => string;
      d2:   (minTemp: string, maxTemp: string) => string;
      d3:   string;
      tip1: string;
    };
    autolyse: {
      d1:   (mainWater: string, flour: string) => string;
      d2:   string;
    };
    gluten: {
      d1:   (salt: string, water: string) => string;
      d3:   string;
      d4:   string;
      d5:   (oil: string) => string;
      tip1: string;
    };
    shortBulk: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    ball: {
      d1:   (n: number, grams: number) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    retard: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      d3:   string;
      tip1: string;
      tip2: string;
    };
    warmUp: {
      d1:   string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    proof: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
    };
    preheat: {
      d1:   (temp: string) => string;
      d2:   string;
    };
  };

  // ── poolish / room-temp ──────────────────────────────────────────────────────
  plr: {
    poolishMix: {
      d1:   (flour: string, water: string, temp: string) => string;
      d3:   string;
      d4:   string;
      d5:   string;
      tip1: string;
      tip2: string;
    };
    mainMix: {
      d1:   string;
      d2:   (mainFlour: string, mainWater: string, reserved: string) => string;
      d3:   (salt: string, water: string) => string;
      d4idy: (yeast: string) => string;
      d4ady: (yeast: string, temp: string) => string;
      d5:   string;
      d6:   (oil: string) => string;
      tip1: string;
    };
    ferment: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      d3:   string;
    };
    ball: {
      d1:   (n: number, grams: number) => string;
      d2:   string;
    };
    proof: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
    };
    preheat: { d1: (temp: string) => string };
  };

  // ── poolish / cold ───────────────────────────────────────────────────────────
  plc: {
    poolishMix: {
      d1:   (flour: string, water: string, temp: string) => string;
      d3:   string;
      d4:   string;
      d5:   string;
      tip1: string;
      tip2: string;
    };
    mainMix: {
      d1:   (mainFlour: string, mainWater: string, reserved: string, temp: string) => string;
      d2:   string;
      d3:   (salt: string, water: string) => string;
      d4idy: (yeast: string) => string;
      d4ady: (yeast: string, water: string) => string;
      d5:   string;
      d6:   (oil: string) => string;
      tip1: string;
    };
    coldFerment: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    warmUp: {
      d1:   string;
      d2:   string;
      tip1: string;
    };
    ball: {
      d1:   (n: number, grams: number) => string;
      d2:   string;
    };
    proof: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
    };
    preheat: { d1: (temp: string) => string };
  };

  // ── biga / room-temp ─────────────────────────────────────────────────────────
  bgr: {
    bigaMix: {
      d1:   (flour: string, water: string, temp1: string, temp2: string) => string;
      d2:   string;
      d3:   string;
      d4:   string;
      d5:   string;
      tip1: string;
      tip2: string;
    };
    mainMix: {
      d1:   string;
      d2:   (mainWater: string, reserved: string) => string;
      d3:   (mainFlour: string) => string;
      d4:   (salt: string, water: string) => string;
      d5idy: (yeast: string) => string;
      d5ady: (yeast: string) => string;
      d6:   string;
      d7:   (oil: string) => string;
      tip1: string;
    };
    ferment: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      d3:   string;
    };
    ball:   { d1: (n: number, grams: number) => string };
    proof:  { d1: (minTemp: string, maxTemp: string) => string };
    preheat:{ d1: (temp: string) => string };
  };

  // ── biga / cold ──────────────────────────────────────────────────────────────
  bgc: {
    bigaMix: {
      d1:   (flour: string, water: string, temp: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    mainMix: {
      d1:   (mainWater: string, reserved: string, temp: string) => string;
      d2:   (salt: string, water: string) => string;
      d3idy: (yeast: string) => string;
      d3ady: (yeast: string, water: string) => string;
      d4:   string;
      d5:   (oil: string) => string;
      tip1: string;
    };
    coldFerment: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      tip1: string;
    };
    warmUp:  { d1: string };
    ball:    { d1: (n: number, grams: number) => string };
    proof:   { d1: (minTemp: string, maxTemp: string) => string };
    preheat: { d1: (temp: string) => string };
  };

  // ── sourdough / room-temp ────────────────────────────────────────────────────
  sdr: {
    feedStarter: {
      d1:   (existing: string, flour: string, water: string, temp: string) => string;
      d2:   string;
      d3:   (minTemp: string, maxTemp: string) => string;
      d4:   (starterG: string) => string;
      tip1: string;
      tip2: string;
    };
    autolyse: {
      d1:   (flour: string, water: string, temp: string) => string;
      d2:   string;
      tip1: string;
    };
    addStarterSalt: {
      d1:   (starterG: string) => string;
      d2:   string;
      d3:   string;
      d4:   (salt: string, water: string) => string;
      d5:   (oil: string) => string;
      tip1: string;
    };
    bulk: {
      d1:   (minTemp: string, maxTemp: string, hours: number) => string;
      d2:   string;
      d3:   string;
      d4:   string;
      tip1: string;
      tip2: string;
    };
    preShape: {
      d1:   (n: number, grams: number) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    finalShape: {
      d1:   string;
      d2:   string;
    };
    proof: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
    };
    preheat: { d1: (temp: string) => string };
  };

  // ── sourdough / cold ─────────────────────────────────────────────────────────
  sdc: {
    feedStarter: {
      d1:   (existing: string, flour: string, water: string, temp: string) => string;
      d2:   (minTemp: string, maxTemp: string) => string;
      d3:   (starterG: string) => string;
      tip1: string;
    };
    autolyse: {
      d1:   (flour: string, water: string, temp: string) => string;
      d2:   string;
    };
    addStarterSalt: {
      d1:   (starterG: string) => string;
      d2:   (salt: string, water: string) => string;
      d3:   (oil: string) => string;
    };
    bulk: {
      d1:   (minTemp: string, maxTemp: string) => string;
      d2:   string;
      d3:   string;
      tip1: string;
    };
    preShape: { d1: (n: number, grams: number) => string };
    shapeColdProof: {
      d1:   string;
      d2:   (minTemp: string, maxTemp: string, hours: number) => string;
      d3:   string;
      d4:   string;
      tip1: string;
      tip2: string;
    };
    preheat: {
      d1:   (temp: string) => string;
      d2:   string;
    };
  };
}

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
    totalHoursShort: (h: number) => string;
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
    eatingAt: string;
    startBy: string;
    progressDone: (done: number, total: number) => string;
    yeastLabel: string;
    starterLabel: string;
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
  recipeSteps: RecipeI18n;
}
