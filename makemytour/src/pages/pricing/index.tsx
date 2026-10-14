// import { useState } from "react";
// import DynamicPricePanel from "@/components/Dynamic-Pricing/DynamicPricingPanel";
// import type { ItemType } from "@/types/pricing";

// export default function PricingDemoPage() {
//   const [type, setType] = useState<ItemType>("FLIGHT");
//   const [itemId, setItemId] = useState("101");
//   const [userId, setUserId] = useState("1");
//   const [submitted, setSubmitted] = useState({
//     type: "FLIGHT" as ItemType,
//     itemId: 101,
//     userId: 1,
//   });

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const parsedItemId = Number(itemId);
//     const parsedUserId = Number(userId);

//     if (
//       !Number.isSafeInteger(parsedItemId) ||
//       parsedItemId <= 0 ||
//       !Number.isSafeInteger(parsedUserId) ||
//       parsedUserId <= 0
//     ) {
//       return;
//     }

//     setSubmitted({
//       type,
//       itemId: parsedItemId,
//       userId: parsedUserId,
//     });
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
//       <div className="mx-auto max-w-3xl">
//         <form
//           onSubmit={handleSubmit}
//           className="mb-8 grid gap-4 rounded-2xl border bg-white p-5 sm:grid-cols-3"
//         >
//           <label className="text-sm font-medium text-gray-700">
//             Booking type
//             <select
//               value={type}
//               onChange={(event) =>
//                 setType(event.target.value as ItemType)
//               }
//               className="mt-2 w-full rounded-lg border p-3"
//             >
//               <option value="FLIGHT">Flight</option>
//               <option value="HOTEL">Hotel</option>
//             </select>
//           </label>

//           <label className="text-sm font-medium text-gray-700">
//             Flight / hotel ID
//             <input
//               type="number"
//               min="1"
//               required
//               value={itemId}
//               onChange={(event) => setItemId(event.target.value)}
//               className="mt-2 w-full rounded-lg border p-3"
//             />
//           </label>

//           <label className="text-sm font-medium text-gray-700">
//             User ID
//             <input
//               type="number"
//               min="1"
//               required
//               value={userId}
//               onChange={(event) => setUserId(event.target.value)}
//               className="mt-2 w-full rounded-lg border p-3"
//             />
//           </label>

//           <button
//             type="submit"
//             className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 sm:col-span-3"
//           >
//             Load pricing
//           </button>
//         </form>

//         <DynamicPricePanel
//           key={`${submitted.type}-${submitted.itemId}-${submitted.userId}`}
//           type={submitted.type}
//           itemId={submitted.itemId}
//           userId={submitted.userId}
//         />
//       </div>
//     </main>
//   );
// }