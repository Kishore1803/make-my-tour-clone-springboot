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

import { useDispatch, useSelector } from "react-redux";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/store";

import DynamicPricing from "@/components/Dynamic-Pricing/DynamicPricing";

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

  // Prevent duplicate API request
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
      discountedPrice: 664,
      taxes: 527,
    },
    location: {
      area: "Candolim",
      distance: "7 minutes walk to Candolim Beach",
    },
    reviews: {
      rating: 3.8,
      count: 784,
      text: "Very Good",
    },
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number.parseInt(e.target.value, 10);
    setQuantity(
      Number.isNaN(value)
        ? 1
        : Math.max(1, Math.min(value, hotel.availableRooms)),
    );
  };

  const totalPrice = hotel.pricePerNight * quantity;
  const totalTaxes = hotelData.room.taxes * quantity;
  const discountPerRoom = Math.max(
    0,
    hotelData.room.originalPrice - hotelData.room.discountedPrice,
  );
  const totalDiscounts = discountPerRoom * quantity;
  const grandTotal = totalPrice + totalTaxes - totalDiscounts;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    try {
      const data = await handlehotelbooking(
        user?.id,
        hotel?.id,
        quantity,
        grandTotal,
      );

      alert("Hotel is Booked Successfully");

      const currentBookings = Array.isArray(user.bookings) ? user.bookings : [];
      const updatedUser = {
        ...user,
        bookings: [...currentBookings, data],
      };
      dispatch(setUser(updatedUser));
      setOpen(false);
      setQuantity(1);
      router.push("/profile");
    } catch (error) {
      console.error("Error while booking hotel:", error);
      alert("Hotel booking failed");
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
          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="hotelName" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Hotel Name
            </Label>

            <Input id="hotelName" value={hotel.hotelName} readOnly />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Label>

            <Input id="location" value={hotel.location} readOnly />
          </div>

          {/* Price Per Night */}
          <div className="space-y-2">
            <Label htmlFor="pricePerNight" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Price Per Night
            </Label>

            <Input
              id="pricePerNight"
              value={`₹ ${hotel.pricePerNight.toLocaleString()}`}
              readOnly
            />
          </div>

          {/* Available Rooms */}
          <div className="space-y-2">
            <Label htmlFor="availableRooms" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Available Rooms
            </Label>

            <Input id="availableRooms" value={hotel.availableRooms} readOnly />
          </div>

          {/* Number of Rooms */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Number of Rooms to Book
            </Label>

            <Input
              id="quantity"
              type="number"
              min="1"
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
            {/* Base Fare */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-medium">
                ₹ {totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Taxes */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes and Extracharges</span>
              <span className="font-medium">
                ₹ {totalTaxes.toLocaleString()}
              </span>
            </div>

            {/* Discounts */}
            <div className="flex justify-between items-center text-green-600">
              <span className="font-medium">Discounts</span>
              <span className="font-medium">
                - ₹ {totalDiscounts.toLocaleString()}
              </span>
            </div>

            {/* Total */}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Amount</span>
                <span className="font-bold text-lg">
                  ₹ {grandTotal.toLocaleString()}
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
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Dynamic Pricing */}
              {user && (
                <div className="mt-6">
                  <DynamicPricing
                    type="hotel"
                    itemId={hotel.id}
                    userId={user.id}
                    basePrice={hotel.pricePerNight}
                    availableCount={hotel.availableRooms}
                  />
                </div>
              )}

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
                    ₹ {hotel.pricePerNight.toLocaleString()}
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

              {/* Price Summary */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 line-through">
                    ₹{" "}
                    {(hotelData.room.originalPrice * quantity).toLocaleString()}
                  </span>
                  <span className="text-gray-500">Per Night:</span>
                </div>

                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>₹ {grandTotal.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-normal">
                    + ₹ {totalTaxes.toLocaleString()} taxes & fees
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

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 text-white text-2xl font-bold w-16 h-16 rounded-lg flex items-center justify-center">
                    {hotelData.reviews.rating}
                  </div>

                  <div>
                    <div className="font-semibold text-lg">
                      {hotelData.reviews.text}
                    </div>
                    <div className="text-gray-500">
                      ({hotelData.reviews.count} ratings)
                    </div>
                  </div>
                </div>
                <a href="#" className="text-blue-500">
                  All Reviews
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {hotel.location}
                  </h3>
                </div>

                <button type="button" className="text-blue-500">
                  See on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookHotelPage;
