import FlightStatusPage from "@/components/FlightStatus/FlightStatusPage";

export const metadata = {
  title: "Live Flight Status | MakeMyTour",
  description:
    "Track flights, check delays, and view estimated arrival times on MakeMyTour.",
};

export default function Page() {
  return <FlightStatusPage />;
}
