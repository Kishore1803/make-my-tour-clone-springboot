import type { AxiosInstance } from "axios";

export function getCurrentPrice(
  type: "FLIGHT" | "HOTEL",
  itemId: number,
  userId?: number | null,
): Promise<any>;

export function getPriceHistory(
  type: "FLIGHT" | "HOTEL",
  itemId: number,
): Promise<any[]>;

export function freezePrice(
  type: "FLIGHT" | "HOTEL",
  itemId: number,
  userId: number,
): Promise<any>;

export function getPriceFreeze(freezeId: number): Promise<any>;

export function updatePricing(
  type: "FLIGHT" | "HOTEL",
  itemId: number,
  pricing: {
    basePrice: number;
    demandAdjustment: number;
    seasonalAdjustment: number;
    holiday: boolean;
  },
): Promise<any>;

declare const pricingApi: AxiosInstance;

export default pricingApi;
