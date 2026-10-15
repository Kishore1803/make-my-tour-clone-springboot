"use client";
import { useRouter } from "next/router";
import PageHeader from "@/components/CancellationRefund/PageHearder";

const router = useRouter();

const policies = [
  {
    number: "01",
    title: "Cancellation Eligibility",
    description:
      "Customers can request cancellation for eligible bookings through the Cancellation page. Cancellation eligibility and applicable charges depend on the booking details and the relevant service provider's terms.",
  },
  {
    number: "02",
    title: "Refund Within 24 Hours",
    description:
      "According to the current backend calculation, eligible cancellations made within 24 hours of booking receive a 50% refund of the booking amount. Check the applicable booking terms before cancelling.",
  },
  {
    number: "03",
    title: "Cancellation After 24 Hours",
    description:
      "According to the current backend calculation, cancellations made after 24 hours receive a 0% refund. Actual eligibility may vary according to the booking provider's cancellation conditions.",
  },
  {
    number: "04",
    title: "Refund Processing Time",
    description:
      "The current refund service records an expected processing timeline of 5–7 business days. The actual time may depend on payment processing, refund approval, and your payment provider.",
  },
  {
    number: "05",
    title: "Refund Status",
    description:
      "Customers can visit the My Refunds page to check their refund records and current status. A refund marked as processing does not mean the money has reached the customer's account.",
  },
  {
    number: "06",
    title: "Cancellation Confirmation",
    description:
      "After submitting a cancellation request, customers should check the Cancellation History page to review the cancellation record and its status.",
  },
];

const refundExamples = [
  {
    title: "Within 24 Hours",
    amount: "₹5,000",
    percentage: "50% calculated refund",
    style: "bg-green-50",
    titleStyle: "text-green-800",
    amountStyle: "text-green-700",
    detailStyle: "text-green-700",
  },
  {
    title: "After 24 Hours",
    amount: "₹0",
    percentage: "0% calculated refund",
    style: "bg-gray-100",
    titleStyle: "text-gray-700",
    amountStyle: "text-gray-800",
    detailStyle: "text-gray-600",
  },
];

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Cancellation & Refund Policy"
          description="Understand cancellation eligibility, refund calculations, and how to track your refund."
        />

        {/* Policy Overview */}
        <section className="mb-8 rounded-2xl bg-blue-700 p-6 text-white sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">
            MakeMyTour · Customer Information
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Know the rules before you cancel
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Please review the applicable cancellation terms, calculated refund
            amount, and estimated processing timeline before submitting your
            cancellation request.
          </p>
        </section>

        {/* Cancellation and Refund Rules */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900">
            Cancellation & Refund Rules
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {policies.map((policy) => (
              <article
                key={policy.number}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                    {policy.number}
                  </span>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {policy.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {policy.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Refund Calculation Example */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Example Refund Calculation
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            For a booking amount of ₹10,000, the current backend calculation
            produces the following example refund amounts:
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {refundExamples.map((example) => (
              <div
                key={example.title}
                className={`rounded-lg p-5 ${example.style}`}
              >
                <p className={`text-sm font-medium ${example.titleStyle}`}>
                  {example.title}
                </p>

                <p className={`mt-2 text-2xl font-bold ${example.amountStyle}`}>
                  {example.amount}
                </p>

                <p className={`mt-1 text-xs ${example.detailStyle}`}>
                  {example.percentage}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500">
            These figures illustrate the current backend calculation only. They
            are not a guarantee of the refund for every flight, hotel, bus, or
            train booking. Applicable provider terms and actual business rules
            should be verified before publishing this policy.
          </p>
        </section>

        {/* Cancellation Process */}
        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            How to Cancel a Booking
          </h2>

          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">
            <li>Open the Manage Cancellations page.</li>
            <li>Select the eligible booking you want to cancel.</li>
            <li>
              Review the cancellation details and applicable refund terms.
            </li>
            <li>Provide a cancellation reason and submit your request.</li>
            <li>
              Check Cancellation History for the saved request and status.
            </li>
            <li>
              If a refund is applicable, track it through the My Refunds page.
            </li>
          </ol>
        </section>

        {/* Important Information */}
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="flex items-center gap-2 font-bold text-amber-900">
            <span aria-hidden="true">ⓘ</span>
            Important Information
          </h2>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-900">
            <li>
              Review your booking details and cancellation terms before
              confirming a cancellation.
            </li>
            <li>
              Refund eligibility and amounts may differ depending on the service
              provider, fare type, booking conditions, and applicable business
              rules.
            </li>
            <li>
              The expected processing timeline of 5–7 business days is not a
              guarantee that payment will be completed within that period.
            </li>
            <li>
              A cancellation request or refund status update does not
              necessarily mean the cancellation or payment is fully completed.
            </li>
            <li>
              Contact customer support if your cancellation or refund remains
              unresolved beyond the expected timeline.
            </li>
          </ul>
        </section>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/manage-cancellation")}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage Cancellations
          </button>

          <button
            onClick={() => router.push("/track-refunds")}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Track My Refunds
          </button>
        </div>
      </div>
    </main>
  );
}
