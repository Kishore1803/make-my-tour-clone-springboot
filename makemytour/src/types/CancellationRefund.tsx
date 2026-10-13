// Booking Types
export type BookingType =
  | "FLIGHT"
  | "HOTEL"
  | "BUS"
  | "TRAIN"
  | "OTHER";

export type CancellationStatus =
  | "BOOKED"
  | "CANCELLED"
  | "REFUND_PENDING";

export type RefundStatus =
  | "NOT_APPLICABLE"
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// Booking Details
export interface BookingDetails {
  bookingId: number;
  type: BookingType | string;
  date: string;
  quantity: number;
  totalPrice: number;
  bookedAt: string;
  selectedSeat?: string;
  cancellationStatus?: CancellationStatus | string;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: RefundStatus | string;
}

// Cancellation
export interface Cancellation {
  id: number;
  userId: number;
  bookingId: number;
  bookingType: BookingType | string;
  reason: string;
  bookingAmount: number;
  refundPercentage: number;
  refundAmount: number;
  cancelledAt: string;
  status: CancellationStatus | string;
}

// Refund
export interface Refund {
  id: number;
  userId: number;
  bookingId: number;
  bookingType: BookingType | string;
  bookingAmount: number;
  refundAmount: number;
  refundPercentage: number;
  refundStatus: RefundStatus | string;
  expectedTimeline: string;
  requestedAt: string;
  completedAt?: string | null;
}

// Cancellation Request
export interface CancelBookingRequest {
  userId: number;
  bookingId: number;
  bookingType: BookingType;
  reason: string;
}

// API Error
export interface ApiError {
  message: string;
}