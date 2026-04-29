import type { DoughMethodId, FermentationMode } from '../models/DoughMethod';
import type { YeastTypeId } from '../models/YeastType';
import type { PizzaStyleId } from '../models/PizzaStyle';
import type { RecipeI18n } from '../../i18n/types';

export interface RecipeStep {
  id: string;
  title: string;
  /** How many minutes before eating this step starts (positive = before) */
  startMinutesBeforeEat: number;
  durationMinutes: number;
  details: string[];
  tips: string[];
  temperature?: string;
}

export interface GeneratorInput {
  method: DoughMethodId;
  mode: FermentationMode;
  fermentationHours: number;
  flourG: number;
  waterG: number;
  saltG: number;
  oilG: number;
  yeastG: number;
  numPizzas: number;
  ballWeightG: number;
  pizzaDiameterCm: number;
  hydrationPct: number;
  yeastId: YeastTypeId;
  styleId: PizzaStyleId;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function g(value: number): string {
  if (value < 5) return value.toFixed(1);
  return Math.round(value).toString();
}

function cf(c: number): string {
  return `${c}°C / ${Math.round(c * 9 / 5 + 32)}°F`;
}

const BAKE_TEMPS: Record<PizzaStyleId, { temp: number; minMin: number; maxMin: number }> = {
  neapolitan:   { temp: 280, minMin: 5,  maxMin: 8  },
  neonapolitan: { temp: 280, minMin: 4,  maxMin: 7  },
  newyork:      { temp: 260, minMin: 10, maxMin: 13 },
  roman:        { temp: 250, minMin: 18, maxMin: 22 },
  brooklyn:     { temp: 265, minMin: 10, maxMin: 14 },
  detroit:      { temp: 240, minMin: 15, maxMin: 20 },
  sicilian:     { temp: 240, minMin: 18, maxMin: 22 },
  focaccia:     { temp: 220, minMin: 20, maxMin: 25 },
};

const PAN_STYLES: PizzaStyleId[] = ['roman', 'detroit', 'sicilian', 'focaccia'];

// ─── baking steps (shared) ───────────────────────────────────────────────────

function bakingSteps(input: GeneratorInput, i18n: RecipeI18n, startMinsBeforeEat = 30): RecipeStep[] {
  const { styleId, pizzaDiameterCm, numPizzas, oilG } = input;
  const bake = BAKE_TEMPS[styleId];
  const diamIn = Math.round(pizzaDiameterCm * 0.393701);
  const isPanStyle = PAN_STYLES.includes(styleId);
  const bakeTemp = cf(bake.temp);

  const stretchStep: RecipeStep = isPanStyle ? {
    id: 'stretch',
    title: i18n.t.stretchPan,
    startMinutesBeforeEat: startMinsBeforeEat,
    durationMinutes: 20,
    details: [
      i18n.panPress.d1(g(oilG), oilG > 0),
      i18n.panPress.d2,
      i18n.panNote[styleId] ?? i18n.panNoteFallback,
      i18n.panPress.d4(numPizzas),
    ],
    tips: [i18n.panPress.tip1, i18n.panPress.tip2],
  } : {
    id: 'stretch',
    title: i18n.t.stretchShape,
    startMinutesBeforeEat: startMinsBeforeEat,
    durationMinutes: 15,
    details: [
      i18n.handStretch.d1,
      i18n.handStretch.d2(pizzaDiameterCm, diamIn),
      i18n.handStretch.d3,
      i18n.handStretch.d4(oilG > 0 ? ` ${i18n.drizzleOil(g(oilG))}` : ''),
      i18n.handStretch.d5(numPizzas),
    ],
    tips: [i18n.handStretch.tip1, i18n.handStretch.tip2],
  };

  return [
    stretchStep,
    {
      id: 'bake',
      title: i18n.t.bake,
      startMinutesBeforeEat: startMinsBeforeEat - 15,
      durationMinutes: bake.maxMin,
      temperature: bakeTemp,
      details: [
        i18n.bakeStep.d1,
        i18n.bakeStep.d2(bakeTemp, bake.minMin, bake.maxMin),
        i18n.bakeNote[styleId] ?? '',
        i18n.bakeStep.d4,
      ].filter(Boolean),
      tips: [i18n.bakeStep.tip1, i18n.bakeStep.tip2],
    },
    {
      id: 'rest',
      title: i18n.t.restEat,
      startMinutesBeforeEat: 5,
      durationMinutes: 5,
      details: [i18n.restStep.d1, i18n.restStep.d2],
      tips: [i18n.restStep.tip1],
    },
  ];
}

// ─── straight / room-temp ────────────────────────────────────────────────────

export function generateStraightRoomTemp(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours: total, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const totalMin = total * 60;
  const bulkMin = totalMin - 180;
  const reservedWaterG = 50;
  const mainWaterG = waterG - reservedWaterG;
  const stretchFoldSets = bulkMin >= 120 ? 4 : bulkMin >= 60 ? 2 : 1;

  const yeastInstruction = yeastId === 'idy'
    ? i18n.idyInstruction(g(yeastG))
    : i18n.adyInstruction(g(yeastG), g(reservedWaterG), cf(37));

  const oilInfo = oilG > 0 ? `, ${g(oilG)}g` : '';

  return [
    {
      id: 'mise-en-place',
      title: i18n.t.miseEnPlace,
      startMinutesBeforeEat: totalMin,
      durationMinutes: 15,
      details: [
        i18n.str.mise.d1(g(flourG), g(waterG), g(saltG), g(yeastG), yeastId === 'idy' ? 'instant dry' : 'active dry', oilInfo),
        i18n.str.mise.d2(g(mainWaterG), cf(25), g(reservedWaterG)),
        i18n.str.mise.d3,
      ],
      tips: [i18n.str.mise.tip1],
    },
    {
      id: 'autolyse',
      title: i18n.t.autolyse,
      startMinutesBeforeEat: totalMin - 15,
      durationMinutes: 30,
      details: [
        i18n.str.autolyse.d1(g(mainWaterG), g(flourG)),
        i18n.str.autolyse.d2,
        i18n.str.autolyse.d3,
      ],
      tips: [i18n.str.autolyse.tip1],
    },
    {
      id: 'develop-gluten',
      title: i18n.t.developGluten,
      startMinutesBeforeEat: totalMin - 45,
      durationMinutes: 30,
      details: [
        i18n.str.gluten.d1(g(saltG), g(reservedWaterG)),
        yeastInstruction,
        i18n.str.gluten.d3,
        i18n.str.gluten.d4,
        i18n.str.gluten.d5,
        ...(oilG > 0 ? [i18n.str.gluten.d6(g(oilG))] : []),
      ],
      tips: [i18n.str.gluten.tip1],
    },
    {
      id: 'bulk',
      title: i18n.t.bulkRoom(Math.round(bulkMin / 60 * 10) / 10),
      startMinutesBeforeEat: totalMin - 75,
      durationMinutes: bulkMin,
      temperature: cf(24),
      details: [
        i18n.str.bulk.d1(cf(22), cf(24), Math.round(bulkMin / 60 * 10) / 10),
        i18n.str.bulk.d2(cf(24)),
        i18n.str.bulk.d3(stretchFoldSets, stretchFoldSets * 30),
        i18n.str.bulk.d4,
        i18n.str.bulk.d5,
        i18n.str.bulk.d6,
      ],
      tips: [i18n.str.bulk.tip1(cf(24)), i18n.str.bulk.tip2],
    },
    {
      id: 'ball',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        i18n.str.ball.d1,
        i18n.str.ball.d2(numPizzas, ballWeightG),
        i18n.str.ball.d3,
        i18n.str.ball.d4,
      ],
      tips: [i18n.str.ball.tip1],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        i18n.str.proof.d1(cf(22), cf(24)),
        i18n.str.proof.d2,
        i18n.str.proof.d3,
      ],
      tips: [i18n.str.proof.tip1],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [
        i18n.str.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp)),
        i18n.str.preheat.d2,
        i18n.str.preheat.d3,
      ],
      tips: [i18n.str.preheat.tip1],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── straight / cold ─────────────────────────────────────────────────────────

