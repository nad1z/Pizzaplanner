import type { DoughMethodId, FermentationMode } from '../models/DoughMethod';
import type { YeastTypeId } from '../models/YeastType';
import type { PizzaStyleId } from '../models/PizzaStyle';

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

function yeastAddInstruction(yeastId: YeastTypeId, yeastG: number, reservedWaterG: number): string {
  if (yeastId === 'idy') {
    return `Sprinkle ${g(yeastG)}g instant dry yeast directly over the dough — no pre-activation needed.`;
  }
  return `Dissolve ${g(yeastG)}g active dry yeast in ${g(reservedWaterG)}g warm water (${cf(37)}) and wait 10 minutes until foamy before adding to the dough.`;
}

function traceYeastNote(yeastId: YeastTypeId): string {
  if (yeastId === 'idy') return '0.1g instant dry yeast (about a pinch — use a precision scale)';
  return '0.1g active dry yeast (about a pinch — dissolve in the pre-ferment water before adding)';
}

const BAKE_GUIDE: Record<PizzaStyleId, { temp: number; minMin: number; maxMin: number; notes: string }> = {
  neapolitan:   { temp: 280, minMin: 5,  maxMin: 8,  notes: 'Use the highest setting your oven allows. If you have a broiler, switch it on for the last minute to char the crust.' },
  neonapolitan: { temp: 280, minMin: 4,  maxMin: 7,  notes: 'High heat is essential for an open, airy cornicione. Place the stone or steel in the upper third of the oven.' },
  newyork:      { temp: 260, minMin: 10, maxMin: 13, notes: 'Rotate the pizza halfway through for even browning. The underside should be golden and slightly crisp.' },
  roman:        { temp: 250, minMin: 18, maxMin: 22, notes: 'Bake in an oiled pan (teglia). The bottom should be crispy and golden; the top evenly browned.' },
  brooklyn:     { temp: 265, minMin: 10, maxMin: 14, notes: 'The crust should be crisp and well-charred at the rim. A baking steel gives the best result for this style.' },
  detroit:      { temp: 240, minMin: 15, maxMin: 20, notes: 'Bake in a well-oiled square pan. The cheese should caramelise and char at the edges — that is the defining feature.' },
  sicilian:     { temp: 240, minMin: 18, maxMin: 22, notes: 'Bake in a well-oiled rectangular pan. The bottom should be crispy and deeply golden; the top soft with golden cheese.' },
  focaccia:     { temp: 220, minMin: 20, maxMin: 25, notes: 'The surface should be golden and slightly blistered. The bottom must be crispy — if not, return to the oven for 3–5 more minutes.' },
};

const PAN_STYLES: PizzaStyleId[] = ['roman', 'detroit', 'sicilian', 'focaccia'];

function bakingSteps(input: GeneratorInput, startMinsBeforeEat = 30): RecipeStep[] {
  const { styleId, pizzaDiameterCm, numPizzas, oilG } = input;
  const bake = BAKE_GUIDE[styleId];
  const diamIn = Math.round(pizzaDiameterCm * 0.393701);
  const isPanStyle = PAN_STYLES.includes(styleId);

  const panStyleNote: Record<string, string> = {
    detroit:  'Push the dough firmly into all four corners of a well-oiled rectangular blue steel pan. Lay cheese (ideally brick cheese or a blend) all the way to the edges so it fries and caramelises against the pan sides. Add sauce in stripes on top of the cheese — Detroit style adds sauce last.',
    roman:    'Press the dough evenly across the oiled teglia (rectangular pan) to about 1–1.5 cm thickness. Dimple the surface with your fingertips. Add sauce thinly — Roman pizza al taglio is relatively lightly topped.',
    sicilian: 'Press the dough evenly into the oiled rectangular pan to about 1.5 cm thickness. Let it rest 15 minutes if it springs back. Add sauce and toppings generously.',
    focaccia: 'Press dough to the pan edges. Drizzle generously with olive oil and use all your fingertips to press deep dimples across the entire surface. Let rest 20 minutes before adding toppings (rosemary, coarse salt, olives). No sauce needed.',
  };

  const stretchStep: RecipeStep = isPanStyle ? {
    id: 'stretch',
    title: 'Press into pan & top',
    startMinutesBeforeEat: startMinsBeforeEat,
    durationMinutes: 20,
    details: [
      `Coat your baking pan generously with olive oil — use ${oilG > 0 ? `${g(oilG)}g` : 'a generous amount'} and cover the base and sides completely.`,
      `Place a dough ball in the centre of the pan and begin pressing outward from the middle with flat fingertips. Do not stretch by pulling — press and dimple.`,
      panStyleNote[styleId] ?? `Press the dough evenly across the pan to an even thickness. If it resists, cover and rest 10 minutes, then try again — the gluten will relax.`,
      `Repeat for each of the ${numPizzas} pan${numPizzas > 1 ? 's' : ''}.`,
    ],
    tips: [
      'Pan dough should be soft and extensible. If it keeps springing back, it needs more rest — cover and wait 10 minutes.',
      'More oil in the pan = crispier bottom. Do not skimp.',
    ],
  } : {
    id: 'stretch',
    title: 'Stretch, shape & top',
    startMinutesBeforeEat: startMinsBeforeEat,
    durationMinutes: 15,
    details: [
      `Lightly flour your work surface. Take one dough ball and press from the centre outward with your fingertips, leaving a 2 cm / 1" rim untouched — this becomes the cornicione.`,
      `Lift the dough and let gravity stretch it gently, rotating it as you go, until it reaches approximately ${pizzaDiameterCm} cm / ${diamIn}" in diameter.`,
      `Transfer to a lightly floured peel or a sheet of parchment. Work quickly — wet toppings make the dough stick to the peel.`,
      `Add sauce and toppings sparingly. Less is more: overloaded pizza steams rather than bakes.${oilG > 0 ? ` Drizzle ${g(oilG)}g olive oil over the dough and toppings.` : ''}`,
      `Repeat for each of the ${numPizzas} pizza${numPizzas > 1 ? 's' : ''}.`,
    ],
    tips: [
      'Never use a rolling pin — it degasses the dough and destroys the cornicione.',
      'If the dough springs back and resists stretching, cover it and let it rest 5 minutes before trying again.',
    ],
  };

  const steps: RecipeStep[] = [
    stretchStep,
    {
      id: 'bake',
      title: 'Bake',
      startMinutesBeforeEat: startMinsBeforeEat - 15,
      durationMinutes: bake.maxMin,
      temperature: cf(bake.temp),
      details: [
        `Slide the pizza onto the preheated steel or stone using a quick, confident forward-and-back motion.`,
        `Bake at ${cf(bake.temp)} for ${bake.minMin}–${bake.maxMin} minutes.`,
        bake.notes,
        'Look for: golden-to-charred spotted crust edges, bubbling and slightly browning cheese, a firm base that slides freely on the steel.',
      ],
      tips: [
        'Open the oven as little as possible during baking to maintain temperature.',
        'A quick peek at 2 minutes helps you learn your oven — every home oven is different.',
      ],
    },
    {
      id: 'rest',
      title: 'Rest & eat',
      startMinutesBeforeEat: 5,
      durationMinutes: 5,
      details: [
        'Remove the pizza from the oven and let it rest on a wire rack or cutting board for 3–5 minutes before slicing.',
        'Resting allows steam to escape from the crust and the cheese to set — slicing too early makes it soggy.',
      ],
      tips: ['A pizza wheel gives cleaner slices; a sharp chef\'s knife works too.'],
    },
  ];
  return steps;
}

