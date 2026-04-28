export type PizzaStyleId =
  | 'neapolitan'
  | 'neonapolitan'
  | 'newyork'
  | 'roman'
  | 'brooklyn'
  | 'detroit'
  | 'sicilian'
  | 'focaccia';

export interface HydrationRange {
  min: number;
  max: number;
  recommended: number;
}

export interface WeightRange {
  min: number;
  max: number;
}

export interface PizzaStyleConfig {
  name: string;
  emoji: string;
  hydration: HydrationRange;
  ballWeight: WeightRange;
  saltPercent: number;
  oilPercent: number;
  description: string;
}

export class PizzaStyle {
  readonly name: string;
  readonly emoji: string;
  readonly hydration: HydrationRange;
  readonly ballWeight: WeightRange;
  readonly saltPercent: number;
  readonly oilPercent: number;
  readonly description: string;

  constructor(config: PizzaStyleConfig) {
    this.name = config.name;
    this.emoji = config.emoji;
    this.hydration = config.hydration;
    this.ballWeight = config.ballWeight;
    this.saltPercent = config.saltPercent;
    this.oilPercent = config.oilPercent;
    this.description = config.description;
  }

  static readonly STYLES: Record<PizzaStyleId, PizzaStyle> = {
    neapolitan:    new PizzaStyle({ name: 'Neapolitan',     emoji: '🇮🇹', hydration: { min: 58, max: 65, recommended: 62 }, ballWeight: { min: 200, max: 280 }, saltPercent: 2.8, oilPercent: 0,   description: 'Thin, soft, charred crust from a wood-fired oven' }),
    neonapolitan:  new PizzaStyle({ name: 'Neo Neapolitan', emoji: '🔥',  hydration: { min: 68, max: 82, recommended: 74 }, ballWeight: { min: 230, max: 300 }, saltPercent: 2.5, oilPercent: 0,   description: 'Contemporary high-hydration Neapolitan — open crumb, airy cornicione, leopard-spotted crust' }),
    newyork:       new PizzaStyle({ name: 'New York',       emoji: '🗽',  hydration: { min: 58, max: 65, recommended: 62 }, ballWeight: { min: 180, max: 280 }, saltPercent: 2.0, oilPercent: 2,   description: 'Large foldable slices, crispy yet chewy crust' }),
    roman:         new PizzaStyle({ name: 'Roman',          emoji: '🏛️', hydration: { min: 70, max: 85, recommended: 78 }, ballWeight: { min: 200, max: 550 }, saltPercent: 2.5, oilPercent: 3,   description: 'High-hydration focaccia-style baked in a tray' }),
    brooklyn:      new PizzaStyle({ name: 'Brooklyn',       emoji: '🌉', hydration: { min: 60, max: 68, recommended: 64 }, ballWeight: { min: 220, max: 300 }, saltPercent: 2.0, oilPercent: 1.5, description: 'Thicker than NY, crispy bottom, chewier edge' }),
    detroit:       new PizzaStyle({ name: 'Detroit',        emoji: '🏭', hydration: { min: 65, max: 75, recommended: 70 }, ballWeight: { min: 400, max: 600 }, saltPercent: 2.0, oilPercent: 2,   description: 'Deep dish, crispy laced cheese edges, airy crumb' }),
    sicilian:      new PizzaStyle({ name: 'Sicilian',       emoji: '🌊', hydration: { min: 65, max: 72,  recommended: 68 }, ballWeight: { min: 200,  max: 600  }, saltPercent: 2.2, oilPercent: 3,   description: 'Thick, spongy square slices with a crispy base' }),
    focaccia:      new PizzaStyle({ name: 'Focaccia',       emoji: '🫒', hydration: { min: 70, max: 100, recommended: 80 }, ballWeight: { min: 200,  max: 800  }, saltPercent: 2.2, oilPercent: 5,   description: 'Ligurian-style flatbread — olive-oil rich, airy crumb, dimpled and golden crust' }),
  };
}
