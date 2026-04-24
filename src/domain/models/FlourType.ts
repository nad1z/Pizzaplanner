export interface FlourData {
  name: string;
  brand: string;
  type: string;
  protein: string;
  protein_value: number;
  strength_w: string;
  w_value: number;
  hydration: string;
  hydration_default: number;
  hydration_max: number;
  hydration_min: number;
  fermentation_hours: string;
  fermentation_min: number;
  fermentation_max: number;
  fermentation_type: string[];
  description: string;
  recommended_styles: string[];
  secondary_styles: string[];
  not_ideal_for: string[];
  style_scores: Record<string, number>;
}

export const FLOURS: FlourData[] = [
  {
    name: 'Caputo Pizzeria 00',
    brand: 'Caputo',
    type: '00',
    protein: '12.5%',
    protein_value: 12.5,
    strength_w: 'W260–280',
    w_value: 270,
    hydration: '55–65%',
    hydration_default: 60,
    hydration_max: 65,
    hydration_min: 55,
    fermentation_hours: '8–24',
    fermentation_min: 8,
    fermentation_max: 24,
    fermentation_type: ['room_temp', 'short_cold'],
    description: 'Classic Neapolitan pizza flour with balanced elasticity.',
    recommended_styles: ['Neapolitan'],
    secondary_styles: ['Roman', 'New York'],
    not_ideal_for: ['Detroit', 'Sicilian'],
    style_scores: { Neapolitan: 5, 'New York': 3, Roman: 3, Brooklyn: 2, Detroit: 1, Sicilian: 1 },
  },
  {
    name: 'Caputo Nuvola',
    brand: 'Caputo',
    type: '0',
    protein: '12.5%',
    protein_value: 12.5,
    strength_w: 'W270–310',
    w_value: 290,
    hydration: '65–75%',
    hydration_default: 70,
    hydration_max: 75,
    hydration_min: 65,
    fermentation_hours: '24–72',
    fermentation_min: 24,
    fermentation_max: 72,
    fermentation_type: ['cold_ferment', 'room_temp'],
    description: 'High hydration flour for airy, open crumb pizza.',
    recommended_styles: ['Neapolitan'],
    secondary_styles: ['Roman'],
    not_ideal_for: ['Detroit'],
    style_scores: { Neapolitan: 5, 'New York': 3, Roman: 4, Brooklyn: 3, Detroit: 2, Sicilian: 2 },
  },
  {
    name: 'Caputo Manitoba Oro',
    brand: 'Caputo',
    type: '0',
    protein: '14.5%',
    protein_value: 14.5,
    strength_w: 'W350–400',
    w_value: 370,
    hydration: '70–80%',
    hydration_default: 72,
    hydration_max: 80,
    hydration_min: 70,
    fermentation_hours: '48–96',
    fermentation_min: 48,
    fermentation_max: 96,
    fermentation_type: ['long_cold'],
    description: 'Very strong flour for long fermentation and high hydration.',
    recommended_styles: ['New York', 'Detroit', 'Sicilian'],
    secondary_styles: ['Roman'],
    not_ideal_for: ['Neapolitan'],
    style_scores: { Neapolitan: 1, 'New York': 5, Roman: 4, Brooklyn: 4, Detroit: 5, Sicilian: 5 },
  },
  {
    name: 'Pivetti Tipo 00',
    brand: 'Pivetti',
    type: '00',
    protein: '12%',
    protein_value: 12,
    strength_w: 'W240–280',
    w_value: 260,
    hydration: '55–65%',
    hydration_default: 60,
    hydration_max: 65,
    hydration_min: 55,
    fermentation_hours: '12–36',
    fermentation_min: 12,
    fermentation_max: 36,
    fermentation_type: ['room_temp', 'cold_ferment'],
    description: 'Balanced Italian flour for classic pizza dough.',
    recommended_styles: ['Neapolitan', 'Roman'],
    secondary_styles: ['New York'],
    not_ideal_for: ['Detroit'],
    style_scores: { Neapolitan: 5, 'New York': 3, Roman: 4, Brooklyn: 3, Detroit: 1, Sicilian: 2 },
  },
  {
    name: 'Shtybel 2 Bread Flour',
    brand: 'Shtybel',
    type: 'Bread Flour',
    protein: '12%',
    protein_value: 12,
    strength_w: 'W260–300',
    w_value: 280,
    hydration: '60–70%',
    hydration_default: 65,
    hydration_max: 70,
    hydration_min: 60,
    fermentation_hours: '12–48',
    fermentation_min: 12,
    fermentation_max: 48,
    fermentation_type: ['room_temp', 'cold_ferment'],
    description: 'Versatile bread flour commonly used for NY-style pizza.',
    recommended_styles: ['New York', 'Brooklyn'],
    secondary_styles: ['Sicilian'],
    not_ideal_for: ['Neapolitan'],
    style_scores: { Neapolitan: 2, 'New York': 5, Roman: 3, Brooklyn: 5, Detroit: 4, Sicilian: 4 },
  },
];
