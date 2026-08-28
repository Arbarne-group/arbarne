import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useStore';
import { assessmentApi } from '../services/api';
import {
  Lock,
  CreditCard,
  Smartphone,
  CheckCircle,
  Info,
  HelpCircle,
  BarChart2,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    checkoutItem,
    setScreen,
    showNotification,
    startAssessment,
    awardXp,
  } = useAppStore();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('712 345 678');
  const [isProcessing, setIsProcessing] = useState(false);

  const priceFormatted = `$${checkoutItem.priceUsd.toFixed(2)}`;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate/Initiate payment gateway transaction
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const scope = checkoutItem.scope;
      const targetPillarId = checkoutItem.pillarId || null;

      const res = await assessmentApi.startAssessment(scope, targetPillarId);
      startAssessment(res.assessment_id, scope, res.questions, targetPillarId);

      const xpReward = scope === 'full' ? 50 : 25;
      awardXp(xpReward, 'Diagnostic Assessment Unlocked');

      showNotification(
        `Payment successful! Your ${checkoutItem.title} is ready.`,
        'success',
        4500,
        'Assessment Unlocked'
      );

      // Transition to questionnaire
      setScreen('screen-question');
    } catch (err: any) {
      showNotification(
        `Checkout authorization error: ${err.message || err}`,
        'error',
        4000,
        'Payment Failed'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setScreen('screen-pricing')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#004447] transition-colors py-1 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pricing Options</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#009924] border border-emerald-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Activation</span>
        </div>
      </div>

      {/* ─── Header Section ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            Secure Checkout
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Complete your payment to unlock the Future Farms Assessment.
          </p>
        </div>

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-xs self-start md:self-auto">
          <Lock className="w-4 h-4 text-[#009924]" />
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Secure &amp; Encrypted
          </span>
        </div>
      </div>

      {/* ─── Bento Grid Layout for Checkout ───────────────────────────── */}
      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Methods (Spans 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Option 1: Credit/Debit Card */}
            <div
              className={`p-6 border-b border-slate-200 transition-colors relative cursor-pointer ${
                paymentMethod === 'card' ? 'bg-white' : 'bg-slate-50/60 opacity-80'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <label className="flex items-start gap-4 cursor-pointer w-full group">
                <div className="pt-1">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 text-[#004447] focus:ring-[#004447] cursor-pointer"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-lg font-bold text-slate-900">
                      Credit / Debit Card
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Input Fields */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required={paymentMethod === 'card'}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#004447] focus:ring-1 focus:ring-[#004447] transition-all outline-none"
                          />
                          <CreditCard className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required={paymentMethod === 'card'}
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#004447] focus:ring-1 focus:ring-[#004447] transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            CVC
                          </label>
                          <div className="relative">
                            <input
                              type="password"
                              required={paymentMethod === 'card'}
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#004447] focus:ring-1 focus:ring-[#004447] transition-all outline-none"
                            />
                            <span
                              title="3 or 4 digits on back of card"
                              className="absolute right-3.5 top-3.5 text-slate-400 cursor-help"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </label>
            </div>

            {/* Option 2: Mobile Money */}
            <div
              className={`p-6 transition-colors relative cursor-pointer ${
                paymentMethod === 'mobile' ? 'bg-white' : 'bg-slate-50/60 opacity-80'
              }`}
              onClick={() => setPaymentMethod('mobile')}
            >
              <label className="flex items-start gap-4 cursor-pointer w-full group">
                <div className="pt-1">
                  <input
                    type="radio"
                    name="payment_method"
                    value="mobile"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => setPaymentMethod('mobile')}
                    className="w-4 h-4 text-[#004447] focus:ring-[#004447] cursor-pointer"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-bold text-slate-900">
                      Mobile Money
                    </span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Pay instantly via Safaricom M-Pesa or Airtel Money.
                  </p>

                  {/* Mobile Money Input Fields */}
                  {paymentMethod === 'mobile' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <div className="flex">
                          <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-700 font-bold text-xs">
                            +254
                          </span>
                          <input
                            type="tel"
                            required={paymentMethod === 'mobile'}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="700 000 000"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-[#004447] focus:ring-1 focus:ring-[#004447] transition-all outline-none"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#009924]" />
                          <span>An STK Push PIN prompt will appear automatically on your phone.</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <p>
              Payments are processed securely by Stripe &amp; Safaricom M-Pesa. We do not store your full card details.
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary (Spans 5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
              Order Summary
            </h3>

            {/* Item List */}
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-[#004447] border border-slate-200">
                    <BarChart2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-slate-900 leading-snug">
                      {checkoutItem.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {checkoutItem.description}
                    </p>
                  </div>
                </div>
                <span className="font-serif text-sm font-bold text-slate-900 whitespace-nowrap">
                  {priceFormatted}
                </span>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{priceFormatted}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Taxes &amp; Levies</span>
                <span className="font-medium text-slate-900">$0.00</span>
              </div>

              <div className="flex justify-between items-end mt-4 pt-4 border-t border-dashed border-slate-200">
                <div>
                  <span className="font-serif text-base font-bold text-slate-900 block">
                    Total
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (or approx. KES {checkoutItem.priceKes.toLocaleString()})
                  </span>
                </div>
                <span className="font-serif text-3xl font-bold text-[#004447] leading-none">
                  {priceFormatted}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#004447] hover:bg-[#023c3f] text-white font-bold text-xs sm:text-sm py-4 rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 group disabled:opacity-75 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-[#7ffd7b]" />
                  <span>Pay {priceFormatted} Now</span>
                </>
              )}
            </button>

            {/* Trust Indicators */}
            <div className="pt-2 flex justify-center items-center gap-4 text-[11px] font-extrabold tracking-widest text-slate-400 uppercase">
              <span>VISA</span>
              <span>•</span>
              <span>MASTERCARD</span>
              <span>•</span>
              <span>M-PESA</span>
              <span>•</span>
              <span>STRIPE</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
