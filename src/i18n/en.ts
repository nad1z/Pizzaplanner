import type { AppTranslation } from './types';

export const en: AppTranslation = {
  dir: 'ltr',
  nav: {
    calculator: '🍕 Calculator',
    flourGuide:  '🌾 Flour Guide',
    recipe:      '📋 Recipe',
  },
  lang: { label: 'Language', en: 'English', he: 'עברית' },
  calc: {
    title: 'Pizzaplanner',
    subtitle: 'The best pizza calculator there is.',
    yourDough: 'Your Dough',
    recipe: 'Recipe',
    labels: {
      pizzas:       'Pizzas',
      ballWeight:   'Ball Weight',
      diameter:     'Diameter',
      hydration:    'Hydration',
      flour:        'Flour',
      water:        'Water',
      fermentation: 'Fermentation',
      yeastType:    'Yeast Type',
      totalDough:   'Total dough',
      salt:         'Salt',
      oil:          'Oil',
    },
    perPizza: 'Per pizza',
    buttons: {
      apply:       'Apply',
      change:      'Change',
      selectFlour: '🌾 Select a flour from Flour Guide',
      reset:       '↺ Reset to defaults',
      switch:      'Switch',
      copyLink:    'Copy link',
      copied:      'Copied!',
    },
    flourSuggests: (name, h, f) =>
      `🌾 ${name} suggests ${h}% hydration & ${f}h fermentation`,
    hydrationLooksLike: (pct, style) =>
      `Your hydration (${pct}%) looks more like ${style} — try switching?`,
    hydrationOutside: (pct, sev, style, min, max) =>
      `Hydration ${pct}% is ${sev} outside the ${style} range (${min}–${max}%)`,
    ballWeightOutside: (g, sev, style, min, max) =>
      `Ball weight ${g}g is ${sev} outside the ${style} range (${min}–${max}g)`,
    severity: { critically: 'critically', slightly: 'slightly' },
  },
  guide: {
    title:    'Flour Guide',
    subtitle: 'Find the right flour for your pizza style',
    recommended:    'Recommended for your setup',
    recommendedFor: (style, h, f) => `${style} · ${h}% hydration · ${f}h fermentation`,
    allFlours:  'All Flours',
    allFilter:  'All',
    sortedBy:   (style) => `Sorted by score for ${style} (descending)`,
    apply: 'Apply',
  },
  card: {
    protein:       'Protein',
    strength:      'Strength',
    hydrationLabel:'Hydration',
    fermentLabel:  'Ferment',
    hydrationRange:'Hydration range',
    moreDetails:   'More details',
    fermentation:  'Fermentation',
    notIdealFor:   'Not Ideal For',
    selected:      '✓ Selected',
    select:        'Select',
    apply:         'Apply',
    scoreFor: (style) => `for ${style}`,
    optimal:  (val)   => `optimal ${val}%`,
    yours:    (val)   => `yours ${val}%`,
  },
  gauge: {
    hydration:  'hydration',
    styleRange: (min, max) => `Style range: ${min}–${max}%`,
    flourRange: (min, max) => `Flour range: ${min}–${max}%`,
  },
  yeast: {
    idy:      { name: 'Instant Dry',  description: 'Mix directly into flour' },
    ady:      { name: 'Active Dry',   description: 'Dissolve in warm water first' },
    sourdough:{ name: 'Sourdough',    description: 'Natural starter, 20% of flour' },
  },
  styles: {
    neapolitan:   { name: 'Neapolitan',     description: 'Classic wood-fired Italian pizza — 00 flour, short fermentation, puffy charred cornicione' },
    neonapolitan: { name: 'Neo Neapolitan', description: 'Contemporary high-hydration Neapolitan — open crumb, airy cornicione, leopard-spotted crust' },
    newyork:      { name: 'New York',       description: 'Large foldable slices, chewy and pliable crust with slight char on the edges' },
    roman:        { name: 'Roman',          description: 'Teglia-style (al taglio) — crispy outside, airy inside, high hydration pan pizza' },
    brooklyn:     { name: 'Brooklyn',       description: 'Hearty thin-to-medium crust with crunch, gas-oven fired — classic New York tradition' },
    detroit:      { name: 'Detroit',        description: 'Square, oiled pan pizza — crispy caramelised edges, cheese to the crust' },
    sicilian:     { name: 'Sicilian',       description: 'Thick, wide and soft with a bready crumb and generous toppings' },
    focaccia:     { name: 'Focaccia',       description: 'Ligurian-style olive oil flatbread — dimpled, golden, airy crumb with a crispy bottom' },
  },
  flourDescriptions: {
    'Caputo Pizzeria 00':              'Classic Neapolitan pizza flour with balanced elasticity.',
    'Caputo Nuvola':                   'High hydration flour for airy, open crumb pizza — ideal for contemporary Neapolitan styles.',
    'Caputo Manitoba Oro':             'Very strong flour for long fermentation and high hydration.',
    'Pivetti Tipo 00':                 'Balanced Italian flour for classic pizza dough.',
    'Shtybel 2 Bread Flour':           'Versatile bread flour commonly used for NY-style pizza.',
    'Shtybel 15':                      'Strong Israeli bread flour with high protein for long cold fermentation and thick-crust styles.',
    'Shtybel Pizza & Focaccia':        'Purpose-built Israeli flour for pizza and focaccia — soft crumb with a crispy base.',
    'Shtybel Pizza':                   'Strong Israeli pizza flour (W360 "00") — designed for cold fermented Italian-style pizza and focaccia with 24–72h in the fridge.',
    'Shtybel Raananis':                'Premium Israeli W360 "00" pizza flour, developed with pizza expert Raanan Yosef Nosel — built for 48–96h cold fermentation and a deeply flavoured, airy crust.',
    'Caputo Nuvola Super':             'Stronger version of Nuvola for very high hydration and extended cold fermentation — delivers an ultra-light, airy crumb.',
    'Shtybel Manitoba':                'Very high-protein Israeli Manitoba flour from Canadian wheat — use pure for ultra-high hydration doughs, or blend up to 30% with a weaker flour to boost strength for extended cold fermentation.',
    'Caputo Classica 00':              'Light all-purpose Italian 00 flour — ideal for quick same-day doughs, everyday pizza, and soft bread.',
    'Caputo Chef 00':                  'Professional Italian 00 flour (red Cuoco bag) — strong and elastic, built for cold-fermented Neapolitan and New York style pizza with outstanding extensibility.',
    'Spadoni PZ2':                     'Italian 00 pizza flour for soft, traditional pizza — designed for quick same-day rising (4–8h), simple and approachable.',
    'Spadoni PZ4':                     'Italian 00 "Croccante" pizza flour — strong gluten for medium-long fermentation yielding a crispy, well-charred crust.',
    'Spadoni Manitoba XLL':            'Ultra-strong Italian Manitoba 0 flour — for very high hydration doughs and long cold fermentation, or as a 20–30% blend to reinforce weaker flour.',
    'Kemah HaAretz Pizza 00 Quick':    'Israeli Tipo 00 pizza flour (imported from Italy) for quick same-day doughs — 13% protein at W230–250.',
    'Kemah HaAretz Pizza 00 Long':     'Israeli Tipo 00 pizza flour (imported from Italy) for long cold fermentation — W300–320 at 14% protein, delivers complex flavour and open, airy crumb.',
    'Kemah HaAretz Pizza & Focaccia':  'Israeli 00 pizza and focaccia flour from Kemah HaAretz — versatile medium-strength flour for classic pizza styles and high-hydration focaccia.',
  },
  flourTypes: {
    '00':             '00',
    '0':              '0',
    'Bread Flour':    'Bread Flour',
    'Strong Bread':   'Strong Bread',
    'Manitoba':       'Manitoba',
    'Pizza/Focaccia': 'Pizza/Focaccia',
  },
  warnings: {
    fermentOverrun:  'This flour may break down over long fermentation',
    hydrationTooHigh:'Hydration may be too high for this flour',
    detroitTooWeak:  'This flour may lack strength for Detroit-style pizza',
  },
  fermentationTypes: {
    room_temp:    'Room temperature',
    short_cold:   'Short cold',
    cold_ferment: 'Cold fermentation',
    long_cold:    'Long cold fermentation',
  },
  flourTypeLabel: 'Type',
  doughMethods: {
    straight: { name: 'Straight Dough', description: 'All ingredients mixed at once — simple, reliable, great for same-day pizza.' },
    poolish:  { name: 'Poolish',        description: 'Liquid pre-ferment (50% flour, 100% hydration) — exceptional flavour and open crumb.' },
    biga:     { name: 'Biga',           description: 'Stiff Italian pre-ferment (40% flour, 45% hydration) — strength, structure, and complex flavour.' },
    sourdough:{ name: 'Sourdough',      description: 'Natural wild-yeast starter — unmatched depth of flavour and natural tang.' },
  },
  recipe: {
    title:              'Recipe Steps',
    noEatDate:          'Set a target time to get a precise schedule',
    eatDateLabel:       'When do you want to eat?',
    eatDatePlaceholder: 'Pick a date & time',
    methodLabel:        'Dough Method',
    basicLabel:         'Basic',
    advancedLabel:      'Advanced',
    fermentModeLabel:   'Fermentation',
    roomTempLabel:      'Room Temp',
    coldLabel:          'Cold (Fridge)',
    fermentTimeLabel:   'Duration',
    totalTimeLabel:     (h) => `Total process: ~${h}h`,
    totalHoursShort:    (h) => `~${h}h total`,
    timelineTitle:      'Schedule',
    checklistTitle:     'Checklist',
    resetChecklist:     'Reset checklist',
    beforeEat:          (h, m) => h > 0 ? `${h}h ${m > 0 ? `${m}m ` : ''}before eating` : `${m}m before eating`,
    absoluteTime:       (s) => s,
    stepDuration:       (min) => min >= 60 ? `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}m` : ''}` : `${min} min`,
    parallel:           '(starts at the same time as the previous step)',
    tipLabel:           '💡 Tip',
    tempLabel:          '🌡️',
    allDone:            '🎉 All steps complete — enjoy your pizza!',
    viewRecipe:         'View Recipe →',
    eatingAt:           'Eating at',
    startBy:            'Start by',
    progressDone:       (done, total) => `${done} / ${total} done`,
    yeastLabel:         'Yeast',
    starterLabel:       'Starter',
  },
  share: {
    label: 'Share',
    message: 'Check out my pizza recipe!',
    messages: 'Messages',
  },
  validation: {
    invalidNumber: 'Must be a valid number',
    belowMin: (min, unit) => `Minimum ${min}${unit}`,
    aboveMax: (max, unit) => `Maximum ${max}${unit}`,
  },
  recipeSteps: {
    // ── helpers ────────────────────────────────────────────────────────────────
    idyInstruction:  (yeastG: string) => `Sprinkle ${yeastG}g instant dry yeast directly over the dough — no pre-activation needed.`,
    adyInstruction:  (yeastG: string, waterG: string, temp: string) => `Dissolve ${yeastG}g active dry yeast in ${waterG}g warm water (${temp}) and wait 10 minutes until foamy before adding to the dough.`,
    idyTrace:        '0.1g instant dry yeast (about a pinch — use a precision scale)',
    adyTrace:        '0.1g active dry yeast (about a pinch — dissolve in the pre-ferment water before adding)',
    drizzleOil:      (oilG: string) => `Drizzle ${oilG}g olive oil over the dough and toppings.`,
    bakeNote: {
      neapolitan:   'Use the highest setting your oven allows. If you have a broiler, switch it on for the last minute to char the crust.',
      neonapolitan: 'High heat is essential for an open, airy cornicione. Place the stone or steel in the upper third of the oven.',
      newyork:      'Rotate the pizza halfway through for even browning. The underside should be golden and slightly crisp.',
      roman:        'Bake in an oiled pan (teglia). The bottom should be crispy and golden; the top evenly browned.',
      brooklyn:     'The crust should be crisp and well-charred at the rim. A baking steel gives the best result for this style.',
      detroit:      'Bake in a well-oiled square pan. The cheese should caramelise and char at the edges — that is the defining feature.',
      sicilian:     'Bake in a well-oiled rectangular pan. The bottom should be crispy and deeply golden; the top soft with golden cheese.',
      focaccia:     'The surface should be golden and slightly blistered. The bottom must be crispy — if not, return to the oven for 3–5 more minutes.',
    },
    panNote: {
      detroit:  'Push the dough firmly into all four corners of a well-oiled rectangular blue steel pan. Lay cheese (ideally brick cheese or a blend) all the way to the edges so it fries and caramelises against the pan sides. Add sauce in stripes on top of the cheese — Detroit style adds sauce last.',
      roman:    'Press the dough evenly across the oiled teglia (rectangular pan) to about 1–1.5 cm thickness. Dimple the surface with your fingertips. Add sauce thinly — Roman pizza al taglio is relatively lightly topped.',
      sicilian: 'Press the dough evenly into the oiled rectangular pan to about 1.5 cm thickness. Let it rest 15 minutes if it springs back. Add sauce and toppings generously.',
      focaccia: 'Press dough to the pan edges. Drizzle generously with olive oil and use all your fingertips to press deep dimples across the entire surface. Let rest 20 minutes before adding toppings (rosemary, coarse salt, olives). No sauce needed.',
    },
    panNoteFallback: 'Press the dough evenly across the pan to an even thickness. If it resists, cover and rest 10 minutes, then try again — the gluten will relax.',
    // ── titles ─────────────────────────────────────────────────────────────────
    t: {
      miseEnPlace:          'Mise en place',
      autolyse:             'Mix flour & water — autolyse',
      developGluten:        'Add salt & yeast — develop gluten',
      bulkRoom:             (h: number) => `Bulk fermentation — ${h}h at room temperature`,
      ballDiv:              (n: number, grams: number) => `Divide & ball — ${n} × ${grams}g`,
      proofFinal:           'Final proof',
      preheat:              'Preheat oven',
      preheatRemove:        'Preheat oven & remove dough',
      stretchPan:           'Press into pan & top',
      stretchShape:         'Stretch, shape & top',
      bake:                 'Bake',
      restEat:              'Rest & eat',
      shortBulk:            'Short room-temperature bulk — 1 hour',
      coldRetard:           (h: number) => `Cold retard — ${h}h in the fridge`,
      coldFerment:          (h: number) => `Cold fermentation — ${h}h in the fridge`,
      warmUp:               'Remove from fridge — warm up',
      warmUp2h:             'Remove from fridge — warm up 2 hours',
      poolishMix:           'Make the poolish pre-ferment',
      poolishMainMix:       'Mix the main dough',
      bigaMix:              'Make the biga pre-ferment',
      bigaMainMix:          'Break down biga & mix main dough',
      roomTempFerment:      (h: number) => `Room-temperature fermentation — ${h}h`,
      feedStarter:          'Feed the sourdough starter',
      addStarterSalt:       'Add starter & salt',
      bulkSourdough:        (h: number) => `Bulk fermentation — ${h}h at room temperature`,
      bulkSourdoughPartial: 'Bulk fermentation — 4.5h at room temperature',
      preShape:             'Pre-shape & bench rest',
      finalShape:           'Final shape',
      shapeColdProof:       (h: number) => `Final shape & cold proof — ${h}h in the fridge`,
    },
    // ── common baking steps ────────────────────────────────────────────────────
    panPress: {
      d1:   (oilG: string, hasOil: boolean) => hasOil
              ? `Coat your baking pan generously with olive oil — use ${oilG}g and cover the base and sides completely.`
              : 'Coat your baking pan generously with olive oil and cover the base and sides completely.',
      d2:   'Place a dough ball in the centre of the pan and begin pressing outward from the middle with flat fingertips. Do not stretch by pulling — press and dimple.',
      d4:   (n: number) => `Repeat for each of the ${n} pan${n > 1 ? 's' : ''}.`,
      tip1: 'Pan dough should be soft and extensible. If it keeps springing back, it needs more rest — cover and wait 10 minutes.',
      tip2: 'More oil in the pan = crispier bottom. Do not skimp.',
    },
    handStretch: {
      d1:   "Lightly flour your work surface. Take one dough ball and press from the centre outward with your fingertips, leaving a 2 cm / 1\" rim untouched — this becomes the cornicione.",
      d2:   (diamCm: number, diamIn: number) => `Lift the dough and let gravity stretch it gently, rotating it as you go, until it reaches approximately ${diamCm} cm / ${diamIn}" in diameter.`,
      d3:   'Transfer to a lightly floured peel or a sheet of parchment. Work quickly — wet toppings make the dough stick to the peel.',
      d4:   (drizzle: string) => `Add sauce and toppings sparingly. Less is more: overloaded pizza steams rather than bakes.${drizzle}`,
      d5:   (n: number) => `Repeat for each of the ${n} pizza${n > 1 ? 's' : ''}.`,
      tip1: 'Never use a rolling pin — it degasses the dough and destroys the cornicione.',
      tip2: 'If the dough springs back and resists stretching, cover it and let it rest 5 minutes before trying again.',
    },
    bakeStep: {
      d1:   'Slide the pizza onto the preheated steel or stone using a quick, confident forward-and-back motion.',
      d2:   (temp: string, minMin: number, maxMin: number) => `Bake at ${temp} for ${minMin}–${maxMin} minutes.`,
      d4:   'Look for: golden-to-charred spotted crust edges, bubbling and slightly browning cheese, a firm base that slides freely on the steel.',
      tip1: 'Open the oven as little as possible during baking to maintain temperature.',
      tip2: 'A quick peek at 2 minutes helps you learn your oven — every home oven is different.',
    },
    restStep: {
      d1:   'Remove the pizza from the oven and let it rest on a wire rack or cutting board for 3–5 minutes before slicing.',
      d2:   'Resting allows steam to escape from the crust and the cheese to set — slicing too early makes it soggy.',
      tip1: "A pizza wheel gives cleaner slices; a sharp chef's knife works too.",
    },
    // ── straight / room-temp ───────────────────────────────────────────────────
    str: {
      mise: {
        d1:   (flour: string, water: string, salt: string, yeast: string, yeastType: string, oilInfo: string) =>
                `Weigh all ingredients precisely: ${flour}g flour, ${water}g water, ${salt}g salt, ${yeast}g ${yeastType} yeast${oilInfo ? `, ${oilInfo}g olive oil` : ''}.`,
        d2:   (mainWater: string, temp: string, reserved: string) =>
                `Heat ${mainWater}g of the water to ${temp} — slightly warm, not hot. Set aside ${reserved}g in a small bowl for dissolving the salt (and activating ADY if needed).`,
        d3:   'Prepare a large mixing bowl, a bench scraper, a dough container (lightly oiled), and a kitchen thermometer if you have one.',
        tip1: 'Water temperature is the easiest way to control final dough temperature. For a 24°C dough in a 22°C kitchen, aim for 26–27°C water.',
      },
      autolyse: {
        d1:   (mainWater: string, flour: string) => `Pour ${mainWater}g water into the mixing bowl, then add all ${flour}g flour.`,
        d2:   'Mix until no dry flour remains — it will look shaggy and rough. Do not over-mix at this stage.',
        d3:   'Cover tightly with plastic wrap or a damp cloth and rest for 30 minutes. This is the autolyse: the flour hydrates and gluten begins forming on its own.',
        tip1: 'Autolyse reduces the kneading time needed and improves dough extensibility.',
      },
      gluten: {
        d1:   (salt: string, water: string) => `Dissolve ${salt}g salt in the reserved ${water}g water.`,
        d3:   'Add both to the dough and incorporate by pinching and folding until fully absorbed — about 3–5 minutes.',
        d4:   'Develop the gluten using the slap-and-fold technique or by performing 6–8 stretch-and-fold sets in the bowl over the next 20–25 minutes, with 3-minute rests between sets.',
        d5:   'The dough is ready when it is smooth, slightly tacky (not sticky), and passes the windowpane test: stretch a small piece thin enough to see light through without it tearing.',
        d6:   (oil: string) => `Add ${oil}g olive oil and fold it in after the gluten is developed — adding oil too early inhibits gluten formation.`,
        tip1: 'Wet hands prevent sticking without adding extra flour — keep a bowl of water nearby.',
      },
      bulk: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Place the dough in a lightly oiled container, cover, and ferment at room temperature (${minTemp}–${maxTemp}) for ${hours} hours.`,
        d2:   (targetTemp: string) => `Target dough temperature: ${targetTemp}. Check with a thermometer — warmer dough ferments faster.`,
        d3:   (sets: number, totalMin: number) =>
                `Perform ${sets} sets of stretch-and-folds, one every 30 minutes, during the first ${totalMin} minutes of bulk:`,
        d4:   'Each set: with wet hands, grab one side of the dough, stretch it up as far as it goes without tearing, and fold it over the centre. Rotate the bowl 90° and repeat — 4 folds per set.',
        d5:   'After the last set, leave the dough completely undisturbed for the remainder of bulk fermentation.',
        d6:   'Dough is ready when it has grown 50–75% in volume, the surface is slightly domed with visible bubbles, and it feels airy and jiggly when the container is gently shaken.',
        tip1: (temp: string) => `If your kitchen is warmer than ${temp}, bulk will finish faster — check at 75% of the stated time.`,
        tip2: 'Mark the side of the container with a rubber band to track the rise accurately.',
      },
      ball: {
        d1:   'Gently turn the dough onto a clean, unfloured surface — a little sticking helps build surface tension.',
        d2:   (n: number, grams: number) =>
                `Using a bench scraper and scale, divide into ${n} equal portions of ${grams}g each. Be gentle — avoid degassing the dough.`,
        d3:   'Shape each portion into a tight ball: cup your hand over the piece and drag it toward you on the surface, using friction to build tension. Pinch the seam shut at the bottom.',
        d4:   'Place balls seam-side down, spaced apart, in lightly oiled containers or on a floured tray covered with plastic wrap.',
        tip1: 'If the dough tears during shaping, cover and rest 5 minutes — relaxed gluten shapes more easily.',
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) => `Cover the dough balls and proof at room temperature (${minTemp}–${maxTemp}) for 60 minutes.`,
        d2:   "Poke test: press one finger 1 cm into a ball — if it springs back slowly and only halfway, the dough is perfectly proofed. If it snaps back immediately, give it more time. If it doesn't spring back at all, it is slightly over-proofed — proceed quickly.",
        d3:   'Preheat your oven at the same time as the proof begins (see next step).',
        tip1: 'Proofed balls should look visibly puffy and feel light and airy when you lift the container.',
      },
      preheat: {
        d1:   (temp: string) => `Place your baking steel, stone, or oven-safe pan in the oven and preheat to the maximum temperature — at least ${temp}.`,
        d2:   'Allow at least 45–60 minutes at full temperature for the thermal mass to fully saturate — a short preheat produces a pale, soft-bottomed pizza.',
        d3:   'Position: upper third of the oven for Neapolitan/Neo-Neapolitan; middle for New York, Brooklyn, and other styles; lower third for pan pizzas (Roman, Detroit, Sicilian, Focaccia).',
        tip1: "An oven thermometer is worth buying — most home ovens run 20–30°C cooler than their dial indicates.",
      },
    },
    // ── straight / cold ────────────────────────────────────────────────────────
    stc: {
      mise: {
        d1:   (flour: string, water: string, salt: string, yeast: string, yeastType: string, oilInfo: string) =>
                `Weigh all ingredients: ${flour}g flour, ${water}g water, ${salt}g salt, ${yeast}g ${yeastType} yeast${oilInfo ? `, ${oilInfo}g olive oil` : ''}.`,
        d2:   (minTemp: string, maxTemp: string) =>
                `Use cold water (${minTemp}–${maxTemp}) for the dough — cold dough ferments slowly and evenly in the fridge without over-proofing.`,
        d3:   'Prepare a large mixing bowl, bench scraper, and a dough container with a lid.',
        tip1: 'Cold water is essential here — it prevents the dough from over-fermenting before it reaches the fridge.',
      },
      autolyse: {
        d1:   (mainWater: string, flour: string) => `Combine ${mainWater}g cold water with ${flour}g flour. Mix until no dry flour remains.`,
        d2:   'Cover and rest 30 minutes — the autolyse develops gluten passively.',
      },
      gluten: {
        d1:   (salt: string, water: string) => `Dissolve ${salt}g salt in the reserved ${water}g cold water.`,
        d3:   'Add to the dough and fold to incorporate. Then perform 6 stretch-and-fold sets over 25 minutes.',
        d4:   'The dough should be smooth and pass the windowpane test before going into the fridge.',
        d5:   (oil: string) => `Fold in ${oil}g olive oil after gluten is developed.`,
        tip1: 'Well-developed gluten before cold fermentation means the dough can hold gas produced during the slow fridge rise.',
      },
      shortBulk: {
        d1:   (minTemp: string, maxTemp: string) =>
                `Place the dough in a lightly oiled container and ferment at room temperature (${minTemp}–${maxTemp}) for 1 hour.`,
        d2:   'Perform 2 sets of stretch-and-folds, 30 minutes apart, to build structure before the cold retard.',
        d3:   'The dough does not need to grow significantly at this stage — 10–20% increase is enough.',
        tip1: 'This short room-temp period kick-starts fermentation and builds gluten strength before the fridge slows everything down.',
      },
      ball: {
        d1:   (n: number, grams: number) => `Divide the dough into ${n} portions of ${grams}g each.`,
        d2:   'Shape each into a tight ball and place into individual lightly oiled containers with lids.',
        d3:   'Label with the time if needed — this helps you track the cold retard.',
        tip1: 'Individual containers prevent the balls from sticking together and make it easy to take out one at a time.',
      },
      retard: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Seal the containers and refrigerate at ${minTemp}–${maxTemp} for ${hours} hours.`,
        d2:   'The cold temperature slows fermentation dramatically, developing flavour compounds and gluten strength without risk of over-proofing.',
        d3:   'The dough will rise slowly — that is expected. Sealed tightly, the balls will keep in the fridge for up to 72 hours.',
        tip1: 'Do not place the dough near the back of the fridge where it may partially freeze.',
        tip2: 'The dough is ready when it has risen visibly (30–50%) and feels slightly puffy.',
      },
      warmUp: {
        d1:   'Take the dough balls out of the fridge and leave them covered at room temperature for 60 minutes.',
        d2:   'Cold dough is stiff and inextensible — warming it up ensures the gluten relaxes and the dough stretches easily without tearing.',
        d3:   'Start preheating your oven at the same time (see next step).',
        tip1: 'In a cold kitchen (under 20°C), allow 90 minutes for the dough to warm through properly.',
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) =>
                `After the warm-up, let the balls continue proofing at room temperature (${minTemp}–${maxTemp}) for 1 hour.`,
        d2:   'Use the poke test to confirm readiness: a finger pressed 1 cm deep should spring back slowly and halfway.',
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for at least 60 minutes.`,
        d2:   'Start preheating at the same time as the warm-up phase so everything is ready together.',
      },
    },
    // ── poolish / room-temp ────────────────────────────────────────────────────
    plr: {
      poolishMix: {
        d1:   (flour: string, water: string, temp: string) =>
                `In a medium bowl, combine ${flour}g flour with ${water}g water at room temperature (${temp}).`,
        d3:   'Mix until completely smooth — no lumps. The poolish should have a thick, pourable batter consistency.',
        d4:   'Cover tightly with plastic wrap and ferment at room temperature between 18–22°C / 64–72°F for 12–16 hours (target 14 hours).',
        d5:   'Ready when: the surface is domed and covered in bubbles, and the poolish is just beginning to fall in the centre (do not let it fully collapse — that means it has over-fermented).',
        tip1: 'Cooler temperature (18°C) = slower ferment, more complex flavour. Warmer (22°C) = faster, less complex. A wine cooler or cool room is ideal.',
        tip2: 'You can reduce the yeast to make the poolish mature more slowly — useful for 16+ hour ferments.',
      },
      mainMix: {
        d1:   'Add all the mature poolish to a large mixing bowl.',
        d2:   (mainFlour: string, mainWater: string, reserved: string) =>
                `Add ${mainFlour}g flour and ${mainWater}g water. Mix until no dry flour remains, then rest 30 minutes (autolyse with the poolish). Reserve ${reserved}g water for salt.`,
        d3:   (salt: string, water: string) => `Dissolve ${salt}g salt in the reserved ${water}g water.`,
        d4idy: (yeast: string) =>
                `Sprinkle ${yeast}g instant dry yeast over the dough, then pour in the salt water and incorporate by folding.`,
        d4ady: (yeast: string, temp: string) =>
                `Dissolve ${yeast}g active dry yeast in the reserved warm (${temp}) salt water, wait 10 minutes, then add to the dough.`,
        d5:   'The poolish adds extensibility, so the dough will come together faster than straight dough. Develop with 4–6 stretch-and-fold sets over 30 minutes.',
        d6:   (oil: string) => `Fold in ${oil}g olive oil after gluten is developed.`,
        tip1: 'The poolish makes the dough noticeably more extensible and easier to stretch than straight dough.',
      },
      ferment: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Cover the dough and ferment at room temperature (${minTemp}–${maxTemp}) for ${hours} hours.`,
        d2:   'Perform 3–4 stretch-and-fold sets, every 30 minutes, for the first 1.5–2 hours. Let the dough rest undisturbed after that.',
        d3:   'Dough is ready when it has grown 50–75%, feels airy and jiggly, and has a light, yeasty aroma.',
      },
      ball: {
        d1:   (n: number, grams: number) =>
                `Gently turn the dough onto an unfloured surface. Divide into ${n} portions of ${grams}g each.`,
        d2:   'Shape each into a tight ball using the drag-and-seal technique. Place seam-side down in lightly oiled containers.',
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) => `Proof at room temperature (${minTemp}–${maxTemp}) for 60 minutes.`,
        d2:   'Poke test: dough should spring back slowly and halfway when poked 1 cm deep.',
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for 60 minutes.`,
      },
    },
    // ── poolish / cold ─────────────────────────────────────────────────────────
    plc: {
      poolishMix: {
        d1:   (flour: string, water: string, temp: string) =>
                `In a medium bowl, combine ${flour}g flour with ${water}g water at room temperature (${temp}).`,
        d3:   'Mix until completely smooth. Cover tightly with plastic wrap.',
        d4:   'Ferment at 18–22°C / 64–72°F for 12–16 hours (target 14 hours).',
        d5:   'Ready when: domed, bubbly, and just starting to fall in the centre.',
        tip1: '18°C is the sweet spot for a 14-hour poolish. In summer, use cold water to slow it down.',
        tip2: 'A poolish that has fully collapsed is over-fermented — the flavour will be sharp and sour.',
      },
      mainMix: {
        d1:   (mainFlour: string, mainWater: string, reserved: string, temp: string) =>
                `Combine the mature poolish with ${mainFlour}g flour and ${mainWater}g cold water (${temp}). Mix until combined, then rest 30 minutes (autolyse). Reserve ${reserved}g water for salt.`,
        d2:   'Mix until combined, then rest 30 minutes (autolyse).',
        d3:   (salt: string, water: string) => `Dissolve ${salt}g salt in ${water}g cold water.`,
        d4idy: (yeast: string) =>
                `Sprinkle ${yeast}g IDY over the dough, add the salt water, and fold to incorporate.`,
        d4ady: (yeast: string, water: string) =>
                `Dissolve ${yeast}g ADY in reserved ${water}g warm water, wait 10 minutes, then add with the salt water.`,
        d5:   'Develop with 4–6 stretch-and-fold sets over 30 minutes.',
        d6:   (oil: string) => `Fold in ${oil}g olive oil last.`,
        tip1: 'Use cold water for the main dough — the pre-ferment is warm enough; the main dough needs to start cool before going into the fridge.',
      },
      coldFerment: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Transfer the dough (whole, not yet divided) to a covered container and refrigerate at ${minTemp}–${maxTemp} for ${hours} hours.`,
        d2:   'The cold environment slows fermentation and allows flavour to develop slowly and deeply.',
        d3:   'The dough will rise 25–50% over this period — this is normal.',
        tip1: 'You can extend the cold ferment by up to 12 hours if your schedule changes — the poolish and cold work together to prevent over-proofing.',
      },
      warmUp: {
        d1:   'Remove the dough from the fridge and leave covered at room temperature for 2 hours.',
        d2:   'The dough must warm through before it can be divided, balled, and proofed — cold dough will tear and resist shaping.',
        tip1: 'In a cold kitchen, extend warm-up to 2.5 hours.',
      },
      ball: {
        d1:   (n: number, grams: number) =>
                `Divide the warmed dough into ${n} portions of ${grams}g each on an unfloured surface.`,
        d2:   'Shape each into a tight ball. Place seam-side down in lightly oiled covered containers.',
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) => `Proof at room temperature (${minTemp}–${maxTemp}) for 60 minutes.`,
        d2:   'Use the poke test to confirm readiness.',
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for 60 minutes.`,
      },
    },
    // ── biga / room-temp ───────────────────────────────────────────────────────
    bgr: {
      bigaMix: {
        d1:   (flour: string, water: string, temp1: string, temp2: string) =>
                `In a bowl, combine ${flour}g flour, ${water}g cold water (${temp1}–${temp2}), and the trace yeast amount — this tiny amount is intentional; the biga ferments slowly and develops flavour over many hours.`,
        d2:   'Mix until just combined — the biga should be rough, shaggy, and crumbly. Do NOT over-mix or smooth it out; that would over-develop the gluten before fermentation.',
        d3:   'Cover loosely (not airtight — the biga needs to breathe) and ferment at 16–18°C / 61–64°F for 16–24 hours (target 18 hours).',
        d4:   'A wine cooler or a cool basement at this temperature is ideal. At room temperature (22°C+), reduce to 12–14 hours to prevent over-fermentation.',
        d5:   'Ready when: the biga has roughly doubled, shows a porous, honeycomb-like interior when broken apart, and smells pleasantly nutty and slightly tangy — not sour or alcoholic.',
        tip1: 'Temperature control is critical for biga. Too warm = excessive acid development, gummy crumb. Too cold = under-fermented, dense dough.',
        tip2: 'An over-fermented biga smells strongly alcoholic or very sour — discard and start again.',
      },
      mainMix: {
        d1:   'Tear the mature biga into rough chunks and place in a large mixing bowl.',
        d2:   (mainWater: string, reserved: string) =>
                `Add ${mainWater}g water (room temperature) and begin breaking down the biga with your hands or a dough hook — it will resist at first. Continue until mostly dissolved. Reserve ${reserved}g water for salt.`,
        d3:   (mainFlour: string) => `Add ${mainFlour}g flour in 2–3 additions, incorporating between each.`,
        d4:   (salt: string, water: string) => `Dissolve ${salt}g salt in ${water}g water.`,
        d5idy: (yeast: string) =>
                `Add ${yeast}g IDY to the dough, then pour in the salt water and fold to incorporate.`,
        d5ady: (yeast: string) =>
                `Dissolve ${yeast}g ADY in the reserved warm salt water, wait 10 minutes, then add to the dough.`,
        d6:   'Biga dough is stronger and more elastic than poolish dough — develop with 6–8 stretch-and-fold sets over 45 minutes until smooth and extensible.',
        d7:   (oil: string) => `Fold in ${oil}g olive oil after gluten is developed.`,
        tip1: 'If the biga is very stiff, adding the water first and letting it soak for 5 minutes before working helps enormously.',
      },
      ferment: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Cover and ferment at room temperature (${minTemp}–${maxTemp}) for ${hours} hours.`,
        d2:   'Perform 3–4 stretch-and-fold sets in the first 1.5 hours, then leave undisturbed.',
        d3:   'Dough is ready when it has grown 50–75% and feels airy.',
      },
      ball: {
        d1:   (n: number, grams: number) =>
                `Divide into ${n} portions of ${grams}g each. Shape into tight balls and place seam-side down in oiled containers.`,
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) => `Proof at ${minTemp}–${maxTemp} for 60 minutes. Use the poke test to confirm.`,
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for 60 minutes.`,
      },
    },
    // ── biga / cold ────────────────────────────────────────────────────────────
    bgc: {
      bigaMix: {
        d1:   (flour: string, water: string, temp: string) =>
                `Combine ${flour}g flour, ${water}g cold water (${temp}), and the trace yeast amount.`,
        d2:   'Mix until just combined — rough and shaggy is correct. Cover loosely and ferment at 16–18°C / 61–64°F for 18 hours.',
        d3:   'Ready when doubled, porous, and smelling nutty-yeasty (not alcoholic).',
        tip1: 'Biga is the most temperature-sensitive pre-ferment. A few degrees makes a significant difference.',
      },
      mainMix: {
        d1:   (mainWater: string, reserved: string, temp: string) =>
                `Tear biga into chunks. Add ${mainWater}g cold water (${temp}) and work until mostly dissolved. Reserve ${reserved}g for salt.`,
        d2:   (salt: string, water: string) => `Add salt water: ${salt}g salt dissolved in ${water}g cold water.`,
        d3idy: (yeast: string) => `Add ${yeast}g IDY and fold to incorporate.`,
        d3ady: (yeast: string, water: string) =>
                `Dissolve ${yeast}g ADY in the reserved ${water}g warm water, wait 10 min, add to dough.`,
        d4:   'Develop with 6–8 stretch-and-fold sets over 45 minutes.',
        d5:   (oil: string) => `Fold in ${oil}g olive oil at the end.`,
        tip1: 'Cold water prevents the dough warming up before it goes into the fridge.',
      },
      coldFerment: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Transfer dough to a sealed container and refrigerate at ${minTemp}–${maxTemp} for ${hours} hours.`,
        d2:   'The biga provides structure and strength; the cold fermentation builds deep flavour. Together they produce an exceptional crust.',
        tip1: 'Biga cold-fermented dough is very forgiving — it can easily handle 72h without over-proofing.',
      },
      warmUp: {
        d1:   'Remove from fridge and leave covered at room temperature for 2 hours before dividing.',
      },
      ball: {
        d1:   (n: number, grams: number) =>
                `Divide into ${n} × ${grams}g portions, shape into tight balls, and place seam-side down in oiled containers.`,
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) => `Proof at ${minTemp}–${maxTemp} for 60 minutes. Confirm with poke test.`,
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for 60 minutes.`,
      },
    },
    // ── sourdough / room-temp ──────────────────────────────────────────────────
    sdr: {
      feedStarter: {
        d1:   (existing: string, flour: string, water: string, temp: string) =>
                `Feed your starter at a 1:2:2 ratio — take ${existing}g existing starter, add ${flour}g bread flour and ${water}g water at ${temp}.`,
        d2:   'Mix thoroughly until no dry flour remains. Scrape the sides clean.',
        d3:   (minTemp: string, maxTemp: string) =>
                `Cover loosely (not airtight) and ferment at ${minTemp}–${maxTemp} for 8–12 hours until doubled, domed, and bubbly.`,
        d4:   (starterG: string) =>
                `Float test: drop a small spoonful of starter into water — if it floats, it is active and ready to use. You will need ${starterG}g for this recipe.`,
        tip1: 'Starter temperature is the key variable — warmer = faster rise. At 26°C, most starters double in 8–10 hours.',
        tip2: 'Use the starter at peak (fully domed, has not yet fallen) for maximum leavening power and flavour.',
      },
      autolyse: {
        d1:   (flour: string, water: string, temp: string) =>
                `Combine ${flour}g flour with ${water}g water at ${temp}. Mix until no dry flour remains.`,
        d2:   'Cover and rest 30–60 minutes. Longer autolyse = more extensible dough, less kneading needed.',
        tip1: 'For high-hydration sourdough pizza, 60 minutes autolyse is beneficial.',
      },
      addStarterSalt: {
        d1:   (starterG: string) =>
                `Confirm the starter passes the float test. Add ${starterG}g active starter to the autolysed dough.`,
        d2:   'Dimple the starter in and fold aggressively to incorporate — this takes 3–5 minutes. The dough will feel slack and shaggy at first; keep working.',
        d3:   'Rest 30 minutes.',
        d4:   (salt: string, water: string) =>
                `Dissolve ${salt}g salt in ${water}g water and add to the dough. Fold to incorporate fully.`,
        d5:   (oil: string) => `Add ${oil}g olive oil and fold in.`,
        tip1: 'Salt is added after the starter to avoid inhibiting the wild yeast.',
      },
      bulk: {
        d1:   (minTemp: string, maxTemp: string, hours: number) =>
                `Target dough temperature: ${minTemp}–${maxTemp}. Ferment at room temperature for ${hours} hours.`,
        d2:   'Perform 4 sets of stretch-and-folds (one every 30 minutes) for the first 2 hours: grab one side, stretch to maximum, fold over, rotate 90°, repeat 4 times per set.',
        d3:   'After the 4th set, leave the dough completely undisturbed for the remainder of bulk.',
        d4:   'Bulk is complete when the dough has grown 50–75%, the surface is domed with bubbles, and it feels airy and jiggly when the container is shaken.',
        tip1: 'Sourdough bulk is less predictable than commercial yeast — use visual and tactile cues (50–75% rise, jiggly feel) rather than the clock alone.',
        tip2: 'Under-fermented dough: dense, gummy pizza. Over-fermented dough: extensible but may collapse — use immediately.',
      },
      preShape: {
        d1:   (n: number, grams: number) =>
                `Gently turn the dough onto an unfloured surface. Divide into ${n} portions of ${grams}g each.`,
        d2:   'Pre-shape each into a loose round using a bench scraper — drag it toward you to build surface tension. Do not seal the seam.',
        d3:   'Leave uncovered on the bench for 30 minutes (bench rest). The gluten relaxes and makes final shaping much easier.',
        tip1: 'The bench rest is not optional — skipping it makes the dough tear during final shaping.',
      },
      finalShape: {
        d1:   'Shape each round into a tight ball with strong surface tension: fold the edges to the centre, flip, and drag on the surface to tighten.',
        d2:   'Place seam-side down in lightly floured or oiled containers. Cover.',
      },
      proof: {
        d1:   (minTemp: string, maxTemp: string) =>
                `Proof at room temperature (${minTemp}–${maxTemp}) for 60–75 minutes.`,
        d2:   'The balls should look visibly puffy and spring back slowly when poked.',
      },
      preheat: {
        d1:   (temp: string) => `Preheat with baking steel or stone to ${temp} for 60 minutes.`,
      },
    },
    // ── sourdough / cold ───────────────────────────────────────────────────────
    sdc: {
      feedStarter: {
        d1:   (existing: string, flour: string, water: string, temp: string) =>
                `Feed at 1:2:2 — ${existing}g starter, ${flour}g flour, ${water}g water at ${temp}.`,
        d2:   (minTemp: string, maxTemp: string) =>
                `Ferment at ${minTemp}–${maxTemp} for 8–12 hours until doubled and domed.`,
        d3:   (starterG: string) =>
                `You need ${starterG}g active starter. Float test: a small piece dropped in water should float.`,
        tip1: 'Feed the starter at least 8–12 hours before you plan to mix the dough.',
      },
      autolyse: {
        d1:   (flour: string, water: string, temp: string) =>
                `Combine ${flour}g flour with ${water}g water at ${temp}. Mix until no dry flour remains.`,
        d2:   'Cover and rest 30–60 minutes.',
      },
      addStarterSalt: {
        d1:   (starterG: string) =>
                `Add ${starterG}g active starter to the autolysed dough. Fold to incorporate fully — 3–5 minutes. Rest 30 minutes.`,
        d2:   (salt: string, water: string) =>
                `Dissolve ${salt}g salt in ${water}g water and fold into the dough.`,
        d3:   (oil: string) => `Fold in ${oil}g olive oil.`,
      },
      bulk: {
        d1:   (minTemp: string, maxTemp: string) =>
                `Ferment at ${minTemp}–${maxTemp} for 4.5 hours with 4 sets of stretch-and-folds (one every 30 minutes for the first 2 hours).`,
        d2:   'Bulk is complete when the dough has grown 50–75%, is bubbly, domed, and jiggly.',
        d3:   'This is a partial bulk — the dough will continue developing slowly in the cold proof.',
        tip1: 'For cold-proofed sourdough, stop bulk slightly earlier (40–50% rise) to prevent over-proofing during the long cold ferment.',
      },
      preShape: {
        d1:   (n: number, grams: number) =>
                `Divide into ${n} portions of ${grams}g each. Pre-shape loosely into rounds. Bench rest uncovered 25–30 minutes.`,
      },
      shapeColdProof: {
        d1:   'Shape each ball tightly with strong surface tension. Place into individual floured containers (or a floured tray covered tightly with plastic).',
        d2:   (minTemp: string, maxTemp: string, hours: number) =>
                `Refrigerate immediately at ${minTemp}–${maxTemp} for ${hours} hours.`,
        d3:   'The cold proof continues fermentation very slowly while the long rest develops flavour, extensibility, and a more open crumb.',
        d4:   'The dough will look unchanged or barely risen — that is normal. The fermentation is complete inside.',
        tip1: 'Sourdough cold-proofed balls are very extensible — they stretch beautifully straight from the fridge.',
        tip2: 'You can safely extend the cold proof by 12–24 hours without significant over-proofing risk.',
      },
      preheat: {
        d1:   (temp: string) =>
                `Remove dough balls from the fridge and preheat the oven to ${temp} with baking steel or stone inside for 60 minutes.`,
        d2:   'Cold-proofed sourdough can be stretched directly from the fridge — the cold makes it easier to handle. Or rest 30–45 minutes at room temperature first for more extensibility.',
      },
    },
  } as unknown as import('./types').RecipeI18n,
};
