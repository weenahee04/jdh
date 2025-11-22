
export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum VisualVariant {
  BASIC = 'BASIC',
  TEXTURED = 'TEXTURED',
  HOLOGRAPHIC = 'HOLOGRAPHIC',
  ANIMATED = 'ANIMATED',
}

export interface MasterDhammaCard {
  id: string;
  term: string;
  meaning: string;
  details: string;
  category: string;
  teaching: string;
  rarity: Rarity;
}

export interface DhammaCard extends MasterDhammaCard {
  instanceId: string; // Unique ID for the specific card instance in inventory
  acquiredAt: number;
  serialNumber: string;
  visualVariant: VisualVariant;
}

export interface MarketItem extends DhammaCard {
  price: number;
  sellerName: string;
  isMine: boolean;
  listedAt: number;
}

export interface UserState {
  points: number;
  inventory: DhammaCard[];
}

// New Interface for LINE User
export interface UserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export type Tab = 'HOME' | 'GACHA' | 'COLLECTION' | 'MARKET' | 'WALLET';

// Economy Constants
export const GACHA_COST = 5000;

export const SELL_VALUES = {
  [Rarity.COMMON]: 1000,
  [Rarity.RARE]: 10000,
  [Rarity.EPIC]: 100000,
  [Rarity.LEGENDARY]: 2000000,
};

export const VARIANT_MULTIPLIERS = {
  [VisualVariant.BASIC]: 1,
  [VisualVariant.TEXTURED]: 1.5,
  [VisualVariant.ANIMATED]: 2.0,
  [VisualVariant.HOLOGRAPHIC]: 3.0,
};

export const DROP_RATES = {
  [Rarity.COMMON]: 60,
  [Rarity.RARE]: 30,
  [Rarity.EPIC]: 9,
  [Rarity.LEGENDARY]: 1,
};
