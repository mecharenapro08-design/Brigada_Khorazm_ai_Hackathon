import React from "react";
import { Check, X, Sparkles, BookOpen, Compass, BrainCircuit } from "lucide-react";

export const ComparisonBanner: React.FC = () => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Taʼlim Paradigmasi Inqilobi</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Yodlash Emas — Vizual Tushunish! 🚀
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          Anʼanaviy quruq yodlash bilan AI Maktabning interaktiv metodikasi oʻrtasidagi tub farq:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <X className="w-5 h-5 shrink-0" />
            <span>Eski Anʼanaviy Usul (Quruq Yodlash)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Formulalarni maʼnosini anglamay quruq yodlash (2 kunda unutiladi).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Tajriba oʻtkazish imkoni yoʻq qimmat laboratoriyalar.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Monoton kitob matni va tasavvur qilishning qiyinligi.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold">✕</span>
              <span>Repetitorga bogʻliqlik va doimiy savollarga javob topolmaslik.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Check className="w-5 h-5 shrink-0" />
            <span>AI Maktab (Interaktiv & Vizual Taʼlim)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Pifagor, Nyuton, Om qonunlarini jonli simulyatsiyada oʻzgartirib koʻrish.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>24/7 ishlaydigan shaxsiy AI repetitor va oʻzbekcha hayotiy misollar.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>XP, SmartCoin tangalari, ligalar va 45 soniyali Blitz DTM janglari.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Audio ovozli dars oʻqish (TTS) va interaktiv testlar.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
