import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "delay" | "boarding" | "info";
}

interface NotificationBellProps {
  notifications?: Notification[];
}

const NotificationBell = ({ notifications = [] }: NotificationBellProps) => {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {open && (
        <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold text-gray-800">Notifications</h3>

            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                {unreadCount} update{unreadCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b px-4 py-3 transition hover:bg-gray-50"
                >
                  <div className="flex gap-3">
                    <div
                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                        notification.type === "delay"
                          ? "bg-red-500"
                          : notification.type === "boarding"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
