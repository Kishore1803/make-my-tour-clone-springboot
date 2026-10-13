"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TrackedFlight } from "./TrackedFlights";
import type { FlightNotificationData } from "./FlightNotification";

const TRACKED_KEY = "makemytour-tracked-flights";
const NOTIFICATIONS_KEY = "makemytour-flight-notifications";
const SNAPSHOT_KEY = "makemytour-flight-snapshot";

type FlightUpdate = TrackedFlight;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function useFlightStatusFeatures() {
  const [trackedFlights, setTrackedFlights] = useState<TrackedFlight[]>([]);
  const [notifications, setNotifications] = useState<FlightNotificationData[]>(
    [],
  );

  const previousFlights = useRef<Record<string, FlightUpdate>>({});
  const initialized = useRef(false);

  useEffect(() => {
    setTrackedFlights(readStorage<TrackedFlight[]>(TRACKED_KEY, []));
    setNotifications(
      readStorage<FlightNotificationData[]>(NOTIFICATIONS_KEY, []),
    );

    previousFlights.current = readStorage<Record<string, FlightUpdate>>(
      SNAPSHOT_KEY,
      {},
    );

    initialized.current = true;
  }, []);

  useEffect(() => {
    localStorage.setItem(TRACKED_KEY, JSON.stringify(trackedFlights));
  }, [trackedFlights]);

  useEffect(() => {
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify(notifications.slice(0, 100)),
    );
  }, [notifications]);

  const addNotification = useCallback(
    (
      flight: FlightUpdate,
      type: FlightNotificationData["type"],
      title: string,
      message: string,
    ) => {
      const notification: FlightNotificationData = {
        id: `${flight.flightNumber}-${type}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        flightId:  Number(flight.id),
        flightNumber: flight.flightNumber,
        type,
        title,
        message,
        createdAt: new Date().toISOString(),
        read: false,
      };

      setNotifications((current) => [notification, ...current].slice(0, 100));

      // This is a foreground fallback. Actual background Web Push is handled
      // by the service worker and backend subscription.
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification(title, {
            body: message,
            tag: `${flight.flightNumber}-${type}`,
          });
        } catch {
          // The backend Web Push path remains available.
        }
      }
    },
    [],
  );

  const trackFlight = useCallback(
    (flight: TrackedFlight) => {
      setTrackedFlights((current) => {
        if (current.some((item) => item.flightNumber === flight.flightNumber)) {
          return current;
        }

        return [...current, flight];
      });

      addNotification(
        flight,
        "DEPARTURE_CHANGE",
        "Flight added",
        `${flight.flightNumber} was added to your tracked flights.`,
      );
    },
    [addNotification],
  );

  const removeTrackedFlight = useCallback((flightId: string | number) => {
    setTrackedFlights((current) =>
      current.filter((flight) => String(flight.id) !== String(flightId)),
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const processFlightUpdates = useCallback(
    (incomingFlights: FlightUpdate[]) => {
      if (!initialized.current) return;

      const nextSnapshot = { ...previousFlights.current };

      for (const flight of incomingFlights) {
        const key = flight.flightNumber.toUpperCase();
        const old = previousFlights.current[key];
        nextSnapshot[key] = flight;

        // Establish a baseline for flights that have never been seen.
        if (!old) continue;

        if (old.status !== flight.status) {
          if (flight.status === "DELAYED") {
            addNotification(
              flight,
              "DELAY",
              "Flight delayed",
              `${flight.flightNumber} is delayed${
                flight.delayMinutes ? ` by ${flight.delayMinutes} minutes` : ""
              }.${flight.delayReason ? ` Reason: ${flight.delayReason}` : ""}`,
            );
          } else if (flight.status === "BOARDING") {
            addNotification(
              flight,
              "BOARDING",
              "Boarding started",
              `${flight.flightNumber} is now boarding.`,
            );
          } else if (flight.status === "CANCELLED") {
            addNotification(
              flight,
              "CANCELLATION",
              "Flight cancelled",
              `${flight.flightNumber} has been cancelled.`,
            );
          } else {
            addNotification(
              flight,
              "DEPARTURE_CHANGE",
              "Flight status changed",
              `${flight.flightNumber}: ${old.status} → ${flight.status}.`,
            );
          }
        }

        if (
          old.revisedDeparture !== flight.revisedDeparture &&
          flight.revisedDeparture
        ) {
          addNotification(
            flight,
            "DEPARTURE_CHANGE",
            "Departure time changed",
            `${flight.flightNumber} revised departure: ${flight.revisedDeparture}.`,
          );
        }

        if (
          old.estimatedArrival !== flight.estimatedArrival &&
          flight.estimatedArrival
        ) {
          addNotification(
            flight,
            "ARRIVAL_CHANGE",
            "Arrival time updated",
            `${flight.flightNumber} estimated arrival: ${flight.estimatedArrival}.`,
          );
        }

        if (old.gate !== flight.gate && flight.gate) {
          addNotification(
            flight,
            "GATE_CHANGE",
            "Gate changed",
            `${flight.flightNumber} gate: ${flight.gate}.`,
          );
        }
      }

      previousFlights.current = nextSnapshot;
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(nextSnapshot));
    },
    [addNotification],
  );

  return {
    trackedFlights,
    notifications,
    trackFlight,
    removeTrackedFlight,
    markNotificationRead,
    clearNotifications,
    processFlightUpdates,
  };
}
