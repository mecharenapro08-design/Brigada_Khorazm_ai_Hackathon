import React, { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  ShieldCheck,
  X,
  CreditCard,
  Sparkles,
  ArrowRight,
  Bot,
  BarChart3,
  BookOpen,
  FlaskConical,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile } from "../types";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  initialPlan?: "classic" | "premium";
  onSelectPlan: (plan: "classic" | "premium", period: "month" | "year") => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  initialPlan = "premium",
  onSelectPlan,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"classic" | "premium">(initialPlan);
  const [premiumPeriod, setPremiumPeriod] = useState<"month" | "year">("year");
  const [paymentProvider, setPaymentProvider] = useState<"payme" | "click" | "uzum">("payme");
  const [cardNumber, setCardNumber] = useState<string>("8600 •••• •••• 9012");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        onSelectPlan(selectedPlan, selectedPlan === "classic" ? "year" : premiumPeriod);
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-8 relative text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg border-2 border-emerald-500">
              ✓
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Toʻlov Muvaffaqiyatli Amalga Oshirildi! 🎉
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
              Sizning akkauntingizga{" "}
              <strong className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                {selectedPlan}
              </strong>{" "}
              tarifi muvaffaqiyatli biriktirildi. Profilingizda obuna nomi saqlandi.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Maktab Rasmiy Ta'lim Obunalari</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                Oʻzingizga Mos Ta'lim Tarifini Tanlang
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Toʻlovdan soʻng profilingizda tanlangan tarif nomi (Classic yoki Premium) avtomatik qayd etiladi va barcha imkoniyatlar faollashadi.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* PLAN 1: CLASSIC */}
              <div
                onClick={() => setSelectedPlan("classic")}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === "classic"
                    ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xl ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold uppercase">
                      Bazaviy Kirish
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "classic"
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-400"
                      }`}
                    >
                      {selectedPlan === "classic" && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mt-3">
                    Classic Tarif
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Barcha maktab fanlari, laboratoriya va dars jadvallariga toʻliq yillik kirish.
                  </p>

                  <div className="mt-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                        30,000
                      </span>
                      <span className="text-sm font-semibold text-slate-500">soʻm / yil</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                      Barcha darsliklar va 2D/3D laboratoriya bilan
                    </span>
                  </div>

                  <ul className="space-y-2.5 mt-4 text-xs">
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Barcha darsliklar va oʻquv dasturlari</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>2D & 3D interaktiv laboratoriya simulyatsiyalari</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Vizual haftalik dars jadvali va qoʻngʻiroqlar</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Standart DTM testlari va bilimlarni sinash</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-4">
                  <div
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-colors ${
                      selectedPlan === "classic"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {selectedPlan === "classic" ? "Tanlangan Tarif" : "Classic Tarifini Tanlash"}
                  </div>
                </div>
              </div>

              {/* PLAN 2: PREMIUM */}
              <div
                onClick={() => setSelectedPlan("premium")}
                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedPlan === "premium"
                    ? "border-purple-500 bg-linear-to-b from-purple-50/70 to-indigo-50/50 dark:from-purple-950/40 dark:to-indigo-950/30 shadow-xl ring-2 ring-purple-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 text-white text-xs font-extrabold uppercase flex items-center gap-1.5 shadow-xs">
                      <Crown className="w-3.5 h-3.5" />
                      <span>Eng Ommabop</span>
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === "premium"
                          ? "border-purple-600 bg-purple-600 text-white"
                          : "border-slate-400"
                      }`}
                    >
                      {selectedPlan === "premium" && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mt-3 flex items-center gap-2">
                    <span>Premium Tarif</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-mono">
                      AI + Analitika
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Shaxsiy 24/7 AI-repetitor va oʻzlashtirishning chuqur analitik tahlili.
                  </p>

                  {/* Period Switcher (Month vs Year) */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 mt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPremiumPeriod("month");
                        setSelectedPlan("premium");
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        premiumPeriod === "month"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      Oylik (25,000 soʻm)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPremiumPeriod("year");
                        setSelectedPlan("premium");
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                        premiumPeriod === "year"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <span>Yillik (200,000 soʻm)</span>
                      <span className="absolute -top-2 -right-1 text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                        -33%
                      </span>
                    </button>
                  </div>

                  <div className="mt-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                        {premiumPeriod === "month" ? "25,000" : "200,000"}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        soʻm / {premiumPeriod === "month" ? "oy" : "yil"}
                      </span>
                    </div>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold block mt-0.5">
                      {premiumPeriod === "year"
                        ? "Yillik toʻlovda 100,000 soʻm tejab qolasiz!"
                        : "Istalgan vaqt bekor qilish mumkin"}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mt-4 text-xs">
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                      <Check className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Classic tarifining barcha imkoniyatlari</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                      <Bot className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Cheksiz 24/7 Shaxsiy AI-repetitor bilan suhbat</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                      <BarChart3 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Chuqur oʻzlashtirish va DTM ehtimollik analitikasi</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                      <Award className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>2x SmartCoin va individual tavsiyalar xaritasi</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-5 mt-4">
                  <div
                    className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition-colors ${
                      selectedPlan === "premium"
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {selectedPlan === "premium" ? "Tanlangan Tarif" : "Premium Tarifini Tanlash"}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Provider & Quick Checkout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Toʻlov tizimini tanlang:
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Oʻzbekistonning barcha bank kartalari (Uzcard, Humo, Visa, Mastercard)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("payme")}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentProvider === "payme"
                        ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/20"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Payme
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("click")}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentProvider === "click"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Click
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("uzum")}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentProvider === "uzum"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Uzum Bank
                  </button>
                </div>
              </div>

              {/* Submit Payment Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Xavfsiz toʻlov shifrlangan kanal orqali kafolatlanadi</span>
                </div>

                <button
                  id="confirm-pay-subscription-btn"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white font-black text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Toʻlov tekshirilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {selectedPlan === "classic"
                          ? "Classic Tarifni Faollashtirish (30,000 soʻm)"
                          : `Premium Tarifni Faollashtirish (${
                              premiumPeriod === "month" ? "25,000" : "200,000"
                            } soʻm)`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
