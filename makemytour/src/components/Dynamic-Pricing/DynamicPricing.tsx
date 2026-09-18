"use client";

import { useEffect, useState } from "react";

import DynamicPriceCard from "./DynamicPriceCard";
import PriceHistoryCard from "./PriceHistoryCard";
import PriceFreezeCard from "./PriceFreezeCard";

import {
  getFlightDynamicPrice,
  getHotelDynamicPrice,
  getFlightPriceHistory,
  getHotelPriceHistory,
  freezeFlightPrice,
  freezeHotelPrice,
  getFlightFreeze,
  getHotelFreeze,
} from "@/api/Pricing-api";

interface DynamicPricingProps {
  type: "flight" | "hotel";
  itemId: number;
  userId: number;
  basePrice: number;
  availableCount: number;
}

interface PriceHistory {
  id: number;
  basePrice: number;
  dynamicPrice: number;
  changePercentage: number;
  reason: string;
  createdAt: string;
}

interface PriceFreeze {
  id: number;
  userId: number;
  flightId?: number;
  hotelId?: number;
  frozenPrice: number;
  createdAt: string;
  expiresAt: string;
  status: string;
}

const DynamicPricing = ({
  type,
  itemId,
  userId,
  basePrice,
  availableCount,
}: DynamicPricingProps) => {
  const [currentPrice, setCurrentPrice] = useState<number>(basePrice);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [priceFreeze, setPriceFreeze] = useState<PriceFreeze | null>(null);
  const [loading, setLoading] = useState(true);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Pricing Data
  const loadPricingData = async () => {
    try {
      setLoading(true);
      setError("");

      let priceResponse;
      let historyResponse;
      let freezeResponse;

      if (type === "flight") {
        priceResponse = await getFlightDynamicPrice(
          itemId,
          basePrice,
          availableCount,
        );
        historyResponse = await getFlightPriceHistory(itemId);

        try {
          freezeResponse = await getFlightFreeze(userId, itemId);
        } catch {
          freezeResponse = null;
        }
      } else {
        priceResponse = await getHotelDynamicPrice(
          itemId,
          basePrice,
          availableCount,
        );
        historyResponse = await getHotelPriceHistory(itemId);

        try {
          freezeResponse = await getHotelFreeze(userId, itemId);
        } catch {
          freezeResponse = null;
        }
      }

      setCurrentPrice(Number(priceResponse.data));
      setPriceHistory(Array.isArray(historyResponse.data) ? historyResponse.data : [],);

      if (freezeResponse && freezeResponse.data) {
        setPriceFreeze(freezeResponse.data);
      } else {
        setPriceFreeze(null);
      }
    } catch (error) {
      console.error("Error loading pricing:", error);
      setError("Unable to load dynamic pricing.");
    } finally {
      setLoading(false);
    }
  };

  // Load Data
  useEffect(() => {
    if (!itemId || !userId) {
      return;
    }

    loadPricingData();
  }, [itemId, userId, type, basePrice, availableCount]);

  // Freeze Price
  const handleFreezePrice = async () => {
    try {
      setFreezeLoading(true);
      const freezeMinutes = 30;
      let response;

      if (type === "flight") {
        response = await freezeFlightPrice(
          userId,
          itemId,
          currentPrice,
          freezeMinutes,
        );
      } else {
        response = await freezeHotelPrice(
          userId,
          itemId,
          currentPrice,
          freezeMinutes,
        );
      }
      setPriceFreeze(response.data);
      alert("Price has been frozen successfully!");

    } catch (error) {
      console.error("Error freezing price:", error);
      alert("Unable to freeze the price.");
    } finally {
      setFreezeLoading(false);
    }
  };

  // Calculate Percentage
  const changePercentage = basePrice > 0
      ? Number((((currentPrice - basePrice) / basePrice) * 100).toFixed(2))
      : 0;

  // Get Latest Reason
  const latestHistory = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1] : null;
  const reason = latestHistory?.reason || "Normal pricing";

  // Loading
  if (loading) {
    return (
      <div className="space-y-6">
        <DynamicPriceCard
          type={type}
          basePrice={basePrice}
          currentPrice={basePrice}
          loading={true}
        />
        <PriceHistoryCard type={type} history={[]} loading={true} />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <p className="font-semibold text-red-700">{error}</p>
        <button
          type="button"
          onClick={loadPricingData}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // UI
  return (
    <section className="space-y-6">
      {/* Dynamic Price */}
      <DynamicPriceCard
        type={type}
        basePrice={basePrice}
        currentPrice={currentPrice}
        changePercentage={changePercentage}
        reason={reason}
        onFreeze={priceFreeze?.status === "ACTIVE" ? undefined : handleFreezePrice}
        freezeLoading={freezeLoading}
        isFrozen={priceFreeze?.status === "ACTIVE"}
      />

      {/* Price History */}
      <PriceHistoryCard type={type} history={priceHistory} />

      {/* Price Freeze */}
      {priceFreeze && (
        <PriceFreezeCard
          type={type}
          frozenPrice={priceFreeze.frozenPrice}
          createdAt={priceFreeze.createdAt}
          expiresAt={priceFreeze.expiresAt}
          status={priceFreeze.status}
          onFreeze={priceFreeze.status !== "ACTIVE" ? handleFreezePrice : undefined}
          loading={freezeLoading}
        />
      )}
    </section>
  );
};

export default DynamicPricing;
