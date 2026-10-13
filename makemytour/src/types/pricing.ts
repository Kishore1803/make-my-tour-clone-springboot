export type ItemType = "FLIGHT" | "HOTEL";

export interface PriceResponse {
  itemType: ItemType;
  itemId: number;
  basePrice: number;
  demandAmount: number;
  seasonalAmount: number;
  holidayAmount: number;
  finalPrice: number;
  frozen: boolean;
  updatedAt: string | null;
}

export interface PriceHistoryPoint {
  basePrice: number;
  finalPrice: number;
  recordedAt: string;
}

export interface PriceFreezeResponse {
  freezeId: number;
  lockedPrice: number;
  expiresAt: string;
  status: "ACTIVE" | "EXPIRED" | "USED";
}
