import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import RecommendationSection from "@/components/Recommendations/RecommendationSection";

export default function RecommendationsPage() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  if (!user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Login required
          </h1>

          <p className="mt-2 text-gray-600">
            Log in to see personalized travel recommendations.
          </p>

          <button
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          Travel Recommendations
        </h1>

        <button
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          onClick={() => router.push("/profile")}
        >
          Go to Profile
        </button>
      </header>

      {/* Recommendations */}
      <RecommendationSection userId={user.id} />
    </main>
  );
}
