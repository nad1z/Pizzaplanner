export type DoughMethodId = 'straight' | 'poolish' | 'biga' | 'sourdough';
export type FermentationMode = 'room_temp' | 'cold';

export interface DoughMethodConfig {
  name: string;
  emoji: string;
  description: string;
  isAdvanced: boolean;
  usesStarter: boolean;
  preFermentFlourPercent: number;
  preFermentHydrationPercent: number;
  preFermentTempCMin: number;
  preFermentTempCMax: number;
  preFermentTempCRecommended: number;
  preFermentHoursMin: number;
  preFermentHoursMax: number;
  preFermentHoursTypical: number;
}

export const DOUGH_METHODS: Record<DoughMethodId, DoughMethodConfig> = {
  straight: {
    name: 'Straight Dough',
    emoji: '⚡',
    description: 'All ingredients mixed at once — simple, reliable, and great for same-day pizza.',
    isAdvanced: false,
    usesStarter: false,
    preFermentFlourPercent: 0,
    preFermentHydrationPercent: 0,
    preFermentTempCMin: 22,
    preFermentTempCMax: 24,
    preFermentTempCRecommended: 23,
    preFermentHoursMin: 0,
    preFermentHoursMax: 0,
    preFermentHoursTypical: 0,
  },
  poolish: {
    name: 'Poolish',
    emoji: '🌊',
    description: 'A liquid pre-ferment (50% flour, 100% hydration) that develops exceptional flavour, extensibility, and a light open crumb.',
    isAdvanced: true,
    usesStarter: false,
    preFermentFlourPercent: 50,
    preFermentHydrationPercent: 100,
    preFermentTempCMin: 18,
    preFermentTempCMax: 22,
    preFermentTempCRecommended: 20,
    preFermentHoursMin: 12,
    preFermentHoursMax: 16,
    preFermentHoursTypical: 14,
  },
  biga: {
    name: 'Biga',
    emoji: '🏔️',
    description: 'A stiff Italian pre-ferment (40% flour, 45% hydration) that builds strength, structure, and a complex nutty flavour.',
    isAdvanced: true,
    usesStarter: false,
    preFermentFlourPercent: 40,
    preFermentHydrationPercent: 45,
    preFermentTempCMin: 16,
    preFermentTempCMax: 18,
    preFermentTempCRecommended: 17,
    preFermentHoursMin: 16,
    preFermentHoursMax: 24,
    preFermentHoursTypical: 18,
  },
  sourdough: {
    name: 'Sourdough',
    emoji: '🦠',
    description: 'Wild yeast and lactic acid bacteria from a natural starter — unmatched depth of flavour, chewy texture, and natural tang.',
    isAdvanced: true,
    usesStarter: true,
    preFermentFlourPercent: 20,
    preFermentHydrationPercent: 100,
    preFermentTempCMin: 24,
    preFermentTempCMax: 28,
    preFermentTempCRecommended: 26,
    preFermentHoursMin: 8,
    preFermentHoursMax: 12,
    preFermentHoursTypical: 10,
  },
};

export const STRAIGHT_TIME_OPTIONS = [4, 6, 8] as const;
export const ADVANCED_TIME_OPTIONS_ROOM_TEMP = [4, 6, 8] as const;
export const ADVANCED_TIME_OPTIONS_COLD = [24, 48, 72] as const;
