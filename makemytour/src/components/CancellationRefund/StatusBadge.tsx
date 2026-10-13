"use client";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const normalizedStatus = status.trim().toUpperCase();

  const statusStyles: Record<string, string> = {
    BOOKED: "bg-blue-100 text-blue-700 ring-blue-200",
    CANCELLED: "bg-gray-100 text-gray-700 ring-gray-200",
    REFUND_PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
    PENDING: "bg-amber-100 text-amber-700 ring-amber-200",
    PROCESSING: "bg-blue-100 text-blue-700 ring-blue-200",
    COMPLETED: "bg-green-100 text-green-700 ring-green-200",
    FAILED: "bg-red-100 text-red-700 ring-red-200",
    NOT_APPLICABLE: "bg-gray-100 text-gray-600 ring-gray-200",
  };

  const badgeStyle =
    statusStyles[normalizedStatus] ?? "bg-gray-100 text-gray-700 ring-gray-200";

  const label = normalizedStatus
    ? normalizedStatus.replaceAll("_", " ")
    : "UNKNOWN";

  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${badgeStyle} ${className}`}
    >
      {label}
    </span>
  );
}
