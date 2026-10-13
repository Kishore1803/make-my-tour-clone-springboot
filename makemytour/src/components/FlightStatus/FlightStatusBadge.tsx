"use client";

type FlightStatusType =
  | "ON_TIME"
  | "BOARDING"
  | "DELAYED"
  | "DEPARTED"
  | "IN_AIR"
  | "ARRIVED"
  | "CANCELLED";

interface FlightStatusBadgeProps {
  status: FlightStatusType | string;
}

const statusStyles: Record<
  FlightStatusType,
  { label: string; style: string; dot: string }
> = {
  ON_TIME: {
    label: "On Time",
    style: "bg-green-100 text-green-700 ring-green-200",
    dot: "bg-green-500",
  },
  BOARDING: {
    label: "Boarding",
    style: "bg-blue-100 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
  },
  DELAYED: {
    label: "Delayed",
    style: "bg-orange-100 text-orange-700 ring-orange-200",
    dot: "bg-orange-500",
  },
  DEPARTED: {
    label: "Departed",
    style: "bg-indigo-100 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
  },
  IN_AIR: {
    label: "In Air",
    style: "bg-sky-100 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
  },
  ARRIVED: {
    label: "Arrived",
    style: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Cancelled",
    style: "bg-red-100 text-red-700 ring-red-200",
    dot: "bg-red-500",
  },
};

export default function FlightStatusBadge({ status }: FlightStatusBadgeProps) {
  const normalizedStatus = String(status || "")
    .trim()
    .toUpperCase();

  const currentStatus = statusStyles[normalizedStatus as FlightStatusType] ?? {
    label: normalizedStatus || "Unknown",
    style: "bg-gray-100 text-gray-700 ring-gray-200",
    dot: "bg-gray-500",
  };

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${currentStatus.style}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${currentStatus.dot}`}
        aria-hidden="true"
      />
      {currentStatus.label}
    </span>
  );
}
