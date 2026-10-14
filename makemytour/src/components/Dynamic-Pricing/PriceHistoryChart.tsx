// import type { PriceHistoryPoint } from "@/types/pricing";

// interface Props {
//   history: PriceHistoryPoint[];
// }

// export default function PriceHistoryChart({ history }: Props) {
//   const points = [...history]
//     .sort(
//       (a, b) =>
//         new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
//     )
//     .slice(-30);

//   if (!points.length) {
//     return (
//       <section className="rounded-2xl border bg-white p-5">
//         <h3 className="font-semibold">Price history</h3>
//         <p className="mt-2 text-sm text-gray-500">
//           No price history recorded yet.
//         </p>
//       </section>
//     );
//   }

//   const width = 600;
//   const height = 230;
//   const padding = 35;

//   const values = points.map((p) => p.finalPrice);
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const range = max - min || 1;

//   const coordinates = points.map((point, index) => ({
//     x:
//       points.length === 1
//         ? width / 2
//         : padding + (index / (points.length - 1)) * (width - 2 * padding),
//     y:
//       height -
//       padding -
//       ((point.finalPrice - min) / range) * (height - 2 * padding),
//   }));

//   const path = coordinates
//     .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
//     .join(" ");

//   const money = (value: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

//   return (
//     <section className="rounded-2xl border bg-white p-5 shadow-sm">
//       <h3 className="text-lg font-semibold">Price history</h3>
//       <p className="mt-1 text-sm text-gray-500">
//         Latest {points.length} recorded price snapshots
//       </p>

//       <svg
//         viewBox={`0 0 ${width} ${height}`}
//         className="mt-4 w-full"
//         role="img"
//         aria-label="Historical booking prices"
//       >
//         {[0, 1, 2, 3].map((n) => {
//           const y = padding + (n / 3) * (height - 2 * padding);
//           return (
//             <line
//               key={n}
//               x1={padding}
//               x2={width - padding}
//               y1={y}
//               y2={y}
//               stroke="#e5e7eb"
//             />
//           );
//         })}

//         <path
//           d={path}
//           fill="none"
//           stroke="#2563eb"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />

//         {coordinates.map((point, index) => (
//           <circle
//             key={`${points[index].recordedAt}-${index}`}
//             cx={point.x}
//             cy={point.y}
//             r="4"
//             fill="#2563eb"
//           >
//             <title>
//               {new Date(points[index].recordedAt).toLocaleString("en-IN")}
//               {" — "}
//               {money(points[index].finalPrice)}
//             </title>
//           </circle>
//         ))}
//       </svg>

//       <div className="mt-3 flex justify-between text-sm">
//         <span>Lowest: {money(min)}</span>
//         <span>Highest: {money(max)}</span>
//       </div>
//     </section>
//   );
// }
