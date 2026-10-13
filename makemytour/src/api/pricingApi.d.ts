import type {
  ItemType,
  PriceResponse,
  PriceHistoryPoint,
  PriceFreezeResponse,
  PricingUpdateRequest,
} from "@/types/pricing";

export function getCurrentPrice(
  type: ItemType,
  itemId: number,
  userId?: number | null,
): Promise<PriceResponse>;

export function getPriceHistory(
  type: ItemType,
  itemId: number,
): Promise<PriceHistoryPoint[]>;

export function freezePrice(
  type: ItemType,
  itemId: number,
  userId: number,
): Promise<PriceFreezeResponse>;

export function getPriceFreeze(freezeId: number): Promise<PriceFreezeResponse>;

export function updatePricing(
  type: ItemType,
  itemId: number,
  pricing: PricingUpdateRequest,
): Promise<PriceResponse>;

declare const pricingApi: import("axios").AxiosInstance;

export default pricingApi;
