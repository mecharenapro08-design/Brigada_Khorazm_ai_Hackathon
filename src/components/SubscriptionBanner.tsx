import React from "react";
import { Sparkles, Crown, Zap, Check, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { UserProfile } from "../types";

interface SubscriptionBannerProps {
  userProfile: UserProfile;
  onOpenSubscriptionModal: (defaultPlan?: "classic" | "premium") => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({
  userProfile,
  onOpenSubscriptionModal,
}) => {
  const isPaid = userProfile.subscription && userProfile.subscription !== "free";

  if (isPaid) {
    const isPremium = userProfile.subscription === "premium";
    return (
      <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
            isPremium ? "bg-purple-600" : "bg-indigo-600"
          }`}>
            {isPremium ? <Crown className="w-5 h-5" /> : <Star className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Toʻlangan Obuna Faol
              </span>
              <span className="px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                ✓ Tasdiqlangan
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-display">
              Sizning tarifingiz:{" "}
              <strong className={isPremium ? "text-purple-600 dark:text-purple-400" : "text-indigo-600 dark:text-indigo-400"}>
                {isPremium ? "👑 Premium Tarif" : "⭐ Classic Tarif"}
              </strong>
            </h4>
          </div>
        </div>

        <button
          onClick={() => onOpenSubscriptionModal(isPremium ? "premium" : "classic")}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Tarifni Boshqarish
        </button>
      </div>
    );
  }

  // Agar to'lanmagan bo'lsa (bosh sahifada to'liq chiqadi)
  return (
    <div className="bg-linear-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-indigo-700/50 space-y-5">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Toʻliq Ta'lim Imkoniyatlarini Ochish</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
            AI Maktab Ta'lim Tariflarini Faollashtiring
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            2D/3D laboratoriyalar, barcha maktab fanlari, 24/7 shaxsiy AI repetitor va chuqur oʻzlashtirish analitikasidan cheksiz foydalaning.
          </p>
        </div>

        <button
          id="hero-buy-subscription-btn"
          onClick={() => onOpenSubscriptionModal("premium")}
          className="shrink-0 px-6 py-3 rounded-2xl bg-linear-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Tarifni Xarid Qilish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Tarif Kartalari */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* Classic Card */}
        <div
          onClick={() => onOpenSubscriptionModal("classic")}
          className="p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer flex items-center justify-between gap-3 group"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-cyan-300">⭐ Classic Tarif</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-200 font-mono">
                Bazaviy
              </span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
              30,000 <span className="text-xs font-normal text-slate-300">soʻm / yil</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Barcha darsliklar, 2D/3D laboratoriya va dars jadvali
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-300 group-hover:translate-x-1 transition-transform">
            Tanlash →
          </span>
        </div>

        {/* Premium Card */}
        <div
          onClick={() => onOpenSubscriptionModal("premium")}
          className="p-4 rounded-2xl bg-purple-500/20 hover:bg-purple-500/25 border border-purple-400/40 transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>👑 Premium Tarif</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono">
                AI Repetitor
              </span>
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-mono">
              25,000 <span className="text-xs font-normal text-slate-300">soʻm / oy</span>
              <span className="text-[10px] text-purple-200 ml-1.5 font-normal">(yoki 200,000 soʻm/yil)</span>
            </div>
            <p className="text-[11px] text-purple-200">
              24/7 AI repetitor + chuqur oʻzlashtirish analitikasi
            </p>
          </div>
          <span className="text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
            Tanlash →
          </span>
        </div>
      </div>
    </div>
  );
};
