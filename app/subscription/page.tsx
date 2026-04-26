"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, School, Users, Building, Calendar, BookOpen, FileText, Heart, Award, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 250000,
    period: "month",
    description: "Perfect for small to mid-sized schools",
    features: [
      { name: "Up to 500 students", included: true },
      { name: "Student management", included: true },
      { name: "Basic fee collection", included: true },
      { name: "Attendance tracking", included: true },
      { name: "Email support", included: true },
      { name: "Termly reports", included: true },
      { name: "Mobile app access", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Custom branding", included: true },
      { name: "Priority support", included: false },
      { name: "API access", included: false },
      { name: "Real-time analytics", included: false },
      { name: "Multi-campus", included: false },
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: 450000,
    period: "month",
    description: "Complete solution for growing and large institutions",
    features: [
      { name: "Unlimited students", included: true },
      { name: "Student management", included: true },
      { name: "Advanced fee collection", included: true },
      { name: "Attendance tracking", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Real-time analytics", included: true },
      { name: "Weekly reports", included: true },
      { name: "Priority support", included: true },
      { name: "Custom branding", included: true },
      { name: "Mobile money payments", included: true },
      { name: "API access", included: true },
      { name: "Multi-campus support", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Custom reports", included: true },
      { name: "24/7 phone support", included: true },
      { name: "On-premise option", included: true },
      { name: "White-label solution", included: true },
      { name: "Custom training", included: true },
      { name: "SLA guarantee", included: true },
    ],
    popular: true,
    cta: "Scale Your School",
  },
];

const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString('en-US')}`;
};

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your school. No hidden fees, no surprises.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 md:p-8 mb-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">14-Day Free Trial</h3>
              <p className="text-white/80">No credit card required. Start using immediately.</p>
            </div>
            <Link 
              href="/login" 
              className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Try Free Now
            </Link>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === "monthly" 
                  ? "bg-white shadow-md text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === "yearly" 
                  ? "bg-white shadow-md text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly <span className="text-green-600 text-sm font-semibold ml-1">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] ${
                plan.popular 
                  ? "border-2 border-primary ring-4 ring-primary/20 md:scale-105" 
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary/80 py-2.5 text-center">
                  <span className="inline-flex items-center gap-1.5 text-white font-semibold">
                    <Sparkles className="w-4 h-4" /> Most Popular
                  </span>
                </div>
              )}
              
              <div className={`p-6 md:p-8 ${plan.popular ? "pt-16" : "pt-8"}`}>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                
                <div className="mt-6">
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      {billingCycle === "yearly" ? formatUGX(Math.round(plan.price * 12 * 0.8)) : formatUGX(plan.price)}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                    {billingCycle === "yearly" && (
                      <span className="ml-2 text-sm text-green-600 font-medium">Save 20%</span>
                    )}
                  </>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400 text-sm"}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`mt-8 block w-full text-center py-3.5 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                      : "border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600 text-sm">Yes! Upgrade or downgrade anytime. Changes apply immediately.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payments do you accept?</h3>
              <p className="text-gray-600 text-sm">MTN MoMo, Airtel Money, and bank transfers.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">Yes! 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What after the trial?</h3>
              <p className="text-gray-600 text-sm">Subscribe to continue or use our limited free tier.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center pb-8">
          <p className="text-gray-500 text-sm">
            Need a custom solution? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}