// ─── straight dough ───────────────────────────────────────────────────────────

export function generateStraightRoomTemp(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours: total, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const totalMin = total * 60;
  const bulkMin = totalMin - 180; // fixed overhead = 180 min (prep 75 + ball 15 + proof 60 + stretch+bake 30)
  const reservedWaterG = 50;
  const mainWaterG = waterG - reservedWaterG;
  const stretchFoldSets = bulkMin >= 120 ? 4 : bulkMin >= 60 ? 2 : 1;

  const steps: RecipeStep[] = [
    {
      id: 'mise-en-place',
      title: 'Mise en place',
      startMinutesBeforeEat: totalMin,
      durationMinutes: 15,
      details: [
        `Weigh all ingredients precisely: ${g(flourG)}g flour, ${g(waterG)}g water, ${g(saltG)}g salt, ${g(yeastG)}g ${yeastId === 'idy' ? 'instant dry' : 'active dry'} yeast${oilG > 0 ? `, ${g(oilG)}g olive oil` : ''}.`,
        `Heat ${g(mainWaterG)}g of the water to ${cf(25)} — slightly warm, not hot. Set aside ${g(reservedWaterG)}g in a small bowl for dissolving the salt (and activating ADY if needed).`,
        'Prepare a large mixing bowl, a bench scraper, a dough container (lightly oiled), and a kitchen thermometer if you have one.',
      ],
      tips: [
        'Water temperature is the easiest way to control final dough temperature. For a 24°C dough in a 22°C kitchen, aim for 26–27°C water.',
      ],
    },
    {
      id: 'autolyse',
      title: 'Mix flour & water — autolyse',
      startMinutesBeforeEat: totalMin - 15,
      durationMinutes: 30,
      details: [
        `Pour ${g(mainWaterG)}g water into the mixing bowl, then add all ${g(flourG)}g flour.`,
        'Mix until no dry flour remains — it will look shaggy and rough. Do not over-mix at this stage.',
        'Cover tightly with plastic wrap or a damp cloth and rest for 30 minutes. This is the autolyse: the flour hydrates and gluten begins forming on its own.',
      ],
      tips: [
        'Autolyse reduces the kneading time needed and improves dough extensibility.',
      ],
    },
    {
      id: 'develop-gluten',
      title: 'Add salt & yeast — develop gluten',
      startMinutesBeforeEat: totalMin - 45,
      durationMinutes: 30,
      details: [
        `Dissolve ${g(saltG)}g salt in the reserved ${g(reservedWaterG)}g water.`,
        yeastAddInstruction(yeastId, yeastG, reservedWaterG),
        'Add both to the dough and incorporate by pinching and folding until fully absorbed — about 3–5 minutes.',
        `Develop the gluten using the slap-and-fold technique or by performing 6–8 stretch-and-fold sets in the bowl over the next 20–25 minutes, with 3-minute rests between sets.`,
        'The dough is ready when it is smooth, slightly tacky (not sticky), and passes the windowpane test: stretch a small piece thin enough to see light through without it tearing.',
        oilG > 0 ? `Add ${g(oilG)}g olive oil and fold it in after the gluten is developed — adding oil too early inhibits gluten formation.` : '',
      ].filter(Boolean) as string[],
      tips: [
        'Wet hands prevent sticking without adding extra flour — keep a bowl of water nearby.',
      ],
    },
    {
      id: 'bulk',
      title: `Bulk fermentation — ${Math.round(bulkMin / 60 * 10) / 10}h at room temperature`,
      startMinutesBeforeEat: totalMin - 75,
      durationMinutes: bulkMin,
      temperature: cf(24),
      details: [
        `Place the dough in a lightly oiled container, cover, and ferment at room temperature (${cf(22)}–${cf(24)}) for ${Math.round(bulkMin / 60 * 10) / 10} hours.`,
        `Target dough temperature: ${cf(24)}. Check with a thermometer — warmer dough ferments faster.`,
        `Perform ${stretchFoldSets} sets of stretch-and-folds, one every 30 minutes, during the first ${stretchFoldSets * 30} minutes of bulk:`,
        'Each set: with wet hands, grab one side of the dough, stretch it up as far as it goes without tearing, and fold it over the centre. Rotate the bowl 90° and repeat — 4 folds per set.',
        'After the last set, leave the dough completely undisturbed for the remainder of bulk fermentation.',
        'Dough is ready when it has grown 50–75% in volume, the surface is slightly domed with visible bubbles, and it feels airy and jiggly when the container is gently shaken.',
      ],
      tips: [
        `If your kitchen is warmer than ${cf(24)}, bulk will finish faster — check at 75% of the stated time.`,
        'Mark the side of the container with a rubber band to track the rise accurately.',
      ],
    },
    {
      id: 'ball',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        `Gently turn the dough onto a clean, unfloured surface — a little sticking helps build surface tension.`,
        `Using a bench scraper and scale, divide into ${numPizzas} equal portions of ${ballWeightG}g each. Be gentle — avoid degassing the dough.`,
        'Shape each portion into a tight ball: cup your hand over the piece and drag it toward you on the surface, using friction to build tension. Pinch the seam shut at the bottom.',
        'Place balls seam-side down, spaced apart, in lightly oiled containers or on a floured tray covered with plastic wrap.',
      ],
      tips: ['If the dough tears during shaping, cover and rest 5 minutes — relaxed gluten shapes more easily.'],
    },
    {
      id: 'proof',
      title: 'Final proof',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        `Cover the dough balls and proof at room temperature (${cf(22)}–${cf(24)}) for 60 minutes.`,
        'Poke test: press one finger 1 cm into a ball — if it springs back slowly and only halfway, the dough is perfectly proofed. If it snaps back immediately, give it more time. If it doesn\'t spring back at all, it is slightly over-proofed — proceed quickly.',
        `Preheat your oven at the same time as the proof begins (see next step).`,
      ],
      tips: ['Proofed balls should look visibly puffy and feel light and airy when you lift the container.'],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [
        `Place your baking steel, stone, or oven-safe pan in the oven and preheat to the maximum temperature — at least ${cf(BAKE_GUIDE[input.styleId].temp)}.`,
        'Allow at least 45–60 minutes at full temperature for the thermal mass to fully saturate — a short preheat produces a pale, soft-bottomed pizza.',
        'Position: upper third of the oven for Neapolitan/Neo-Neapolitan; middle for New York, Brooklyn, and other styles; lower third for pan pizzas (Roman, Detroit, Sicilian, Focaccia).',
      ],
      tips: ['An oven thermometer is worth buying — most home ovens run 20–30°C cooler than their dial indicates.'],
    },
    ...bakingSteps(input),
  ];
  return steps;
}

