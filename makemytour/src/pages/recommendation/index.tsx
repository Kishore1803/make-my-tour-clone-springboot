import { useSelector } from "react-redux";
import RecommendationSection from "@/components/Recommendations/RecommendationSection";

export default function RecommendationsPage() {
  const user = useSelector((state: any) => state.user.user);

  if (!user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login required</h1>
          <p className="mt-2 text-gray-600">
            Log in to see personalized travel recommendations.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <RecommendationSection userId={user.id} />
    </main>
  );
}
