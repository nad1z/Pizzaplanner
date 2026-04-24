export type YeastTypeId = 'idy' | 'ady' | 'sourdough';

export interface YeastConfig {
  name: string;
  description: string;
  flourPercent: number;
}

export const YEAST_TYPES: Record<YeastTypeId, YeastConfig> = {
  idy:       { name: 'Instant Dry',  description: 'Mix directly into flour',       flourPercent: 0.3  },
  ady:       { name: 'Active Dry',   description: 'Dissolve in warm water first',  flourPercent: 0.4  },
  sourdough: { name: 'Sourdough',    description: 'Natural starter, 20% of flour', flourPercent: 20   },
};