export function generateStraightCold(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const mainWaterG = waterG - reservedWaterG;
  const base = 300 + coldMin;

  const yeastInstruction = yeastId === 'idy'
    ? i18n.idyInstruction(g(yeastG))
    : i18n.adyInstruction(g(yeastG), g(reservedWaterG), cf(37));

  const oilInfo = oilG > 0 ? `, ${g(oilG)}g` : '';

  return [
    {
      id: 'mise-en-place',
      title: i18n.t.miseEnPlace,
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      details: [
        i18n.stc.mise.d1(g(flourG), g(waterG), g(saltG), g(yeastG), yeastId === 'idy' ? 'instant dry' : 'active dry', oilInfo),
        i18n.stc.mise.d2(cf(18), cf(20)),
        i18n.stc.mise.d3,
      ],
      tips: [i18n.stc.mise.tip1],
    },
    {
      id: 'autolyse',
      title: i18n.t.autolyse,
      startMinutesBeforeEat: base - 15,
      durationMinutes: 30,
      details: [
        i18n.stc.autolyse.d1(g(mainWaterG), g(flourG)),
        i18n.stc.autolyse.d2,
      ],
      tips: [],
    },
    {
      id: 'develop-gluten',
      title: i18n.t.developGluten,
      startMinutesBeforeEat: base - 45,
      durationMinutes: 30,
      details: [
        i18n.stc.gluten.d1(g(saltG), g(reservedWaterG)),
        yeastInstruction,
        i18n.stc.gluten.d3,
        i18n.stc.gluten.d4,
        ...(oilG > 0 ? [i18n.stc.gluten.d5(g(oilG))] : []),
      ],
      tips: [i18n.stc.gluten.tip1],
    },
    {
      id: 'short-bulk',
      title: i18n.t.shortBulk,
      startMinutesBeforeEat: base - 75,
      durationMinutes: 60,
      temperature: cf(22),
      details: [
        i18n.stc.shortBulk.d1(cf(20), cf(22)),
        i18n.stc.shortBulk.d2,
        i18n.stc.shortBulk.d3,
      ],
      tips: [i18n.stc.shortBulk.tip1],
    },
    {
      id: 'ball-cold',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 165 + coldMin,
      durationMinutes: 15,
      details: [
        i18n.stc.ball.d1(numPizzas, ballWeightG),
        i18n.stc.ball.d2,
        i18n.stc.ball.d3,
      ],
      tips: [i18n.stc.ball.tip1],
    },
    {
      id: 'cold-retard',
      title: i18n.t.coldRetard(fermentationHours),
      startMinutesBeforeEat: 150 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        i18n.stc.retard.d1(cf(4), cf(6), fermentationHours),
        i18n.stc.retard.d2,
        i18n.stc.retard.d3,
      ],
      tips: [i18n.stc.retard.tip1, i18n.stc.retard.tip2],
    },
    {
      id: 'warm-up',
      title: i18n.t.warmUp,
      startMinutesBeforeEat: 150,
      durationMinutes: 60,
      details: [
        i18n.stc.warmUp.d1,
        i18n.stc.warmUp.d2,
        i18n.stc.warmUp.d3,
      ],
      tips: [i18n.stc.warmUp.tip1],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        i18n.stc.proof.d1(cf(22), cf(24)),
        i18n.stc.proof.d2,
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 150,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [
        i18n.stc.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp)),
        i18n.stc.preheat.d2,
      ],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── poolish / room-temp ─────────────────────────────────────────────────────

