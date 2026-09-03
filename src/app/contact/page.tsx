"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "Keziah Wanjiku",
    email: "keziah@futurefarms.africa",
    phone: "+254 712 345 678",
    topic: "Assessment & Advisory",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ ...form, message: "" });
      alert("Thank you! Your message has been received. Our advisory team will reach out within 24 hours.");
    }, 1200);
  };

  return (
    <AppShell>
      <div className="max-w-[1100px] mx-auto w-full px-4 md:px-10 py-8 space-y-8 pb-24">
        {/* Header */}
        <div className="border-b border-surface-variant pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-sm fill">contact_support</span>
            <span>We&apos;re Here to Help</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface">
            Contact Future Farms
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mt-1">
            Have a question about your farm assessment, need technical assistance, or want to explore enterprise partnerships? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] space-y-6">
              <h2 className="text-lg font-bold text-on-surface">
                Direct Channels
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-medium">
                    WhatsApp Farm Desk
                  </span>
                  <a
                    href="https://wa.me/254700000000"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    +254 700 000 000 (Chat Now)
                  </a>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Fastest for urgent on-field photo diagnostics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-medium">
                    General Inquiries
                  </span>
                  <a
                    href="mailto:support@futurefarms.africa"
                    className="text-sm font-bold text-on-surface hover:text-primary transition-colors"
                  >
                    support@futurefarms.africa
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant block font-medium">
                    Toll-Free Farmer Hotline
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    0800 720 000
                  </span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Mon - Sat: 7:00 AM - 6:00 PM EAT
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-variant/50">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Headquarters &amp; Field Hubs
                </h3>
                <p className="text-xs text-on-surface leading-relaxed mb-2">
                  <strong>Nairobi Central:</strong> Future Farms Agri-Tech Hub, 4th Floor, Riverside Square, Nairobi, Kenya.
                </p>
                <p className="text-xs text-on-surface leading-relaxed">
                  <strong>Rift Valley Hub:</strong> Eldoret Agricultural Innovation Center, Uganda Road, Eldoret.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-surface-variant/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
              <h2 className="text-lg font-bold text-on-surface mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-on-surface-variant mb-6">
                Fill out the form below and our team will get back to you with tailored recommendations.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option>Assessment &amp; Advisory</option>
                      <option>Grant Application Assistance</option>
                      <option>Service Desk Dispatch</option>
                      <option>Billing &amp; M-Pesa Payment</option>
                      <option>Commercial Partnerships</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Your Message / Inquiry Details
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your farm setup, specific questions, or how we can help..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface bg-surface focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-3 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs btn-shadow hover-lift transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitted ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
