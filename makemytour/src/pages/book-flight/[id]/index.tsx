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
  Info,
  ArrowRight,
  Ticket,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { getflight, handleflightbooking } from "@/api";
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

const BookFlightPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user) as User | null;
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchFlights = async () => {
      if (!id || hasFetched.current) {
        return;
      }
      hasFetched.current = true;

      try {
        setLoading(true);
        const data = await getflight();
        const flightId = Number(id);
        const filteredFlights = data.filter(
          (flight: Flight) => flight.id === flightId,
        );

        setFlights(filteredFlights);
      } catch (error) {
        console.error("Error fetching flights:", error);
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (flights.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <Plane className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-800">No Flight Found</h2>
          <p className="text-gray-500 mt-2">
            No flight data is available for this flight ID.
          </p>
          <Button className="mt-5" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const flight = flights[0];
  const getFlightDuration = (departureTime: string, arrivalTime: string) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const difference = arrival.getTime() - departure.getTime();

    if (difference <= 0) {
      return "Non Stop";
    }

    const totalMinutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const duration = getFlightDuration(flight.departureTime, flight.arrivalTime);
  const taxPercentage = 0.18;
  const otherServicesPerTicket = 249;
  const discountPerTicket = 250;
  const taxesPerTicket = Math.round(flight.price * taxPercentage);
  const totalPrice = flight.price * quantity;
  const totalTaxes = taxesPerTicket * quantity;
  const totalOtherServices = otherServicesPerTicket * quantity;
  const totalDiscounts = discountPerTicket * quantity;
  const grandTotal =
    totalPrice + totalTaxes + totalOtherServices - totalDiscounts;

  const flightDetails = {
    flightNo: `MMT-${flight.id}`,
    aircraft: "Airbus A320",
    airline: flight.flightName,
    cabinBaggage: "7 Kgs / Adult",
    checkInBaggage: "15 Kgs (1 piece only) / Adult",
    departureTerminal: `${flight.from} International Airport`,
    arrivalTerminal: `${flight.to} International Airport`,
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
      location: `Connaught Place, ${flight.to}`,
    },
    {
      name: "Hotel Kian",
      rating: 4,
      price: 1968,
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
      location: `Karol Bagh, ${flight.to}`,
    },
  ];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleQuantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = Number.parseInt(event.target.value, 10);

    if (Number.isNaN(value)) {
      setQuantity(1);
      return;
    }

    const validQuantity = Math.max(1, Math.min(value, flight.availableSeats));
    setQuantity(validQuantity);
  };

  const handleBooking = async (event: FormEvent) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!selectedSeat) {
      alert("Please select a seat before booking");
      return;
    }

    try {
      const bookingData = await handleflightbooking(
        user.id,
        flight.id,
        quantity,
        grandTotal,
        selectedSeat.seatNumber,
      );

      alert("Flight is Booked Successfully");

      const currentBookings = Array.isArray(user.bookings) ? user.bookings : [];
      const updatedUser = {
        ...user,
        bookings: [...currentBookings, bookingData],
      };

      dispatch(setUser(updatedUser));
      setOpen(false);
      setQuantity(1);
      router.push("/profile");
    } catch (error) {
      console.error("Error while booking flight:", error);
      alert("Flight booking failed");
    }
  };

  const BookingContent = () => (
    <DialogContent className="sm:max-w-[600px] bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center">
          <Plane className="w-6 h-6 mr-2" />
          Flight Booking Details
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleBooking} className="grid gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="flightName" className="flex items-center">
              <Plane className="w-4 h-4 mr-2" />
              Flight Name
            </Label>

            <Input id="flightName" value={flight.flightName} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              From
            </Label>

            <Input id="from" value={flight.from} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              To
            </Label>

            <Input id="to" value={flight.to} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="departureTime" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Departure Time
            </Label>

            <Input
              id="departureTime"
              value={formatDate(flight.departureTime)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arrivalTime" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Arrival Time
            </Label>

            <Input
              id="arrivalTime"
              value={formatDate(flight.arrivalTime)}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Number of Tickets
            </Label>

            <Input
              id="quantity"
              type="number"
              min="1"
              max={flight.availableSeats}
              value={quantity}
              onChange={handleQuantityChange}
            />

            <p className="text-xs text-gray-500">
              {flight.availableSeats} seats available
            </p>
          </div>
        </div>

        {/* Seat Selection */}
        <FlightSeatMap
          flightId={flight.id}
          selectedSeat={selectedSeat}
          onSeatSelect={(seat) => setSelectedSeat(seat)}
        />

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Fare Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes and Surcharges</span>
              <span className="font-medium">
                ₹ {totalTaxes.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other Services</span>
              <span className="font-medium">
                ₹ {totalOtherServices.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between items-center text-green-600">
              <span className="font-medium">Discounts</span>
              <span className="font-medium">
                - ₹ {totalDiscounts.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="font-bold text-lg">
                  ₹ {grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-2">
          Proceed to Payment
        </Button>
      </form>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center flex-wrap gap-4 mb-2">
                    <h2 className="text-lg font-bold flex items-center">
                      <span>{flight.from}</span>
                      <ArrowRight className="w-5 h-5 mx-2" />
                      <span>{flight.to}</span>
                    </h2>
                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                      CANCELLATION FEES APPLY
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(flight.departureTime)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Non Stop - {duration}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center"
                >
                  <Info className="w-4 h-4 mr-1" />
                  View Fare Rules
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <div className="font-semibold">{flight.flightName}</div>
                  <div className="text-sm text-gray-600">
                    {flightDetails.flightNo} • {flightDetails.aircraft}
                  </div>
                </div>

                <div className="ml-auto text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Economy
                  </span>
                  <span className="ml-2 text-gray-600">MMTSPECIAL</span>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6 border-t pt-6">
                <div>
                  <div className="text-2xl font-bold">
                    {new Date(flight.departureTime).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mt-1 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                    {flightDetails.departureTerminal}
                  </div>
                </div>

                <div className="text-center flex-shrink-0">
                  <div className="text-sm text-gray-600 mb-1">{duration}</div>
                  <div className="w-32 h-0.5 bg-gray-300 relative my-2">
                    <div className="absolute -top-2 right-0 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                      <Plane className="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Non-stop</div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {new Date(flight.arrivalTime).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="text-sm text-gray-600 mt-1 flex items-start justify-end">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                    {flightDetails.arrivalTerminal}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Cabin Baggage: {flightDetails.cabinBaggage}</span>
                </div>

                <div className="flex items-center">
                  <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Check-in Baggage: {flightDetails.checkInBaggage}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Pricing */}
            {user && (
              <DynamicPricingPanel
                type="FLIGHT"
                itemId={flight.id}
                userId={user.id}
              />
            )}

            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Cancellation & Date Change Policy
                </h2>

                <button
                  type="button"
                  className="text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  View Policy
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-5 h-5 text-blue-600" />
                    </div>

                    <span className="font-semibold">
                      {flight.from} - {flight.to}
                    </span>
                  </div>

                  <div className="font-bold text-lg">
                    ₹ {flight.price.toLocaleString("en-IN")}
                  </div>
                </div>

                <div className="h-2.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  <span>Now</span>
                  <span>{formatDate(flight.departureTime)}</span>
                  <span>Departure</span>
                </div>
                
                <div id="reviews" className="bg-white rounded-xl shadow-sm p-6">
                  <ReviewSection
                    itemId={flight.id}
                    itemType="FLIGHT"
                    currentUserId={user?.id}
                  />
                </div>
              </div>
            </div>

            {/* Hotel Offers */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-red-500" />
                  Book a Flight & unlock these offers
                </h2>
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  Flyer Exclusive Deal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.name}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />

                      <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                        Best Seller
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {hotel.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                          {Array.from({
                            length: hotel.rating,
                          }).map((_, index) => (
                            <Star
                              key={index}
                              className="w-4 h-4 fill-current"
                            />
                          ))}
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Starting from
                          </div>
                          <div className="font-bold text-lg">
                            ₹ {hotel.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                Fare Summary
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium">
                    ₹ {totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes and Surcharges</span>
                  <span className="font-medium">
                    ₹ {totalTaxes.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Other Services</span>
                  <span className="font-medium">
                    ₹ {totalOtherServices.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Discounts</span>
                  <span className="font-medium">
                    - ₹ {totalDiscounts.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Amount</span>
                    <span className="font-bold text-lg">
                      ₹ {grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700 mt-6">
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

              {/* Promo Codes */}
              <div className="mt-8">
                <div className="bg-[#FFF8E7] p-6 rounded-xl">
                  <h3 className="font-bold mb-4 flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-yellow-600" />
                    PROMO CODES
                  </h3>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Enter promo code here"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
                  </div>

                  {promoOffers.map((offer) => (
                    <div
                      key={offer.code}
                      className="bg-white p-4 rounded-lg mb-3 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="promo"
                          className="mt-1.5 h-4 w-4 text-red-600 focus:ring-red-500"
                        />

                        <div>
                          <div className="font-semibold text-red-600">
                            {offer.code}
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            {offer.description}
                          </p>

                          <button
                            type="button"
                            className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700"
                          >
                            Terms & Conditions
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlightPage;
