import { useRouter } from "next/router";
import {
  Star,
  MapPin,
  School as Pool,
  UtensilsCrossed,
  Wine,
  Power,
  ChevronRight,
  Camera,
  Image,
  CreditCard,
  Ticket,
  Home,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { gethotel, handlehotelbooking } from "@/api";

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
import { useDispatch, useSelector } from "react-redux";

import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import ReviewSection from "@/components/Review/ReviewSection";
import DynamicPricingPanel from "@/components/Dynamic-Pricing/DynamicPricingPanel";

interface Hotel {
  id: number;
  hotelName: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  amenities: string;
}

const BookHotelPage = () => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { id } = router.query;

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchHotels = async () => {
      if (!id || hasFetched.current) {
        return;
      }

      hasFetched.current = true;

      try {
        setLoading(true);

        const data = await gethotel();
        const hotelId = Number(id);

        const filteredData = data.filter(
          (hotel: Hotel) => hotel.id === hotelId,
        );

        setHotels(filteredData);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />

          <h2 className="text-xl font-semibold text-gray-700">
            No hotel data available for this ID.
          </h2>

          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hotel = hotels[0];

  const hotelData = {
    name: "Magnum Resorts- Near Candolim Beach",
    rating: 3,
    maxRating: 5,
    propertyPhotos: 91,
    guestPhotos: 386,

    description:
      "One of the best hotels in North Goa, operating since 2001 catering to international and domestic individual and group travelers.",

    amenities: [
      {
        icon: <Pool className="w-5 h-5" />,
        name: "Swimming Pool",
      },
      {
        icon: <UtensilsCrossed className="w-5 h-5" />,
        name: "Restaurant",
      },
      {
        icon: <Wine className="w-5 h-5" />,
        name: "Bar",
      },
      {
        icon: <Power className="w-5 h-5" />,
        name: "Power Backup",
      },
    ],

    room: {
      type: "Standard Room",
      capacity: "Fits 2 Adults",

      features: [
        "No meals included",
        "10% off on food & beverage services",
        "Complimentary welcome drinks on arrival",
        "Non-Refundable",
      ],

      originalPrice: 8999,
      taxes: 527,
    },

    location: {
      area: "Candolim",
      distance: "7 minutes walk to Candolim Beach",
    },
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10);

    setQuantity(
      Number.isNaN(value)
        ? 1
        : Math.max(1, Math.min(value, hotel.availableRooms)),
    );
  };

  // PRICE CALCULATION
  // Assumption: hotel.pricePerNight is already the discounted price.

  const originalPricePerRoom = Number(hotelData.room.originalPrice);
  const discountedPricePerRoom = Number(hotel.pricePerNight);
  const taxesPerRoom = Number(hotelData.room.taxes);

  const totalOriginalPrice = originalPricePerRoom * quantity;
  const totalPrice = discountedPricePerRoom * quantity;
  const totalTaxes = taxesPerRoom * quantity;

  // Discount is displayed only. Do not subtract it again.
  const totalDiscounts = Math.max(0, totalOriginalPrice - totalPrice);

  // Final total = discounted room price + taxes.
  const grandTotal = totalPrice + totalTaxes;

  const formatPrice = (amount: number) =>
    amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });

  const handleBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Please log in to book a hotel.");
      return;
    }

    if (
      !Number.isFinite(discountedPricePerRoom) ||
      discountedPricePerRoom <= 0 ||
      !Number.isFinite(grandTotal) ||
      grandTotal <= 0 ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > hotel.availableRooms
    ) {
      console.error("Invalid booking amount:", {
        pricePerNight: hotel.pricePerNight,
        quantity,
        totalPrice,
        totalTaxes,
        grandTotal,
      });

      alert("Invalid booking amount. Please refresh and try again.");
      return;
    }

    try {
      const response = await handlehotelbooking(
        user.id,
        hotel.id,
        quantity,
        grandTotal,
      );

      console.log("Full booking response:", response);

      const bookingData = response?.data ?? response;

      console.log("Booking data:", bookingData);

      if (
        !bookingData ||
        typeof bookingData !== "object" ||
        Array.isArray(bookingData)
      ) {
        console.error("Invalid booking response:", bookingData);

        throw new Error("Backend returned an invalid booking response.");
      }

      const hotelBooking = {
        ...bookingData,
        bookingId: bookingData.bookingId ?? bookingData.id,
        type: bookingData.type ?? "HOTEL",
        bookingType: bookingData.bookingType ?? "HOTEL",
        totalPrice: bookingData.totalPrice ?? grandTotal,
        quantity: bookingData.quantity ?? quantity,
        date:
          bookingData.date ?? bookingData.bookedAt ?? new Date().toISOString(),
      };

      const currentBookings = Array.isArray(user.bookings) ? user.bookings : [];

      dispatch(
        setUser({
          ...user,
          bookings: [...currentBookings, hotelBooking],
        }),
      );

      setOpen(false);
      setQuantity(1);

      alert("Hotel booked successfully!");

      await router.push({
        pathname: "/recommendation",
        query: { afterBooking: "1" },
      });
    } catch (error) {
      console.error("Hotel booking failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Hotel booking failed. Check the backend response.",
      );
    }
  };

  const HotelContent = () => (
    <DialogContent className="sm:max-w-[600px] bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center">
          <Home className="w-6 h-6 mr-2" />
          Hotel Booking Details
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hotelName" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Hotel Name
            </Label>

            <Input id="hotelName" value={hotel.hotelName} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Label>

            <Input id="location" value={hotel.location} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerNight" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Price Per Night
            </Label>

            <Input
              id="pricePerNight"
              value={`₹ ${formatPrice(discountedPricePerRoom)}`}
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableRooms" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Available Rooms
            </Label>

            <Input id="availableRooms" value={hotel.availableRooms} readOnly />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Number of Rooms to Book
            </Label>

            <Input
              id="quantity"
              type="number"
              min={1}
              max={hotel.availableRooms}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>

        {/* Fare Summary */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Fare Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Original Room Price</span>

              <span className="font-medium line-through text-gray-500">
                ₹ {formatPrice(totalOriginalPrice)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Room Price After Discount</span>

              <span className="font-medium">₹ {formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between items-center text-green-600">
              <span className="font-medium">Discount</span>

              <span className="font-medium">
                - ₹ {formatPrice(totalDiscounts)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes and Extra Charges</span>

              <span className="font-medium">₹ {formatPrice(totalTaxes)}</span>
            </div>

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount</span>

                <span className="font-bold text-lg">
                  ₹ {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full mt-4" onClick={handleBooking}>
        Proceed to Payment
      </Button>
    </DialogContent>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-blue-500">
              Home
            </a>

            <ChevronRight className="w-4 h-4 text-gray-400" />

            <a href="/" className="text-blue-500">
              {hotel.location}
            </a>

            <ChevronRight className="w-4 h-4 text-gray-400" />

            <span className="text-gray-600">{hotel.hotelName}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Hotel Title & Rating */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{hotel.hotelName}</h1>

              <div className="flex items-center space-x-1">
                {[...Array(hotelData.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}

                {[...Array(hotelData.maxRating - hotelData.rating)].map(
                  (_, i) => (
                    <Star key={i} className="w-5 h-5 text-gray-300" />
                  ),
                )}
              </div>
            </div>

            {/* Hotel Images */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="col-span-2 relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800"
                  alt="Hotel Main"
                  className="w-full h-80 object-cover rounded-lg"
                />

                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                  <Camera className="w-4 h-4" />

                  <span className="text-sm">
                    +{hotelData.propertyPhotos} Property Photos
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800"
                    alt="Hotel Room"
                    className="w-full h-[152px] object-cover rounded-lg"
                  />
                </div>

                <div className="relative group cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800"
                    alt="Hotel Amenity"
                    className="w-full h-[152px] object-cover rounded-lg"
                  />

                  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full flex items-center space-x-1">
                    <Image className="w-4 h-4" />

                    <span className="text-sm">
                      +{hotelData.guestPhotos} Guest Photos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {hotelData.description}

              <button type="button" className="text-blue-500 ml-2">
                Read more
              </button>
            </p>

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>

              <div className="flex flex-wrap gap-6">
                {hotelData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-600"
                  >
                    {amenity.icon}
                    <span>{amenity.name}</span>
                  </div>
                ))}

                <button type="button" className="text-blue-500">
                  + 31 Amenities
                </button>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div
              id="reviews"
              className="bg-white rounded-xl shadow-lg p-6 mt-6"
            >
              <ReviewSection
                itemId={hotel.id}
                itemType="HOTEL"
                currentUserId={user?.id}
              />
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Dynamic pricing panel kept available */}
              {/* {user && (
                <div className="mt-6">
                  <DynamicPricingPanel
                    type="HOTEL"
                    itemId={hotel.id}
                    userId={user.id}
                  />
                </div>
              )} */}

              <h3 className="text-xl font-semibold mb-4">
                {hotelData.room.type}
              </h3>

              <p className="text-gray-600 mb-4">{hotelData.room.capacity}</p>

              <ul className="space-y-3 mb-6">
                {hotelData.room.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Price Per Night */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-800 font-semibold">
                    Price Per Night:
                  </span>

                  <span className="text-lg font-medium text-gray-800">
                    ₹ {formatPrice(discountedPricePerRoom)}
                  </span>
                </div>

                {/* Available Rooms */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-800 font-semibold">
                    Available Rooms:
                  </span>

                  <span className="text-lg font-medium text-gray-800">
                    {hotel.availableRooms}
                  </span>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="text-gray-800 font-semibold mb-2">
                    Amenities:
                  </h4>

                  <p className="text-gray-600">{hotel.amenities}</p>
                </div>
              </div>

              {/* Updated Price Summary */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 line-through">
                    ₹ {formatPrice(totalOriginalPrice)}
                  </span>

                  <span className="text-gray-500">
                    {quantity === 1 ? "Per Night" : `${quantity} Rooms`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-green-600">
                  <span className="font-medium">You save</span>

                  <span className="font-medium">
                    ₹ {formatPrice(totalDiscounts)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>₹ {formatPrice(grandTotal)}</span>

                  <span className="text-sm text-gray-500 font-normal">
                    + ₹ {formatPrice(totalTaxes)} taxes & fees
                  </span>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mb-3"
                  >
                    BOOK THIS NOW
                  </button>
                </DialogTrigger>

                {user ? (
                  <HotelContent />
                ) : (
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>

                    <p>Please log in to continue with your booking.</p>

                    <SignupDialog
                      trigger={
                        <Button className="w-full">Log In / Sign Up</Button>
                      }
                    />
                  </DialogContent>
                )}
              </Dialog>

              <button
                type="button"
                className="w-full text-blue-500 text-center"
              >
                14 More Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHotelPage;