export function generatePoolishRoomTemp(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const mainFermentMin = fermentationHours * 60;
  const poolishFlourG = Math.round(flourG * 0.5);
  const poolishWaterG = poolishFlourG;
  const mainFlourG = flourG - poolishFlourG;
  const mainWaterG = waterG - poolishWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentHours = 14;
  const poolishStart = 165 + mainFermentMin + preFermentHours * 60;

  return [
    {
      id: 'poolish-mix',
      title: i18n.t.poolishMix,
      startMinutesBeforeEat: poolishStart,
      durationMinutes: 15,
      temperature: '18–22°C / 64–72°F',
      details: [
        i18n.plr.poolishMix.d1(g(poolishFlourG), g(poolishWaterG), cf(20)),
        yeastId === 'idy' ? i18n.idyTrace : i18n.adyTrace,
        i18n.plr.poolishMix.d3,
        i18n.plr.poolishMix.d4,
        i18n.plr.poolishMix.d5,
      ],
      tips: [i18n.plr.poolishMix.tip1, i18n.plr.poolishMix.tip2],
    },
    {
      id: 'poolish-main-mix',
      title: i18n.t.poolishMainMix,
      startMinutesBeforeEat: 165 + mainFermentMin,
      durationMinutes: 60,
      details: [
        i18n.plr.mainMix.d1,
        i18n.plr.mainMix.d2(g(mainFlourG), g(mainWaterG - reservedWaterG), g(reservedWaterG)),
        i18n.plr.mainMix.d3(g(saltG), g(reservedWaterG)),
        yeastId === 'idy'
          ? i18n.plr.mainMix.d4idy(g(mainYeastG))
          : i18n.plr.mainMix.d4ady(g(mainYeastG), cf(37)),
        i18n.plr.mainMix.d5,
        ...(oilG > 0 ? [i18n.plr.mainMix.d6(g(oilG))] : []),
      ],
      tips: [i18n.plr.mainMix.tip1],
    },
    {
      id: 'room-temp-ferment',
      title: i18n.t.roomTempFerment(fermentationHours),
      startMinutesBeforeEat: 105 + mainFermentMin,
      durationMinutes: mainFermentMin,
      temperature: cf(24),
      details: [
        i18n.plr.ferment.d1(cf(22), cf(24), fermentationHours),
        i18n.plr.ferment.d2,
        i18n.plr.ferment.d3,
      ],
      tips: [],
    },
    {
      id: 'ball',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        i18n.plr.ball.d1(numPizzas, ballWeightG),
        i18n.plr.ball.d2,
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        i18n.plr.proof.d1(cf(22), cf(24)),
        i18n.plr.proof.d2,
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [i18n.plr.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp))],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── poolish / cold ──────────────────────────────────────────────────────────

export function generatePoolishCold(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const poolishFlourG = Math.round(flourG * 0.5);
  const poolishWaterG = poolishFlourG;
  const mainFlourG = flourG - poolishFlourG;
  const mainWaterG = waterG - poolishWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentMin = 14 * 60;
  const poolishStart = 285 + coldMin + preFermentMin;

  return [
    {
      id: 'poolish-mix',
      title: i18n.t.poolishMix,
      startMinutesBeforeEat: poolishStart,
      durationMinutes: 15,
      temperature: '18–22°C / 64–72°F',
      details: [
        i18n.plc.poolishMix.d1(g(poolishFlourG), g(poolishWaterG), cf(20)),
        yeastId === 'idy' ? i18n.idyTrace : i18n.adyTrace,
        i18n.plc.poolishMix.d3,
        i18n.plc.poolishMix.d4,
        i18n.plc.poolishMix.d5,
      ],
      tips: [i18n.plc.poolishMix.tip1, i18n.plc.poolishMix.tip2],
    },
    {
      id: 'poolish-main-mix',
      title: i18n.t.poolishMainMix,
      startMinutesBeforeEat: 285 + coldMin,
      durationMinutes: 60,
      details: [
        i18n.plc.mainMix.d1(g(mainFlourG), g(mainWaterG - reservedWaterG), g(reservedWaterG), cf(18)),
        i18n.plc.mainMix.d2,
        i18n.plc.mainMix.d3(g(saltG), g(reservedWaterG)),
        yeastId === 'idy'
          ? i18n.plc.mainMix.d4idy(g(mainYeastG))
          : i18n.plc.mainMix.d4ady(g(mainYeastG), g(reservedWaterG)),
        i18n.plc.mainMix.d5,
        ...(oilG > 0 ? [i18n.plc.mainMix.d6(g(oilG))] : []),
      ],
      tips: [i18n.plc.mainMix.tip1],
    },
    {
      id: 'cold-ferment',
      title: i18n.t.coldFerment(fermentationHours),
      startMinutesBeforeEat: 225 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        i18n.plc.coldFerment.d1(cf(4), cf(6), fermentationHours),
        i18n.plc.coldFerment.d2,
        i18n.plc.coldFerment.d3,
      ],
      tips: [i18n.plc.coldFerment.tip1],
    },
    {
      id: 'warm-up',
      title: i18n.t.warmUp2h,
      startMinutesBeforeEat: 225,
      durationMinutes: 120,
      details: [
        i18n.plc.warmUp.d1,
        i18n.plc.warmUp.d2,
      ],
      tips: [i18n.plc.warmUp.tip1],
    },
    {
      id: 'ball',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        i18n.plc.ball.d1(numPizzas, ballWeightG),
        i18n.plc.ball.d2,
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        i18n.plc.proof.d1(cf(22), cf(24)),
        i18n.plc.proof.d2,
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [i18n.plc.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp))],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── biga / room-temp ────────────────────────────────────────────────────────

export function generateBigaRoomTemp(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const mainFermentMin = fermentationHours * 60;
  const bigaFlourG = Math.round(flourG * 0.4);
  const bigaWaterG = Math.round(bigaFlourG * 0.45);
  const mainFlourG = flourG - bigaFlourG;
  const mainWaterG = waterG - bigaWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentMin = 18 * 60;
  const bigaStart = 180 + mainFermentMin + preFermentMin;

  return [
    {
      id: 'biga-mix',
      title: i18n.t.bigaMix,
      startMinutesBeforeEat: bigaStart,
      durationMinutes: 20,
      temperature: '16–18°C / 61–64°F',
      details: [
        i18n.bgr.bigaMix.d1(g(bigaFlourG), g(bigaWaterG), cf(16), cf(18)),
        i18n.bgr.bigaMix.d2,
        i18n.bgr.bigaMix.d3,
        i18n.bgr.bigaMix.d4,
        i18n.bgr.bigaMix.d5,
      ],
      tips: [i18n.bgr.bigaMix.tip1, i18n.bgr.bigaMix.tip2],
    },
    {
      id: 'biga-main-mix',
      title: i18n.t.bigaMainMix,
      startMinutesBeforeEat: 180 + mainFermentMin,
      durationMinutes: 75,
      details: [
        i18n.bgr.mainMix.d1,
        i18n.bgr.mainMix.d2(g(mainWaterG - reservedWaterG), g(reservedWaterG)),
        i18n.bgr.mainMix.d3(g(mainFlourG)),
        i18n.bgr.mainMix.d4(g(saltG), g(reservedWaterG)),
        yeastId === 'idy'
          ? i18n.bgr.mainMix.d5idy(g(mainYeastG))
          : i18n.bgr.mainMix.d5ady(g(mainYeastG)),
        i18n.bgr.mainMix.d6,
        ...(oilG > 0 ? [i18n.bgr.mainMix.d7(g(oilG))] : []),
      ],
      tips: [i18n.bgr.mainMix.tip1],
    },
    {
      id: 'room-temp-ferment',
      title: i18n.t.roomTempFerment(fermentationHours),
      startMinutesBeforeEat: 105 + mainFermentMin,
      durationMinutes: mainFermentMin,
      temperature: cf(24),
      details: [
        i18n.bgr.ferment.d1(cf(22), cf(24), fermentationHours),
        i18n.bgr.ferment.d2,
        i18n.bgr.ferment.d3,
      ],
      tips: [],
    },
    {
      id: 'ball',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [i18n.bgr.ball.d1(numPizzas, ballWeightG)],
      tips: [],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [i18n.bgr.proof.d1(cf(22), cf(24))],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [i18n.bgr.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp))],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── biga / cold ─────────────────────────────────────────────────────────────

export function generateBigaCold(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const bigaFlourG = Math.round(flourG * 0.4);
  const bigaWaterG = Math.round(bigaFlourG * 0.45);
  const mainWaterG = waterG - bigaWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentMin = 18 * 60;
  const bigaStart = 300 + coldMin + preFermentMin;

  return [
    {
      id: 'biga-mix',
      title: i18n.t.bigaMix,
      startMinutesBeforeEat: bigaStart,
      durationMinutes: 20,
      temperature: '16–18°C / 61–64°F',
      details: [
        i18n.bgc.bigaMix.d1(g(bigaFlourG), g(bigaWaterG), cf(16)),
        i18n.bgc.bigaMix.d2,
        i18n.bgc.bigaMix.d3,
      ],
      tips: [i18n.bgc.bigaMix.tip1],
    },
    {
      id: 'biga-main-mix',
      title: i18n.t.bigaMainMix,
      startMinutesBeforeEat: 300 + coldMin,
      durationMinutes: 75,
      details: [
        i18n.bgc.mainMix.d1(g(mainWaterG - reservedWaterG), g(reservedWaterG), cf(18)),
        i18n.bgc.mainMix.d2(g(saltG), g(reservedWaterG)),
        yeastId === 'idy'
          ? i18n.bgc.mainMix.d3idy(g(mainYeastG))
          : i18n.bgc.mainMix.d3ady(g(mainYeastG), g(reservedWaterG)),
        i18n.bgc.mainMix.d4,
        ...(oilG > 0 ? [i18n.bgc.mainMix.d5(g(oilG))] : []),
      ],
      tips: [i18n.bgc.mainMix.tip1],
    },
    {
      id: 'cold-ferment',
      title: i18n.t.coldFerment(fermentationHours),
      startMinutesBeforeEat: 225 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        i18n.bgc.coldFerment.d1(cf(4), cf(6), fermentationHours),
        i18n.bgc.coldFerment.d2,
      ],
      tips: [i18n.bgc.coldFerment.tip1],
    },
    {
      id: 'warm-up',
      title: i18n.t.warmUp2h,
      startMinutesBeforeEat: 225,
      durationMinutes: 120,
      details: [i18n.bgc.warmUp.d1],
      tips: [],
    },
    {
      id: 'ball',
      title: i18n.t.ballDiv(numPizzas, ballWeightG),
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [i18n.bgc.ball.d1(numPizzas, ballWeightG)],
      tips: [],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [i18n.bgc.proof.d1(cf(22), cf(24))],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [i18n.bgc.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp))],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── sourdough / room-temp ───────────────────────────────────────────────────

export function generateSourdoughRoomTemp(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG: starterG, oilG, numPizzas, ballWeightG } = input;
  const bulkMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const base = 825 + bulkMin;

  return [
    {
      id: 'feed-starter',
      title: i18n.t.feedStarter,
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      temperature: '24–28°C / 75–82°F',
      details: [
        i18n.sdr.feedStarter.d1(g(Math.round(starterG * 0.2)), g(Math.round(starterG * 0.4)), g(Math.round(starterG * 0.4)), cf(26)),
        i18n.sdr.feedStarter.d2,
        i18n.sdr.feedStarter.d3(cf(24), cf(28)),
        i18n.sdr.feedStarter.d4(g(starterG)),
      ],
      tips: [i18n.sdr.feedStarter.tip1, i18n.sdr.feedStarter.tip2],
    },
    {
      id: 'autolyse',
      title: i18n.t.autolyse,
      startMinutesBeforeEat: 210 + bulkMin,
      durationMinutes: 30,
      details: [
        i18n.sdr.autolyse.d1(g(flourG), g(waterG - reservedWaterG), cf(28)),
        i18n.sdr.autolyse.d2,
      ],
      tips: [i18n.sdr.autolyse.tip1],
    },
    {
      id: 'add-starter-salt',
      title: i18n.t.addStarterSalt,
      startMinutesBeforeEat: 180 + bulkMin,
      durationMinutes: 30,
      details: [
        i18n.sdr.addStarterSalt.d1(g(starterG)),
        i18n.sdr.addStarterSalt.d2,
        i18n.sdr.addStarterSalt.d3,
        i18n.sdr.addStarterSalt.d4(g(saltG), g(reservedWaterG)),
        ...(oilG > 0 ? [i18n.sdr.addStarterSalt.d5(g(oilG))] : []),
      ],
      tips: [i18n.sdr.addStarterSalt.tip1],
    },
    {
      id: 'bulk',
      title: i18n.t.bulkSourdough(fermentationHours),
      startMinutesBeforeEat: 150 + bulkMin,
      durationMinutes: bulkMin,
      temperature: cf(25),
      details: [
        i18n.sdr.bulk.d1(cf(24), cf(26), fermentationHours),
        i18n.sdr.bulk.d2,
        i18n.sdr.bulk.d3,
        i18n.sdr.bulk.d4,
      ],
      tips: [i18n.sdr.bulk.tip1, i18n.sdr.bulk.tip2],
    },
    {
      id: 'pre-shape',
      title: i18n.t.preShape,
      startMinutesBeforeEat: 150,
      durationMinutes: 45,
      details: [
        i18n.sdr.preShape.d1(numPizzas, ballWeightG),
        i18n.sdr.preShape.d2,
        i18n.sdr.preShape.d3,
      ],
      tips: [i18n.sdr.preShape.tip1],
    },
    {
      id: 'shape',
      title: i18n.t.finalShape,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [i18n.sdr.finalShape.d1, i18n.sdr.finalShape.d2],
      tips: [],
    },
    {
      id: 'proof',
      title: i18n.t.proofFinal,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        i18n.sdr.proof.d1(cf(22), cf(24)),
        i18n.sdr.proof.d2,
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: i18n.t.preheat,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [i18n.sdr.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp))],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── sourdough / cold ────────────────────────────────────────────────────────

export function generateSourdoughCold(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG: starterG, oilG, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const base = 1095 + coldMin;

  return [
    {
      id: 'feed-starter',
      title: i18n.t.feedStarter,
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      temperature: '24–28°C / 75–82°F',
      details: [
        i18n.sdc.feedStarter.d1(g(Math.round(starterG * 0.2)), g(Math.round(starterG * 0.4)), g(Math.round(starterG * 0.4)), cf(26)),
        i18n.sdc.feedStarter.d2(cf(24), cf(28)),
        i18n.sdc.feedStarter.d3(g(starterG)),
      ],
      tips: [i18n.sdc.feedStarter.tip1],
    },
    {
      id: 'autolyse',
      title: i18n.t.autolyse,
      startMinutesBeforeEat: 480 + coldMin,
      durationMinutes: 30,
      details: [
        i18n.sdc.autolyse.d1(g(flourG), g(waterG - reservedWaterG), cf(28)),
        i18n.sdc.autolyse.d2,
      ],
      tips: [],
    },
    {
      id: 'add-starter-salt',
      title: i18n.t.addStarterSalt,
      startMinutesBeforeEat: 450 + coldMin,
      durationMinutes: 30,
      details: [
        i18n.sdc.addStarterSalt.d1(g(starterG)),
        i18n.sdc.addStarterSalt.d2(g(saltG), g(reservedWaterG)),
        ...(oilG > 0 ? [i18n.sdc.addStarterSalt.d3(g(oilG))] : []),
      ],
      tips: [],
    },
    {
      id: 'bulk',
      title: i18n.t.bulkSourdoughPartial,
      startMinutesBeforeEat: 420 + coldMin,
      durationMinutes: 270,
      temperature: cf(25),
      details: [
        i18n.sdc.bulk.d1(cf(24), cf(26)),
        i18n.sdc.bulk.d2,
        i18n.sdc.bulk.d3,
      ],
      tips: [i18n.sdc.bulk.tip1],
    },
    {
      id: 'pre-shape',
      title: i18n.t.preShape,
      startMinutesBeforeEat: 150 + coldMin,
      durationMinutes: 30,
      details: [i18n.sdc.preShape.d1(numPizzas, ballWeightG)],
      tips: [],
    },
    {
      id: 'shape-cold-proof',
      title: i18n.t.shapeColdProof(fermentationHours),
      startMinutesBeforeEat: 90 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(4),
      details: [
        i18n.sdc.shapeColdProof.d1,
        i18n.sdc.shapeColdProof.d2(cf(3), cf(5), fermentationHours),
        i18n.sdc.shapeColdProof.d3,
        i18n.sdc.shapeColdProof.d4,
      ],
      tips: [i18n.sdc.shapeColdProof.tip1, i18n.sdc.shapeColdProof.tip2],
    },
    {
      id: 'preheat',
      title: i18n.t.preheatRemove,
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_TEMPS[input.styleId].temp),
      details: [
        i18n.sdc.preheat.d1(cf(BAKE_TEMPS[input.styleId].temp)),
        i18n.sdc.preheat.d2,
      ],
      tips: [],
    },
    ...bakingSteps(input, i18n),
  ];
}

// ─── main export ──────────────────────────────────────────────────────────────

export class RecipeStepsGenerator {
  static generate(input: GeneratorInput, i18n: RecipeI18n): RecipeStep[] {
    const { method, mode } = input;
    if (method === 'straight') return mode === 'cold' ? generateStraightCold(input, i18n) : generateStraightRoomTemp(input, i18n);
    if (method === 'poolish')  return mode === 'cold' ? generatePoolishCold(input, i18n)  : generatePoolishRoomTemp(input, i18n);
    if (method === 'biga')     return mode === 'cold' ? generateBigaCold(input, i18n)     : generateBigaRoomTemp(input, i18n);
    return mode === 'cold' ? generateSourdoughCold(input, i18n) : generateSourdoughRoomTemp(input, i18n);
  }

  /** Stable key for sessionStorage — changes when any recipe parameter changes */
  static checklistKey(input: Pick<GeneratorInput, 'method' | 'mode' | 'fermentationHours'>): string {
    return `pizza-checklist-v1-${input.method}-${input.mode}-${input.fermentationHours}`;
  }
}
