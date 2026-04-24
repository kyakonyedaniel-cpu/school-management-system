"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, School, Users, Building, Calendar, BookOpen, FileText, Heart, Award } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 250000,
    period: "month",
    description: "Perfect for small schools with up to 200 students",
    features: [
      { name: "Up to 200 students", included: true },
      { name: "Student management", included: true },
      { name: "Basic fee collection", included: true },
      { name: "Attendance tracking", included: true },
      { name: "Email support", included: true },
      { name: "Termly reports", included: true },
      { name: "Mobile app access", included: true },
      { name: "Custom branding", included: false },
      { name: "WhatsApp integration", included: false },
      { name: "Priority support", included: false },
      { name: "API access", included: false },
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 450000,
    period: "month",
    description: "Most popular choice for growing schools",
    features: [
      { name: "Up to 1,000 students", included: true },
      { name: "Student management", included: true },
      { name: "Advanced fee collection", included: true },
      { name: "Attendance tracking", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Real-time analytics", included: true },
      { name: "Weekly reports", included: true },
      { name: "Priority support", included: true },
      { name: "Custom branding", included: true },
      { name: "Mobile money payments", included: true },
      { name: "API access", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "month",
    description: "For large institutions with multiple campuses",
    features: [
      { name: "Unlimited students", included: true },
      { name: "Multi-campus support", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom reports", included: true },
      { name: "API access", included: true },
      { name: "24/7 phone support", included: true },
      { name: "On-premise option", included: true },
      { name: "White-label solution", included: true },
      { name: "Custom training", included: true },
      { name: "SLA guarantee", included: true },
    ],
    popular: false,
  },
];

const formatUGX = (amount: number) => {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);
};

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600">Choose the perfect plan for your school</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">14-Day Free Trial</h3>
                <p className="text-sm text-blue-700">No credit card required. Start using immediately.</p>
              </div>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Try Free Now
              </Link>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow mb-8">
            <div className="p-4 flex justify-center">
              <div className="bg-muted p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-lg ${billingCycle === "monthly" ? "bg-background shadow" : ""}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-lg ${billingCycle === "yearly" ? "bg-background shadow" : ""}`}
                >
                  Yearly <span className="text-green-600 text-sm">-20%</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-background rounded-lg shadow p-6 ${plan.popular ? "border-2 border-blue-500 relative" : ""}`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  {typeof plan.price === "number" ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {billingCycle === "yearly" ? formatUGX(Math.round(plan.price * 12 * 0.8)) : formatUGX(plan.price)}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`mt-6 block w-full text-center py-2 rounded-lg ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-background rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Can I change plans later?</h3>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
                <p className="text-gray-600 text-sm">We accept MTN MoMo, Airtel Money, and bank transfers.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Is there a free trial?</h3>
                <p className="text-gray-600 text-sm">Yes! All plans include a 14-day free trial. No credit card required.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">What happens after the trial?</h3>
                <p className="text-gray-600 text-sm">You can subscribe to continue using the platform, or continue with our limited free tier.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}