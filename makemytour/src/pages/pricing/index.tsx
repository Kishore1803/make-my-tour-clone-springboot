import { useState, type FormEvent } from "react";
import DynamicPricingPanel from "@/components/Dynamic-Pricing/DynamicPricingPanel";
import type { ItemType } from "@/types/pricing";

export default function PricingPage() {
  const [type, setType] = useState<ItemType>("FLIGHT");
  const [itemId, setItemId] = useState("1");
  const [userId, setUserId] = useState("1");
  const [selection, setSelection] = useState<{
    type: ItemType;
    itemId: number;
    userId: number;
  } | null>(null);

  const [error, setError] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = Number(itemId);
    const uid = Number(userId);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      !Number.isSafeInteger(uid) ||
      uid <= 0
    ) {
      setError("Enter valid positive item and user IDs.");
      return;
    }

    setError("");
    setSelection({ type, itemId: id, userId: uid });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900">
          MakeMyTour Dynamic Pricing
        </h1>

        <p className="mt-2 text-gray-600">
          Explore current pricing, historical prices, and price freeze.
        </p>

        <form
          onSubmit={submit}
          className="my-6 grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-3"
        >
          <label className="text-sm font-medium">
            Booking type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ItemType)}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option value="FLIGHT">Flight</option>
              <option value="HOTEL">Hotel</option>
            </select>
          </label>

          <label className="text-sm font-medium">
            Flight / hotel ID
            <input
              type="number"
              min="1"
              required
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <label className="text-sm font-medium">
            User ID
            <input
              type="number"
              min="1"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:col-span-3"
          >
            Load pricing
          </button>
        </form>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {selection && (
          <DynamicPricingPanel
            key={`${selection.type}-${selection.itemId}-${selection.userId}`}
            type={selection.type}
            itemId={selection.itemId}
            userId={selection.userId}
          />
        )}
      </div>
    </main>
  );
}
