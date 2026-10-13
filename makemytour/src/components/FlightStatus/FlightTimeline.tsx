"use client";

interface FlightTimelineProps {
  status: string;
  scheduledDeparture: string;
  revisedDeparture: string;
  scheduledArrival: string;
  estimatedArrival: string;
  progress: number;
}

const timelineSteps = [
  { status: "ON_TIME", label: "Scheduled" },
  { status: "BOARDING", label: "Boarding" },
  { status: "DEPARTED", label: "Departed" },
  { status: "IN_AIR", label: "In Air" },
  { status: "ARRIVED", label: "Arrived" },
];

const statusOrder: Record<string, number> = {
  ON_TIME: 0,
  BOARDING: 1,
  DEPARTED: 2,
  IN_AIR: 3,
  ARRIVED: 4,
};

export default function FlightTimeline({
  status,
  scheduledDeparture,
  revisedDeparture,
  scheduledArrival,
  estimatedArrival,
  progress,
}: FlightTimelineProps) {
  const normalizedStatus = status?.toUpperCase() || "ON_TIME";
  const isDelayed = normalizedStatus === "DELAYED";
  const isCancelled = normalizedStatus === "CANCELLED";
  const currentStep = statusOrder[normalizedStatus] ?? -1;
  const safeProgress = Math.min(100, Math.max(0, progress ?? 0));

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900">Flight Journey</h3>
      <p className="mt-1 text-sm text-gray-500">
        Follow the flight from departure to arrival.
      </p>

      {/* Departure and arrival times */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Departure</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {revisedDeparture || scheduledDeparture}
          </p>

          {revisedDeparture && revisedDeparture !== scheduledDeparture && (
            <p className="mt-1 text-xs text-orange-600">
              Originally {scheduledDeparture}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Estimated Arrival</p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {estimatedArrival || scheduledArrival}
          </p>

          {estimatedArrival && estimatedArrival !== scheduledArrival && (
            <p className="mt-1 text-xs text-orange-600">
              Originally {scheduledArrival}
            </p>
          )}
        </div>
      </div>

      {/* Cancelled flight */}
      {isCancelled && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
        >
          This flight has been cancelled. Please contact the airline for
          assistance.
        </div>
      )}

      {/* Delayed flight */}
      {isDelayed && (
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="font-semibold text-orange-800">Departure delayed</p>
          <p className="mt-1 text-sm text-orange-700">
            The revised schedule is shown above.
          </p>
        </div>
      )}

      {/* Timeline */}
      {!isCancelled && (
        <div className="mt-8">
          <div className="relative">
            {/* Timeline connector */}
            <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-gray-200" />

            <div
              className="absolute left-4 top-4 w-0.5 bg-blue-600 transition-all duration-500"
              style={{
                height: `calc((100% - 2rem) * ${
                  currentStep < 0 ? 0 : currentStep / 4
                })`,
              }}
            />

            <div className="relative space-y-7">
              {timelineSteps.map((step, index) => {
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={step.status} className="flex items-start gap-4">
                    <div
                      className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        isCompleted
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    <div className="flex-1 pb-1">
                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? "text-blue-700"
                            : isCompleted
                              ? "text-gray-900"
                              : "text-gray-400"
                        }`}
                      >
                        {step.label}

                        {isCurrent && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            Current
                          </span>
                        )}
                      </p>

                      {step.status === "ON_TIME" && (
                        <p className="mt-1 text-sm text-gray-500">
                          Scheduled departure: {scheduledDeparture}
                        </p>
                      )}

                      {step.status === "BOARDING" &&
                        normalizedStatus === "BOARDING" && (
                          <p className="mt-1 text-sm text-gray-500">
                            Passengers are boarding.
                          </p>
                        )}

                      {step.status === "DEPARTED" &&
                        normalizedStatus === "DEPARTED" && (
                          <p className="mt-1 text-sm text-gray-500">
                            The flight has departed.
                          </p>
                        )}

                      {step.status === "IN_AIR" &&
                        normalizedStatus === "IN_AIR" && (
                          <p className="mt-1 text-sm text-gray-500">
                            Flight progress: {safeProgress}%
                          </p>
                        )}

                      {step.status === "ARRIVED" &&
                        normalizedStatus === "ARRIVED" && (
                          <p className="mt-1 text-sm text-gray-500">
                            Estimated arrival: {estimatedArrival}
                          </p>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
