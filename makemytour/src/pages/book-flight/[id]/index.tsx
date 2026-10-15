import { useRouter } from "next/router";
import {
  Plane,
  Luggage,
  Clock,
  Calendar,
  MapPin,
  Gift,
  CreditCard,
  AlertCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { getflight, handleflightbooking } from "@/api";
import { freezePrice } from "@/api/PricingApi";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setUser } from "@/store";

import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import FlightSeatMap from "@/components/SeatRoom/FlightSeatMap";
import ReviewSection from "@/components/Review/ReviewSection";
import DynamicPricingPanel from "@/components/Dynamic-Pricing/DynamicPricingPanel";

interface Flight {
  id: number;
  flightName: string;
  from: string;
  to: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

interface User {
  id: number;
  bookings?: any[];
  [key: string]: any;
}

interface Hotel {
  name: string;
  rating: number;
  price: number;
  image: string;
  location: string;
}

interface PromoOffer {
  code: string;
  description: string;
  amount: number;
}

const normalizeFlight = (raw: any): Flight => ({
  id: Number(raw.id),
  flightName: raw.flightName ?? raw.flight_name ?? "",
  from: raw.from ?? raw.departureCity ?? raw.departure_city ?? "",
  to: raw.to ?? raw.arrivalCity ?? raw.arrival_city ?? "",
  departureDate: String(
    raw.departureDate ?? raw.departure_date ?? raw.departuredate ?? "",
  ).trim(),
  departureTime: String(raw.departureTime ?? raw.departure_time ?? "").trim(),
  arrivalTime: String(raw.arrivalTime ?? raw.arrival_time ?? "").trim(),
  price: Number(raw.price ?? 0),
  availableSeats: Number(raw.availableSeats ?? raw.available_seats ?? 0),
});

const formatDate = (value?: string): string => {
  if (!value) return "Date not set";

  const input = String(value).trim();
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return "Date not set";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) return input;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const parseTime = (value?: string): number | null => {
  if (!value) return null;

  const input = value.trim();

  if (input.includes("T")) {
    const date = new Date(input);

    if (!Number.isNaN(date.getTime())) {
      return date.getHours() * 60 + date.getMinutes();
    }
  }

  const match = input.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);

  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[4]?.toUpperCase();

  if (minutes > 59 || hours > 24) return null;

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  if (hours > 23) return null;

  return hours * 60 + minutes;
};

const formatTime = (value?: string): string => {
  if (!value) return "Time not set";

  const minutes = parseTime(value);
  if (minutes === null) return value;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";

  return `${String(hours % 12 || 12).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0",
  )} ${period}`;
};

const getFlightDuration = (
  departureTime: string,
  arrivalTime: string,
): string => {
  const departure = parseTime(departureTime);
  const arrival = parseTime(arrivalTime);

  if (departure === null || arrival === null) {
    return "Duration unavailable";
  }

  let difference = arrival - departure;

  if (difference < 0) difference += 24 * 60;
  if (difference === 0) return "Duration unavailable";

  return `${Math.floor(difference / 60)}h ${difference % 60}m`;
};

const BookFlightPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user.user) as User | null;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [lockedPrice, setLockedPrice] = useState<number | null>(null);
  const [freezeExpiresAt, setFreezeExpiresAt] = useState<string | null>(null);

  const flightId = Number(Array.isArray(id) ? id[0] : id);

  const fetchFlight = useCallback(async () => {
    if (!router.isReady || !id) return;

    if (!Number.isFinite(flightId) || flightId <= 0) {
      setError("Invalid flight ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getflight();
      const list = Array.isArray(response) ? response : [];

      const found = list
        .map(normalizeFlight)
        .find((item) => item.id === flightId);

      setFlight(found ?? null);

      if (!found) {
        setError("No flight data is available for this flight ID.");
      }
    } catch (e: any) {
      console.error("Error fetching flights:", e);

      setFlight(null);
      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Unable to load flights.",
      );
    } finally {
      setLoading(false);
    }
  }, [router.isReady, id, flightId]);

  useEffect(() => {
    void fetchFlight();
  }, [fetchFlight]);

  if (loading) return <Loader />;

  if (!flight) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <Plane className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800">No Flight Found</h2>
          <p className="mt-2 text-gray-500">
            {error || "No flight data is available."}
          </p>
          <Button className="mt-5" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const duration = getFlightDuration(flight.departureTime, flight.arrivalTime);

  // This page books one selected seat per request.
  const quantity = 1;

  const taxesPerTicket = Math.round(flight.price * 0.18);
  const otherServicesPerTicket = 249;
  const discountPerTicket = 250;

  const totalPrice = flight.price;
  const totalTaxes = taxesPerTicket;
  const totalOtherServices = otherServicesPerTicket;
  const totalDiscounts = discountPerTicket;

  const grandTotal =
    totalPrice + totalTaxes + totalOtherServices - totalDiscounts;

  const flightDetails = {
    flightNo: `MMT-${flight.id}`,
    aircraft: "Airbus A320",
    cabinBaggage: "7 Kgs / Adult",
    checkInBaggage: "15 Kgs (1 piece only) / Adult",
    departureTerminal: `${flight.from} Airport`,
    arrivalTerminal: `${flight.to} Airport`,
  };

  const promoOffers: PromoOffer[] = [
    {
      code: "MMTSECURE",
      description:
        "Get an instant discount of ₹299 on your flight booking and Trip Secure with this coupon!",
      amount: 299,
    },
    {
      code: "SPECIALUPI",
      description:
        "Use this code and get ₹362 instant discount on payments via UPI only!",
      amount: 362,
    },
  ];

  const hotels: Hotel[] = [
    {
      name: "Hotel Park Tree",
      rating: 4,
      price: 9000,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800",
      location: `Near Airport, ${flight.to}`,
    },
    {
      name: "Lemon Tree Premier",
      rating: 4,
      price: 43875,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800",
      location: `City Centre, ${flight.to}`,
    },
    {
      name: "Hotel Kian",
      rating: 4,
      price: 1968,
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
      location: `City Centre, ${flight.to}`,
    },
  ];

  // Freeze the price using the existing PricingApi.js function.
  const handleFreezePrice = async () => {
    if (!user?.id) {
      throw new Error("Please log in to freeze the price.");
    }

    const response = await freezePrice("FLIGHT", flight.id, user.id);
    console.log("PRICE FREEZE RESPONSE:", response);
    const value = Number(response?.lockedPrice ?? response?.price);

    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        `Invalid frozen price. Backend response: ${JSON.stringify(response)}`,
      );
    }

    if (response?.status && response.status !== "ACTIVE") {
      throw new Error(`Price freeze is not active: ${response.status}`);
    }

    if (!response?.expiresAt) {
      console.warn("Price freeze response has no expiresAt field.");
      setFreezeExpiresAt(null);
    } else {
      const expiry = new Date(response.expiresAt).getTime();
      if (!Number.isFinite(expiry) || expiry <= Date.now()) {
        throw new Error("Price freeze expired. Please try again.");
      }
      setFreezeExpiresAt(response.expiresAt);
    }

    setLockedPrice(value);
    return response;
  };

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (booking) return;

    if (!user?.id) {
      setError("Please log in to continue.");
      return;
    }

    if (!selectedSeat?.seatNumber) {
      setError("Please select an available seat.");
      return;
    }

    if (flight.availableSeats < 1) {
      setError("No seats are available for this flight.");
      return;
    }

    try {
      setBooking(true);
      setError("");

      // Get or create a valid freeze immediately before booking.
      const freeze = await handleFreezePrice();

      const priceToBook = Number(freeze?.lockedPrice ?? freeze?.price);

      if (!Number.isFinite(priceToBook) || priceToBook < 0) {
        throw new Error("Could not verify the frozen price.");
      }

      if (freeze?.expiresAt) {
        if (new Date(freeze.expiresAt).getTime() <= Date.now()) {
          throw new Error("Price freeze expired. Please try again.");
        }
      }

      console.log("FLIGHT BOOKING REQUEST:", {
        userId: user.id,
        flightId: flight.id,
        seats: quantity,
        price: priceToBook,
        selectedSeat: String(selectedSeat.seatNumber),
      });

      const bookingData = await handleflightbooking(
        user.id,
        flight.id,
        quantity,
        priceToBook,
        String(selectedSeat.seatNumber),
      );

      const currentBookings = Array.isArray(user.bookings) ? user.bookings : [];

      dispatch(
        setUser({
          ...user,
          bookings: [...currentBookings, bookingData],
        }),
      );

      alert("Flight booked successfully!");

      setOpen(false);
      setSelectedSeat(null);
      setLockedPrice(null);
      setFreezeExpiresAt(null);

      await router.push({
        pathname: "/recommendation",
        query: { afterBooking: "1" },
      });
    } catch (e: any) {
      console.error("Flight booking failed:", {
        status: e?.response?.status,
        data: e?.response?.data,
        message: e?.message,
      });

      setError(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Flight booking failed. Please try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  const BookingContent = () => (
    <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="flex items-center text-2xl font-bold">
          <Plane className="mr-2 h-6 w-6" />
          Flight Booking Details
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleBooking} className="mt-4 grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="flightName">Flight Name</Label>
            <Input id="flightName" value={flight.flightName} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input id="from" value={flight.from} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input id="to" value={flight.to} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureDate">Departure Date</Label>
            <Input
              id="departureDate"
              value={formatDate(flight.departureDate)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureTime">Departure Time</Label>
            <Input
              id="departureTime"
              value={formatTime(flight.departureTime)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrival Time</Label>
            <Input
              id="arrivalTime"
              value={formatTime(flight.arrivalTime)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label>Number of Tickets</Label>
            <Input value="1" readOnly />
            <p className="text-xs text-gray-500">
              {flight.availableSeats} seats available
            </p>
          </div>
        </div>

        <FlightSeatMap
          flightId={flight.id}
          selectedSeat={selectedSeat}
          onSeatSelect={(seat) => {
            setSelectedSeat(seat);
            setError("");
          }}
        />

        {selectedSeat?.seatNumber && (
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Selected seat: <strong>{selectedSeat.seatNumber}</strong>
          </div>
        )}

        <div className="rounded-lg bg-gray-100 p-4">
          <h3 className="mb-4 flex items-center text-lg font-bold">
            <CreditCard className="mr-2 h-5 w-5" />
            Fare Summary
          </h3>

          <div className="space-y-3">
            <FareRow label="Base Fare" value={totalPrice} />
            <FareRow label="Taxes and Surcharges" value={totalTaxes} />
            <FareRow label="Other Services" value={totalOtherServices} />

            <div className="flex justify-between text-green-600">
              <span>Discounts</span>
              <span>- ₹ {totalDiscounts.toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-2 flex justify-between border-t pt-3 text-lg font-bold">
              <span>Displayed Total</span>
              <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {lockedPrice !== null && (
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-800">
                <div className="font-semibold">Frozen price</div>
                <div>₹{lockedPrice.toLocaleString("en-IN")}</div>
                {freezeExpiresAt && (
                  <p className="mt-1 text-xs">
                    Expires: {new Date(freezeExpiresAt).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="whitespace-pre-wrap rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={booking || !user?.id || !selectedSeat?.seatNumber}
        >
          {booking ? "Processing..." : "Confirm Flight Booking"}
        </Button>
      </form>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="mb-2 flex items-center text-lg font-bold">
                    <span>{flight.from}</span>
                    <ArrowRight className="mx-2 h-5 w-5" />
                    <span>{flight.to}</span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(flight.departureDate)}</span>
                    <span>•</span>
                    <Clock className="h-4 w-4" />
                    <span>{duration}</span>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  CANCELLATION FEES APPLY
                </span>
              </div>

              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Plane className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <div className="font-semibold">{flight.flightName}</div>
                  <div className="text-sm text-gray-600">
                    {flightDetails.flightNo} • {flightDetails.aircraft}
                  </div>
                </div>

                <div className="ml-auto text-sm">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                    Economy
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-start justify-between gap-6 border-t pt-6 md:flex-nowrap">
                <div>
                  <div className="text-2xl font-bold">
                    {formatTime(flight.departureTime)}
                  </div>
                  <div className="mt-1 flex items-start text-sm text-gray-600">
                    <MapPin className="mr-1 mt-0.5 h-4 w-4 shrink-0" />
                    {flightDetails.departureTerminal}
                  </div>
                </div>

                <div className="shrink-0 text-center">
                  <div className="mb-1 text-sm text-gray-600">{duration}</div>
                  <div className="relative my-2 h-0.5 w-32 bg-gray-300">
                    <div className="absolute -top-2 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gray-300">
                      <Plane className="h-3 w-3 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Non-stop</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatTime(flight.arrivalTime)}
                  </div>
                  <div className="mt-1 flex items-start justify-end text-sm text-gray-600">
                    <MapPin className="mr-1 mt-0.5 h-4 w-4 shrink-0" />
                    {flightDetails.arrivalTerminal}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Luggage className="mr-2 h-5 w-5 text-gray-500" />
                  Cabin Baggage: {flightDetails.cabinBaggage}
                </div>
                <div className="flex items-center">
                  <Luggage className="mr-2 h-5 w-5 text-gray-500" />
                  Check-in Baggage: {flightDetails.checkInBaggage}
                </div>
              </div>
            </section>

            {user && (
              <DynamicPricingPanel
                type="FLIGHT"
                itemId={flight.id}
                userId={user.id}
              />
            )}

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center text-lg font-bold">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                Cancellation & Date Change Policy
              </h2>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-semibold">
                    {flight.from} - {flight.to}
                  </span>
                  <span className="text-lg font-bold">
                    ₹ {flight.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="h-2.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />

                <div className="mt-2 flex justify-between text-xs text-gray-600">
                  <span>Now</span>
                  <span>{formatDate(flight.departureDate)}</span>
                  <span>Departure</span>
                </div>
              </div>

              <div id="reviews" className="mt-6 rounded-xl bg-white">
                <ReviewSection
                  itemId={flight.id}
                  itemType="FLIGHT"
                  currentUserId={user?.id}
                />
              </div>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center text-lg font-bold">
                  <Gift className="mr-2 h-5 w-5 text-red-500" />
                  Book a Flight & unlock these offers
                </h2>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                  Flyer Exclusive Deal
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.name}
                    className="overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
                  >
                    <div className="relative">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-48 w-full object-cover"
                      />
                      <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-1 text-xs font-medium">
                        Best Seller
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-semibold">
                        {hotel.name}
                      </h3>

                      <div className="mb-2 flex items-center text-sm text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        {hotel.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: hotel.rating }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                className="h-4 w-4 fill-current"
                              />
                            ),
                          )}
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Starting from
                          </div>
                          <div className="text-lg font-bold">
                            ₹ {hotel.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center text-lg font-bold">
                <CreditCard className="mr-2 h-5 w-5 text-gray-600" />
                Fare Summary
              </h2>

              <div className="space-y-3">
                <FareRow label="Base Fare" value={totalPrice} />
                <FareRow label="Taxes and Surcharges" value={totalTaxes} />
                <FareRow label="Other Services" value={totalOtherServices} />

                <div className="flex justify-between text-green-600">
                  <span>Discounts</span>
                  <span>- ₹ {totalDiscounts.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
                </div>

                {lockedPrice !== null && (
                  <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                    <p className="font-semibold">Frozen price</p>
                    <p>₹{lockedPrice.toLocaleString("en-IN")}</p>
                  </div>
                )}
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-6 w-full bg-red-600 text-white hover:bg-red-700">
                    Book Now
                  </Button>
                </DialogTrigger>

                {user ? (
                  <BookingContent />
                ) : (
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>

                    <p className="text-gray-600">
                      Please log in to continue with your booking.
                    </p>

                    <SignupDialog
                      trigger={
                        <Button className="w-full">Log In / Sign Up</Button>
                      }
                    />
                  </DialogContent>
                )}
              </Dialog>

              <div className="mt-8 rounded-xl bg-[#FFF8E7] p-5">
                <h3 className="mb-4 flex items-center font-bold">
                  <Gift className="mr-2 h-5 w-5 text-yellow-600" />
                  PROMO CODES
                </h3>

                <input
                  type="text"
                  placeholder="Enter promo code here"
                  className="mb-4 w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {promoOffers.map((offer) => (
                  <div
                    key={offer.code}
                    className="mb-3 rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="promo"
                        className="mt-1.5 h-4 w-4 accent-red-600"
                      />

                      <div>
                        <div className="font-semibold text-red-600">
                          {offer.code}
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                          {offer.description}
                        </p>

                        <button
                          type="button"
                          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          onClick={() =>
                            alert(`${offer.code}: ${offer.description}`)
                          }
                        >
                          Terms & Conditions
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

function FareRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">₹ {value.toLocaleString("en-IN")}</span>
    </div>
  );
}

export default BookFlightPage;