export function generateStraightCold(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const mainWaterG = waterG - reservedWaterG;
  // Offsets: mise-en-place starts at (300 + coldMin) before eat
  const base = 300 + coldMin;

  const steps: RecipeStep[] = [
    {
      id: 'mise-en-place',
      title: 'Mise en place',
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      details: [
        `Weigh all ingredients: ${g(flourG)}g flour, ${g(waterG)}g water, ${g(saltG)}g salt, ${g(yeastG)}g ${yeastId === 'idy' ? 'instant dry' : 'active dry'} yeast${oilG > 0 ? `, ${g(oilG)}g olive oil` : ''}.`,
        `Use cold water (${cf(18)}–${cf(20)}) for the dough — cold dough ferments slowly and evenly in the fridge without over-proofing.`,
        'Prepare a large mixing bowl, bench scraper, and a dough container with a lid.',
      ],
      tips: ['Cold water is essential here — it prevents the dough from over-fermenting before it reaches the fridge.'],
    },
    {
      id: 'autolyse',
      title: 'Mix flour & water — autolyse',
      startMinutesBeforeEat: base - 15,
      durationMinutes: 30,
      details: [
        `Combine ${g(mainWaterG)}g cold water with ${g(flourG)}g flour. Mix until no dry flour remains.`,
        'Cover and rest 30 minutes — the autolyse develops gluten passively.',
      ],
      tips: [],
    },
    {
      id: 'develop-gluten',
      title: 'Add salt & yeast — develop gluten',
      startMinutesBeforeEat: base - 45,
      durationMinutes: 30,
      details: [
        `Dissolve ${g(saltG)}g salt in the reserved ${g(reservedWaterG)}g cold water.`,
        yeastAddInstruction(yeastId, yeastG, reservedWaterG),
        'Add to the dough and fold to incorporate. Then perform 6 stretch-and-fold sets over 25 minutes.',
        'The dough should be smooth and pass the windowpane test before going into the fridge.',
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil after gluten is developed.` : '',
      ].filter(Boolean) as string[],
      tips: ['Well-developed gluten before cold fermentation means the dough can hold gas produced during the slow fridge rise.'],
    },
    {
      id: 'short-bulk',
      title: 'Short room-temperature bulk — 1 hour',
      startMinutesBeforeEat: base - 75,
      durationMinutes: 60,
      temperature: cf(22),
      details: [
        `Place the dough in a lightly oiled container and ferment at room temperature (${cf(20)}–${cf(22)}) for 1 hour.`,
        'Perform 2 sets of stretch-and-folds, 30 minutes apart, to build structure before the cold retard.',
        'The dough does not need to grow significantly at this stage — 10–20% increase is enough.',
      ],
      tips: ['This short room-temp period kick-starts fermentation and builds gluten strength before the fridge slows everything down.'],
    },
    {
      id: 'ball-cold',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 165 + coldMin,
      durationMinutes: 15,
      details: [
        `Divide the dough into ${numPizzas} portions of ${ballWeightG}g each.`,
        'Shape each into a tight ball and place into individual lightly oiled containers with lids.',
        'Label with the time if needed — this helps you track the cold retard.',
      ],
      tips: ['Individual containers prevent the balls from sticking together and make it easy to take out one at a time.'],
    },
    {
      id: 'cold-retard',
      title: `Cold retard — ${fermentationHours}h in the fridge`,
      startMinutesBeforeEat: 150 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        `Seal the containers and refrigerate at ${cf(4)}–${cf(6)} for ${fermentationHours} hours.`,
        'The cold temperature slows fermentation dramatically, developing flavour compounds and gluten strength without risk of over-proofing.',
        'The dough will rise slowly — that is expected. Sealed tightly, the balls will keep in the fridge for up to 72 hours.',
      ],
      tips: [
        'Do not place the dough near the back of the fridge where it may partially freeze.',
        'The dough is ready when it has risen visibly (30–50%) and feels slightly puffy.',
      ],
    },
    {
      id: 'warm-up',
      title: 'Remove from fridge — warm up',
      startMinutesBeforeEat: 150,
      durationMinutes: 60,
      details: [
        'Take the dough balls out of the fridge and leave them covered at room temperature for 60 minutes.',
        `Cold dough is stiff and inextensible — warming it up ensures the gluten relaxes and the dough stretches easily without tearing.`,
        'Start preheating your oven at the same time (see next step).',
      ],
      tips: ['In a cold kitchen (under 20°C), allow 90 minutes for the dough to warm through properly.'],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        `After the warm-up, let the balls continue proofing at room temperature (${cf(22)}–${cf(24)}) for 1 hour.`,
        'Use the poke test to confirm readiness: a finger pressed 1 cm deep should spring back slowly and halfway.',
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 150,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [
        `Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for at least 60 minutes.`,
        'Start preheating at the same time as the warm-up phase so everything is ready together.',
      ],
      tips: [],
    },
    ...bakingSteps(input),
  ];
  return steps;
}

// ─── poolish ──────────────────────────────────────────────────────────────────

export function generatePoolishRoomTemp(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const mainFermentMin = fermentationHours * 60;
  const poolishFlourG = Math.round(flourG * 0.5);
  const poolishWaterG = poolishFlourG; // 100% hydration
  const mainFlourG = flourG - poolishFlourG;
  const mainWaterG = waterG - poolishWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentHours = 14;
  // Poolish starts: (165 + mainFermentMin + preFermentHours*60) before eat
  const poolishStart = 165 + mainFermentMin + preFermentHours * 60;

  return [
    {
      id: 'poolish-mix',
      title: 'Make the poolish pre-ferment',
      startMinutesBeforeEat: poolishStart,
      durationMinutes: 15,
      temperature: '18–22°C / 64–72°F',
      details: [
        `In a medium bowl, combine ${g(poolishFlourG)}g flour with ${g(poolishWaterG)}g water at room temperature (${cf(20)}).`,
        `Add ${traceYeastNote(yeastId)} — this tiny amount is intentional; the poolish ferments slowly and develops flavour over many hours.`,
        'Mix until completely smooth — no lumps. The poolish should have a thick, pourable batter consistency.',
        'Cover tightly with plastic wrap and ferment at room temperature between 18–22°C / 64–72°F for 12–16 hours (target 14 hours).',
        'Ready when: the surface is domed and covered in bubbles, and the poolish is just beginning to fall in the centre (do not let it fully collapse — that means it has over-fermented).',
      ],
      tips: [
        `Cooler temperature (18°C) = slower ferment, more complex flavour. Warmer (22°C) = faster, less complex. A wine cooler or cool room is ideal.`,
        'You can reduce the yeast to make the poolish mature more slowly — useful for 16+ hour ferments.',
      ],
    },
    {
      id: 'poolish-main-mix',
      title: 'Mix the main dough',
      startMinutesBeforeEat: 165 + mainFermentMin,
      durationMinutes: 60,
      details: [
        `Add all the mature poolish to a large mixing bowl.`,
        `Add ${g(mainFlourG)}g flour and ${g(mainWaterG - reservedWaterG)}g water. Mix until no dry flour remains, then rest 30 minutes (autolyse with the poolish).`,
        `Dissolve ${g(saltG)}g salt in the reserved ${g(reservedWaterG)}g water.`,
        yeastId === 'idy'
          ? `Sprinkle ${g(mainYeastG)}g instant dry yeast over the dough, then pour in the salt water and incorporate by folding.`
          : `Dissolve ${g(mainYeastG)}g active dry yeast in the reserved warm (${cf(37)}) salt water, wait 10 minutes, then add to the dough.`,
        'The poolish adds extensibility, so the dough will come together faster than straight dough. Develop with 4–6 stretch-and-fold sets over 30 minutes.',
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil after gluten is developed.` : '',
      ].filter(Boolean) as string[],
      tips: ['The poolish makes the dough noticeably more extensible and easier to stretch than straight dough.'],
    },
    {
      id: 'room-temp-ferment',
      title: `Room-temperature fermentation — ${fermentationHours}h`,
      startMinutesBeforeEat: 105 + mainFermentMin,
      durationMinutes: mainFermentMin,
      temperature: cf(24),
      details: [
        `Cover the dough and ferment at room temperature (${cf(22)}–${cf(24)}) for ${fermentationHours} hours.`,
        'Perform 3–4 stretch-and-fold sets, every 30 minutes, for the first 1.5–2 hours. Let the dough rest undisturbed after that.',
        'Dough is ready when it has grown 50–75%, feels airy and jiggly, and has a light, yeasty aroma.',
      ],
      tips: [],
    },
    {
      id: 'ball',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        `Gently turn the dough onto an unfloured surface. Divide into ${numPizzas} portions of ${ballWeightG}g each.`,
        'Shape each into a tight ball using the drag-and-seal technique. Place seam-side down in lightly oiled containers.',
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        `Proof at room temperature (${cf(22)}–${cf(24)}) for 60 minutes.`,
        'Poke test: dough should spring back slowly and halfway when poked 1 cm deep.',
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [
        `Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for 60 minutes.`,
      ],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

export function generatePoolishCold(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const poolishFlourG = Math.round(flourG * 0.5);
  const poolishWaterG = poolishFlourG;
  const mainFlourG = flourG - poolishFlourG;
  const mainWaterG = waterG - poolishWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentMin = 14 * 60;
  // poolish starts: (285 + coldMin + preFermentMin) before eat
  const poolishStart = 285 + coldMin + preFermentMin;

  return [
    {
      id: 'poolish-mix',
      title: 'Make the poolish pre-ferment',
      startMinutesBeforeEat: poolishStart,
      durationMinutes: 15,
      temperature: '18–22°C / 64–72°F',
      details: [
        `In a medium bowl, combine ${g(poolishFlourG)}g flour with ${g(poolishWaterG)}g water at room temperature (${cf(20)}).`,
        `Add ${traceYeastNote(yeastId)}.`,
        'Mix until completely smooth. Cover tightly with plastic wrap.',
        'Ferment at 18–22°C / 64–72°F for 12–16 hours (target 14 hours).',
        'Ready when: domed, bubbly, and just starting to fall in the centre.',
      ],
      tips: [
        '18°C is the sweet spot for a 14-hour poolish. In summer, use cold water to slow it down.',
        'A poolish that has fully collapsed is over-fermented — the flavour will be sharp and sour.',
      ],
    },
    {
      id: 'poolish-main-mix',
      title: 'Mix the main dough',
      startMinutesBeforeEat: 285 + coldMin,
      durationMinutes: 60,
      details: [
        `Combine the mature poolish with ${g(mainFlourG)}g flour and ${g(mainWaterG - reservedWaterG)}g cold water (${cf(18)}).`,
        'Mix until combined, then rest 30 minutes (autolyse).',
        `Dissolve ${g(saltG)}g salt in ${g(reservedWaterG)}g cold water.`,
        yeastId === 'idy'
          ? `Sprinkle ${g(mainYeastG)}g IDY over the dough, add the salt water, and fold to incorporate.`
          : `Dissolve ${g(mainYeastG)}g ADY in reserved warm water, wait 10 minutes, then add with the salt water.`,
        'Develop with 4–6 stretch-and-fold sets over 30 minutes.',
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil last.` : '',
      ].filter(Boolean) as string[],
      tips: ['Use cold water for the main dough — the pre-ferment is warm enough; the main dough needs to start cool before going into the fridge.'],
    },
    {
      id: 'cold-ferment',
      title: `Cold fermentation — ${fermentationHours}h in the fridge`,
      startMinutesBeforeEat: 225 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        `Transfer the dough (whole, not yet divided) to a covered container and refrigerate at ${cf(4)}–${cf(6)} for ${fermentationHours} hours.`,
        'The cold environment slows fermentation and allows flavour to develop slowly and deeply.',
        'The dough will rise 25–50% over this period — this is normal.',
      ],
      tips: [
        'You can extend the cold ferment by up to 12 hours if your schedule changes — the poolish and cold work together to prevent over-proofing.',
      ],
    },
    {
      id: 'warm-up',
      title: 'Remove from fridge — warm up',
      startMinutesBeforeEat: 225,
      durationMinutes: 120,
      details: [
        'Remove the dough from the fridge and leave covered at room temperature for 2 hours.',
        'The dough must warm through before it can be divided, balled, and proofed — cold dough will tear and resist shaping.',
      ],
      tips: ['In a cold kitchen, extend warm-up to 2.5 hours.'],
    },
    {
      id: 'ball',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        `Divide the warmed dough into ${numPizzas} portions of ${ballWeightG}g each on an unfloured surface.`,
        'Shape each into a tight ball. Place seam-side down in lightly oiled covered containers.',
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        `Proof at room temperature (${cf(22)}–${cf(24)}) for 60 minutes.`,
        'Use the poke test to confirm readiness.',
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [`Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for 60 minutes.`],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

// ─── biga ─────────────────────────────────────────────────────────────────────

export function generateBigaRoomTemp(input: GeneratorInput): RecipeStep[] {
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
      title: 'Make the biga pre-ferment',
      startMinutesBeforeEat: bigaStart,
      durationMinutes: 20,
      temperature: '16–18°C / 61–64°F',
      details: [
        `In a bowl, combine ${g(bigaFlourG)}g flour, ${g(bigaWaterG)}g cold water (${cf(16)}–${cf(18)}), and ${traceYeastNote(yeastId)}.`,
        'Mix until just combined — the biga should be rough, shaggy, and crumbly. Do NOT over-mix or smooth it out; that would over-develop the gluten before fermentation.',
        `Cover loosely (not airtight — the biga needs to breathe) and ferment at 16–18°C / 61–64°F for 16–24 hours (target 18 hours).`,
        'A wine cooler or a cool basement at this temperature is ideal. At room temperature (22°C+), reduce to 12–14 hours to prevent over-fermentation.',
        'Ready when: the biga has roughly doubled, shows a porous, honeycomb-like interior when broken apart, and smells pleasantly nutty and slightly tangy — not sour or alcoholic.',
      ],
      tips: [
        `Temperature control is critical for biga. Too warm = excessive acid development, gummy crumb. Too cold = under-fermented, dense dough.`,
        'An over-fermented biga smells strongly alcoholic or very sour — discard and start again.',
      ],
    },
    {
      id: 'biga-main-mix',
      title: 'Break down biga & mix main dough',
      startMinutesBeforeEat: 180 + mainFermentMin,
      durationMinutes: 75,
      details: [
        `Tear the mature biga into rough chunks and place in a large mixing bowl.`,
        `Add ${g(mainWaterG - reservedWaterG)}g water (room temperature) and begin breaking down the biga with your hands or a dough hook — it will resist at first. Continue until mostly dissolved.`,
        `Add ${g(mainFlourG)}g flour in 2–3 additions, incorporating between each.`,
        `Dissolve ${g(saltG)}g salt in ${g(reservedWaterG)}g water.`,
        yeastId === 'idy'
          ? `Add ${g(mainYeastG)}g IDY to the dough, then pour in the salt water and fold to incorporate.`
          : `Dissolve ${g(mainYeastG)}g ADY in the reserved warm salt water, wait 10 minutes, then add to the dough.`,
        'Biga dough is stronger and more elastic than poolish dough — develop with 6–8 stretch-and-fold sets over 45 minutes until smooth and extensible.',
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil after gluten is developed.` : '',
      ].filter(Boolean) as string[],
      tips: ['If the biga is very stiff, adding the water first and letting it soak for 5 minutes before working helps enormously.'],
    },
    {
      id: 'room-temp-ferment',
      title: `Room-temperature fermentation — ${fermentationHours}h`,
      startMinutesBeforeEat: 105 + mainFermentMin,
      durationMinutes: mainFermentMin,
      temperature: cf(24),
      details: [
        `Cover and ferment at room temperature (${cf(22)}–${cf(24)}) for ${fermentationHours} hours.`,
        'Perform 3–4 stretch-and-fold sets in the first 1.5 hours, then leave undisturbed.',
        'Dough is ready when it has grown 50–75% and feels airy.',
      ],
      tips: [],
    },
    {
      id: 'ball',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        `Divide into ${numPizzas} portions of ${ballWeightG}g each. Shape into tight balls and place seam-side down in oiled containers.`,
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [`Proof at ${cf(22)}–${cf(24)} for 60 minutes. Use the poke test to confirm.`],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [`Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for 60 minutes.`],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

export function generateBigaCold(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG, oilG, yeastId, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const bigaFlourG = Math.round(flourG * 0.4);
  const bigaWaterG = Math.round(bigaFlourG * 0.45);
  const mainFlourG = flourG - bigaFlourG;
  const mainWaterG = waterG - bigaWaterG;
  const reservedWaterG = 50;
  const mainYeastG = Math.max(0, yeastG - 0.1);
  const preFermentMin = 18 * 60;
  const bigaStart = 300 + coldMin + preFermentMin;

  return [
    {
      id: 'biga-mix',
      title: 'Make the biga pre-ferment',
      startMinutesBeforeEat: bigaStart,
      durationMinutes: 20,
      temperature: '16–18°C / 61–64°F',
      details: [
        `Combine ${g(bigaFlourG)}g flour, ${g(bigaWaterG)}g cold water (${cf(16)}), and ${traceYeastNote(yeastId)}.`,
        'Mix until just combined — rough and shaggy is correct. Cover loosely and ferment at 16–18°C / 61–64°F for 18 hours.',
        'Ready when doubled, porous, and smelling nutty-yeasty (not alcoholic).',
      ],
      tips: [
        'Biga is the most temperature-sensitive pre-ferment. A few degrees makes a significant difference.',
      ],
    },
    {
      id: 'biga-main-mix',
      title: 'Break down biga & mix main dough',
      startMinutesBeforeEat: 300 + coldMin,
      durationMinutes: 75,
      details: [
        `Tear biga into chunks. Add ${g(mainWaterG - reservedWaterG)}g cold water (${cf(18)}) and work until mostly dissolved.`,
        `Add ${g(mainFlourG)}g flour in stages. Add salt water (${g(saltG)}g salt dissolved in ${g(reservedWaterG)}g cold water).`,
        yeastId === 'idy'
          ? `Add ${g(mainYeastG)}g IDY and fold to incorporate.`
          : `Dissolve ${g(mainYeastG)}g ADY in the reserved warm water, wait 10 min, add to dough.`,
        'Develop with 6–8 stretch-and-fold sets over 45 minutes.',
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil at the end.` : '',
      ].filter(Boolean) as string[],
      tips: ['Cold water prevents the dough warming up before it goes into the fridge.'],
    },
    {
      id: 'cold-ferment',
      title: `Cold fermentation — ${fermentationHours}h in the fridge`,
      startMinutesBeforeEat: 225 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(5),
      details: [
        `Transfer dough to a sealed container and refrigerate at ${cf(4)}–${cf(6)} for ${fermentationHours} hours.`,
        'The biga provides structure and strength; the cold fermentation builds deep flavour. Together they produce an exceptional crust.',
      ],
      tips: ['Biga cold-fermented dough is very forgiving — it can easily handle 72h without over-proofing.'],
    },
    {
      id: 'warm-up',
      title: 'Remove from fridge — warm up 2 hours',
      startMinutesBeforeEat: 225,
      durationMinutes: 120,
      details: [
        'Remove from fridge and leave covered at room temperature for 2 hours before dividing.',
      ],
      tips: [],
    },
    {
      id: 'ball',
      title: `Divide & ball — ${numPizzas} × ${ballWeightG}g`,
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [`Divide into ${numPizzas} × ${ballWeightG}g portions, shape into tight balls, and place seam-side down in oiled containers.`],
      tips: [],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [`Proof at ${cf(22)}–${cf(24)} for 60 minutes. Confirm with poke test.`],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [`Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for 60 minutes.`],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

// ─── sourdough ────────────────────────────────────────────────────────────────

export function generateSourdoughRoomTemp(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG: starterG, oilG, numPizzas, ballWeightG } = input;
  const bulkMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const base = 825 + bulkMin; // mise en place start

  return [
    {
      id: 'feed-starter',
      title: 'Feed the sourdough starter',
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      temperature: '24–28°C / 75–82°F',
      details: [
        `Feed your starter at a 1:2:2 ratio — take ${Math.round(starterG * 0.2)}g existing starter, add ${Math.round(starterG * 0.4)}g bread flour and ${Math.round(starterG * 0.4)}g water at ${cf(26)}.`,
        'Mix thoroughly until no dry flour remains. Scrape the sides clean.',
        `Cover loosely (not airtight) and ferment at ${cf(24)}–${cf(28)} for 8–12 hours until doubled, domed, and bubbly.`,
        `Float test: drop a small spoonful of starter into water — if it floats, it is active and ready to use. You will need ${g(starterG)}g for this recipe.`,
      ],
      tips: [
        'Starter temperature is the key variable — warmer = faster rise. At 26°C, most starters double in 8–10 hours.',
        'Use the starter at peak (fully domed, has not yet fallen) for maximum leavening power and flavour.',
      ],
    },
    {
      id: 'autolyse',
      title: 'Autolyse — flour & water',
      startMinutesBeforeEat: 210 + bulkMin,
      durationMinutes: 30,
      details: [
        `Combine ${g(flourG)}g flour with ${g(waterG - reservedWaterG)}g water at ${cf(28)}. Mix until no dry flour remains.`,
        'Cover and rest 30–60 minutes. Longer autolyse = more extensible dough, less kneading needed.',
      ],
      tips: ['For high-hydration sourdough pizza, 60 minutes autolyse is beneficial.'],
    },
    {
      id: 'add-starter-salt',
      title: 'Add starter & salt',
      startMinutesBeforeEat: 180 + bulkMin,
      durationMinutes: 30,
      details: [
        `Confirm the starter passes the float test. Add ${g(starterG)}g active starter to the autolysed dough.`,
        'Dimple the starter in and fold aggressively to incorporate — this takes 3–5 minutes. The dough will feel slack and shaggy at first; keep working.',
        'Rest 30 minutes.',
        `Dissolve ${g(saltG)}g salt in ${g(reservedWaterG)}g water and add to the dough. Fold to incorporate fully.`,
        oilG > 0 ? `Add ${g(oilG)}g olive oil and fold in.` : '',
      ].filter(Boolean) as string[],
      tips: ['Salt is added after the starter to avoid inhibiting the wild yeast.'],
    },
    {
      id: 'bulk',
      title: `Bulk fermentation — ${fermentationHours}h at room temperature`,
      startMinutesBeforeEat: 150 + bulkMin,
      durationMinutes: bulkMin,
      temperature: cf(25),
      details: [
        `Target dough temperature: ${cf(24)}–${cf(26)}. Ferment at room temperature for ${fermentationHours} hours.`,
        'Perform 4 sets of stretch-and-folds (one every 30 minutes) for the first 2 hours: grab one side, stretch to maximum, fold over, rotate 90°, repeat 4 times per set.',
        'After the 4th set, leave the dough completely undisturbed for the remainder of bulk.',
        'Bulk is complete when the dough has grown 50–75%, the surface is domed with bubbles, and it feels airy and jiggly when the container is shaken.',
      ],
      tips: [
        'Sourdough bulk is less predictable than commercial yeast — use visual and tactile cues (50–75% rise, jiggly feel) rather than the clock alone.',
        'Under-fermented dough: dense, gummy pizza. Over-fermented dough: extensible but may collapse — use immediately.',
      ],
    },
    {
      id: 'pre-shape',
      title: 'Pre-shape & bench rest',
      startMinutesBeforeEat: 150,
      durationMinutes: 45,
      details: [
        'Gently turn the dough onto an unfloured surface. Divide into ' + numPizzas + ' portions of ' + ballWeightG + 'g each.',
        'Pre-shape each into a loose round using a bench scraper — drag it toward you to build surface tension. Do not seal the seam.',
        'Leave uncovered on the bench for 30 minutes (bench rest). The gluten relaxes and makes final shaping much easier.',
      ],
      tips: ['The bench rest is not optional — skipping it makes the dough tear during final shaping.'],
    },
    {
      id: 'shape',
      title: 'Final shape',
      startMinutesBeforeEat: 105,
      durationMinutes: 15,
      details: [
        'Shape each round into a tight ball with strong surface tension: fold the edges to the centre, flip, and drag on the surface to tighten.',
        'Place seam-side down in lightly floured or oiled containers. Cover.',
      ],
      tips: [],
    },
    {
      id: 'proof',
      title: 'Final proof — 1 hour',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      details: [
        `Proof at room temperature (${cf(22)}–${cf(24)}) for 60–75 minutes.`,
        'The balls should look visibly puffy and spring back slowly when poked.',
      ],
      tips: [],
    },
    {
      id: 'preheat',
      title: 'Preheat oven',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [`Preheat with baking steel or stone to ${cf(BAKE_GUIDE[input.styleId].temp)} for 60 minutes.`],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

export function generateSourdoughCold(input: GeneratorInput): RecipeStep[] {
  const { fermentationHours, flourG, waterG, saltG, yeastG: starterG, oilG, numPizzas, ballWeightG } = input;
  const coldMin = fermentationHours * 60;
  const reservedWaterG = 50;
  const base = 1095 + coldMin;

  return [
    {
      id: 'feed-starter',
      title: 'Feed the sourdough starter',
      startMinutesBeforeEat: base,
      durationMinutes: 15,
      temperature: '24–28°C / 75–82°F',
      details: [
        `Feed at 1:2:2 — ${Math.round(starterG * 0.2)}g starter, ${Math.round(starterG * 0.4)}g flour, ${Math.round(starterG * 0.4)}g water at ${cf(26)}.`,
        `Ferment at ${cf(24)}–${cf(28)} for 8–12 hours until doubled and domed.`,
        `You need ${g(starterG)}g active starter. Float test: a small piece dropped in water should float.`,
      ],
      tips: ['Feed the starter at least 8–12 hours before you plan to mix the dough.'],
    },
    {
      id: 'autolyse',
      title: 'Autolyse — flour & water',
      startMinutesBeforeEat: 480 + coldMin,
      durationMinutes: 30,
      details: [
        `Combine ${g(flourG)}g flour with ${g(waterG - reservedWaterG)}g water at ${cf(28)}. Mix until no dry flour remains.`,
        'Cover and rest 30–60 minutes.',
      ],
      tips: [],
    },
    {
      id: 'add-starter-salt',
      title: 'Add starter & salt',
      startMinutesBeforeEat: 450 + coldMin,
      durationMinutes: 30,
      details: [
        `Add ${g(starterG)}g active starter to the autolysed dough. Fold to incorporate fully — 3–5 minutes. Rest 30 minutes.`,
        `Dissolve ${g(saltG)}g salt in ${g(reservedWaterG)}g water and fold into the dough.`,
        oilG > 0 ? `Fold in ${g(oilG)}g olive oil.` : '',
      ].filter(Boolean) as string[],
      tips: [],
    },
    {
      id: 'bulk',
      title: 'Bulk fermentation — 4.5h at room temperature',
      startMinutesBeforeEat: 420 + coldMin,
      durationMinutes: 270,
      temperature: cf(25),
      details: [
        `Ferment at ${cf(24)}–${cf(26)} for 4.5 hours with 4 sets of stretch-and-folds (one every 30 minutes for the first 2 hours).`,
        'Bulk is complete when the dough has grown 50–75%, is bubbly, domed, and jiggly.',
        'This is a partial bulk — the dough will continue developing slowly in the cold proof.',
      ],
      tips: [
        'For cold-proofed sourdough, stop bulk slightly earlier (40–50% rise) to prevent over-proofing during the long cold ferment.',
      ],
    },
    {
      id: 'pre-shape',
      title: 'Pre-shape & bench rest',
      startMinutesBeforeEat: 150 + coldMin,
      durationMinutes: 30,
      details: [
        `Divide into ${numPizzas} portions of ${ballWeightG}g each. Pre-shape loosely into rounds. Bench rest uncovered 25–30 minutes.`,
      ],
      tips: [],
    },
    {
      id: 'shape-cold-proof',
      title: `Final shape & cold proof — ${fermentationHours}h in the fridge`,
      startMinutesBeforeEat: 90 + coldMin,
      durationMinutes: coldMin,
      temperature: cf(4),
      details: [
        'Shape each ball tightly with strong surface tension. Place into individual floured containers (or a floured tray covered tightly with plastic).',
        `Refrigerate immediately at ${cf(3)}–${cf(5)} for ${fermentationHours} hours.`,
        'The cold proof continues fermentation very slowly while the long rest develops flavour, extensibility, and a more open crumb.',
        'The dough will look unchanged or barely risen — that is normal. The fermentation is complete inside.',
      ],
      tips: [
        'Sourdough cold-proofed balls are very extensible — they stretch beautifully straight from the fridge.',
        'You can safely extend the cold proof by 12–24 hours without significant over-proofing risk.',
      ],
    },
    {
      id: 'preheat',
      title: 'Preheat oven & remove dough',
      startMinutesBeforeEat: 90,
      durationMinutes: 60,
      temperature: cf(BAKE_GUIDE[input.styleId].temp),
      details: [
        `Remove dough balls from the fridge and preheat the oven to ${cf(BAKE_GUIDE[input.styleId].temp)} with baking steel or stone inside for 60 minutes.`,
        'Cold-proofed sourdough can be stretched directly from the fridge — the cold makes it easier to handle. Or rest 30–45 minutes at room temperature first for more extensibility.',
      ],
      tips: [],
    },
    ...bakingSteps(input),
  ];
}

// ─── main export ──────────────────────────────────────────────────────────────

export class RecipeStepsGenerator {
  static generate(input: GeneratorInput): RecipeStep[] {
    const { method, mode } = input;
    if (method === 'straight') return mode === 'cold' ? generateStraightCold(input) : generateStraightRoomTemp(input);
    if (method === 'poolish')  return mode === 'cold' ? generatePoolishCold(input)  : generatePoolishRoomTemp(input);
    if (method === 'biga')     return mode === 'cold' ? generateBigaCold(input)     : generateBigaRoomTemp(input);
    return mode === 'cold' ? generateSourdoughCold(input) : generateSourdoughRoomTemp(input);
  }

  /** Stable key for sessionStorage — changes when any recipe parameter changes */
  static checklistKey(input: Pick<GeneratorInput, 'method' | 'mode' | 'fermentationHours'>): string {
    return `pizza-checklist-v1-${input.method}-${input.mode}-${input.fermentationHours}`;
  }
}
