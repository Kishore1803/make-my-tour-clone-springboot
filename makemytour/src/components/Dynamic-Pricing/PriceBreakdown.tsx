// import type { PriceResponse } from "@/types/pricing";

// interface Props {
//   price: PriceResponse;
// }

// const money = (value: number) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 2,
//   }).format(value);

// export default function PriceBreakdown({ price }: Props) {
//   const rows = [
//     ["Base price", price.basePrice],
//     ["Demand adjustment", price.demandAmount],
//     ["Seasonal adjustment", price.seasonalAmount],
//     ["Holiday adjustment", price.holidayAmount],
//   ] as const;

//   return (
//     <section className="rounded-2xl border bg-white p-5 text-gray-900 shadow-sm">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm text-gray-500">Total price</p>
//           <h2 className="mt-1 text-3xl font-bold">{money(price.finalPrice)}</h2>
//         </div>

//         {price.frozen && (
//           <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
//             Price frozen
//           </span>
//         )}
//       </div>

//       <div className="mt-6 space-y-4">
//         {rows.map(([label, amount]) => (
//           <div key={label} className="flex justify-between gap-4 text-sm">
//             <span className="text-gray-600">{label}</span>
//             <span>{money(amount)}</span>
//           </div>
//         ))}

//         <div className="flex justify-between border-t pt-4 font-bold">
//           <span>Final price</span>
//           <span className="text-blue-700">{money(price.finalPrice)}</span>
//         </div>
//       </div>

//       {price.updatedAt && (
//         <p className="mt-4 text-xs text-gray-500">
//           Updated: {new Date(price.updatedAt).toLocaleString("en-IN")}
//         </p>
//       )}

//       <p className="mt-2 text-xs text-gray-500">
//         Adjustments are calculated by the server. Confirm the final payable
//         amount during checkout.
//       </p>
//     </section>
//   );
// }
