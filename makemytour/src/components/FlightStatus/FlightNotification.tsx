
"use client";

export type FlightNotificationType =
  | "DELAY"
  | "DEPARTURE_CHANGE"
  | "ARRIVAL_CHANGE"
  | "BOARDING"
  | "GATE_CHANGE"
  | "CANCELLATION";

export interface FlightNotificationData {
  id: string;
  flightId: number;
  flightNumber: string;
  type: FlightNotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface FlightNotificationProps {
  notifications: FlightNotificationData[];
  onMarkRead?: (id: string) => void;
  onClear?: () => void;
}

export default function FlightNotification({
  notifications,
  onMarkRead,
  onClear,
}: FlightNotificationProps) {
  const getIcon = (type: FlightNotificationType) => {
    switch (type) {
      case "DELAY":
        return "⚠️";
      case "DEPARTURE_CHANGE":
        return "🛫";
      case "ARRIVAL_CHANGE":
        return "🛬";
      case "BOARDING":
        return "🎫";
      case "GATE_CHANGE":
        return "🚪";
      case "CANCELLATION":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Flight Notifications
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.filter((item) => !item.read).length} unread
            notification(s)
          </p>
        </div>

        {notifications.length > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No notifications yet. Flight updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-lg border p-3 ${
                notification.read
                  ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                  : "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">
                  {getIcon(notification.type)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>

                    {!notification.read && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                        New
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Flight {notification.flightNumber} ·{" "}
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>

                  {!notification.read && onMarkRead && (
                    <button
                      type="button"
                      onClick={() => onMarkRead(notification.id)}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
