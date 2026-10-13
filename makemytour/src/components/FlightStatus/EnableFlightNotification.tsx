"use client";

import { useState } from "react";
import { enableFlightPushNotifications } from "@/lib/pushNotification";

export default function EnableFlightNotifications() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEnable() {
    try {
      setLoading(true);
      setMessage("");

      const result = await enableFlightPushNotifications();
      setMessage(result);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not enable notifications.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEnable}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Enabling..." : "Enable Flight Push Notifications"}
      </button>

      {message && (
        <p className="text-sm text-gray-600" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
