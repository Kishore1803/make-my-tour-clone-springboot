type ItemType = "FLIGHT" | "HOTEL";

export function getCurrentPrice(
  type: ItemType,
  itemId: number,
  userId: number | null,
): Promise<any>;

export function getPriceHistory(type: ItemType, itemId: number): Promise<any[]>;

export function freezePrice(
  type: ItemType,
  itemId: number,
  userId: number,
): Promise<any>;

export function getPriceFreeze(freezeId: number): Promise<any>;

export function updatePricing(
  type: ItemType,
  itemId: number,
  pricing: {
    basePrice: number;
    demandAdjustment: number;
    seasonalAdjustment: number;
    holiday: boolean;
  },
): Promise<any>;

declare const pricingApi: import("axios").AxiosInstance;

export default pricingApi;
