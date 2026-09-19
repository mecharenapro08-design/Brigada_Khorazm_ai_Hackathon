import React, { useState, useEffect } from "react";
import {
  Gamepad2,
  Timer,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Bot,
  HelpCircle,
  X,
  BookOpen,
  Heart,
  Trophy,
  ArrowRight,
  ShieldAlert,
  Zap,
  Folder,
  FolderOpen,
  FileText,
  Bookmark,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DTM_100_QUESTIONS, DTMQuestion } from "../data/dtmQuestions";
import { MARATHON_QUESTIONS, MarathonQuestion } from "../data/marathonQuestions";

interface BlitzQuizGameProps {
  onAwardRewards: (xp: number, coins: number, reason: string) => void;
  userSubscription?: "free" | "premium";
  onOpenSubscriptionModal?: (plan: "free" | "premium") => void;
}

export const BlitzQuizGame: React.FC<BlitzQuizGameProps> = ({
  onAwardRewards,
  userSubscription = "free",
  onOpenSubscriptionModal,
}) => {
  // Folder / Section Mode: DTM vs Marathon
  const [activeMode, setActiveMode] = useState<"blitz" | "marathon">("blitz");

  // ==========================================
  // 1. DTM BLITZ STATE
  // ==========================================
  const [blitzQuestions, setBlitzQuestions] = useState<DTMQuestion[]>([]);
  const [blitzIdx, setBlitzIdx] = useState<number>(0);
  const [blitzScore, setBlitzScore] = useState<number>(0);
  const [blitzCombo, setBlitzCombo] = useState<number>(0);
  const [blitzTimeLeft, setBlitzTimeLeft] = useState<number>(45);
  const [blitzState, setBlitzState] = useState<"ready" | "playing" | "finished">("ready");
  const [blitzFeedback, setBlitzFeedback] = useState<"correct" | "wrong" | null>(null);

  // AI Hint system (Daily 3 for Free, Unlimited for Premium)
  const [aiHintsRemaining, setAiHintsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem("aimaktab_blitz_ai_hints");
    return saved !== null ? parseInt(saved, 10) : 3;
  });
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiHintText, setAiHintText] = useState<string>("");
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [toastLimitNotice, setToastLimitNotice] = useState<string | null>(null);

  // ==========================================
  // 2. KATTA BILIM MARAFONI (42 km) STATE
  // ==========================================
  const [marathonIdx, setMarathonIdx] = useState<number>(0);
  const [marathonLives, setMarathonLives] = useState<number>(3);
  const [marathonState, setMarathonState] = useState<"ready" | "running" | "checkpoint" | "won" | "failed">("ready");
  const [marathonSelectedOption, setMarathonSelectedOption] = useState<number | null>(null);
  const [marathonShowExplanation, setMarathonShowExplanation] = useState<boolean>(false);
  const [marathonEarnedXP, setMarathonEarnedXP] = useState<number>(0);
  const [marathonEarnedCoins, setMarathonEarnedCoins] = useState<number>(0);

  // Sync hints with localStorage
  useEffect(() => {
    localStorage.setItem("aimaktab_blitz_ai_hints", aiHintsRemaining.toString());
  }, [aiHintsRemaining]);

  // Blitz Timer countdown
  useEffect(() => {
    let timer: any;
    if (blitzState === "playing" && !isAiModalOpen) {
      timer = setInterval(() => {
        setBlitzTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            finishBlitzGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [blitzState, isAiModalOpen]);

  // Start Blitz Game
  const startBlitzGame = () => {
    // Pick 15 random questions from the 100 DTM question bank
    const shuffled = [...DTM_100_QUESTIONS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15);

    setBlitzQuestions(selected);
    setBlitzIdx(0);
    setBlitzScore(0);
    setBlitzCombo(0);
    setBlitzTimeLeft(45);
    setBlitzFeedback(null);
    setEliminatedOptions([]);
    setBlitzState("playing");
  };

  const finishBlitzGame = () => {
    setBlitzState("finished");
    const earnedXP = blitzScore * 15 + Math.floor(blitzScore / 3) * 20;
    const earnedCoins = Math.floor(blitzScore * 3);

    if (blitzScore > 0) {
      confetti({ particleCount: 80, spread: 70 });
      onAwardRewards(earnedXP, earnedCoins, `DTM Blitz (${blitzScore} toʻgʻri javob)`);
    }
  };

  const handleBlitzAnswer = (selectedIdx: number) => {
    if (blitzState !== "playing" || blitzFeedback !== null) return;

    const currentQ = blitzQuestions[blitzIdx];
    const isCorrect = selectedIdx === currentQ.correctIndex;

    if (isCorrect) {
      setBlitzFeedback("correct");
      setBlitzScore((s) => s + 1);
      setBlitzCombo((c) => c + 1);
      setBlitzTimeLeft((t) => Math.min(60, t + 2)); // +2s bonus
    } else {
      setBlitzFeedback("wrong");
      setBlitzCombo(0);
    }

    setTimeout(() => {
      setBlitzFeedback(null);
      setEliminatedOptions([]);
      if (blitzIdx + 1 < blitzQuestions.length) {
        setBlitzIdx((i) => i + 1);
      } else {
        finishBlitzGame();
      }
    }, 600);
  };

  const handleRequestAIHint = () => {
    if (userSubscription !== "premium" && aiHintsRemaining <= 0) {
      setToastLimitNotice("Kunlik 3 ta bepul AI maslahati tugadi! Premium tarifda cheksiz foydalaning.");
      setTimeout(() => setToastLimitNotice(null), 4000);
      return;
    }

    const currentQ = blitzQuestions[blitzIdx];
    const wrongIndices: number[] = [];
    currentQ.options.forEach((_, idx) => {
      if (idx !== currentQ.correctIndex) wrongIndices.push(idx);
    });

    const toEliminate = wrongIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
    setEliminatedOptions(toEliminate);

    const hintMsg = currentQ.explanation
      ? `AI Maslahati: ${currentQ.explanation}`
      : `AI Tahlili: "${currentQ.topic || currentQ.subject}" qoidalariga eʼtibor bering. Notoʻgʻri javoblar elakdan oʻtkazildi!`;

    setAiHintText(hintMsg);
    if (userSubscription !== "premium") {
      setAiHintsRemaining((prev) => Math.max(0, prev - 1));
    }
    setIsAiModalOpen(true);
  };

  // Start Marathon Game
  const startMarathonGame = () => {
    setMarathonIdx(0);
    setMarathonLives(3);
    setMarathonSelectedOption(null);
    setMarathonShowExplanation(false);
    setMarathonEarnedXP(0);
    setMarathonEarnedCoins(0);
    setMarathonState("running");
  };

  const handleMarathonAnswer = (selectedIdx: number) => {
    if (marathonShowExplanation) return;

    setMarathonSelectedOption(selectedIdx);
    setMarathonShowExplanation(true);

    const currentQ = MARATHON_QUESTIONS[marathonIdx];
    const isCorrect = selectedIdx === currentQ.correctIndex;

    if (isCorrect) {
      const stepXP = currentQ.xpReward || 35;
      const stepCoins = Math.round(stepXP / 5);
      setMarathonEarnedXP((x) => x + stepXP);
      setMarathonEarnedCoins((c) => c + stepCoins);
      confetti({ particleCount: 40, spread: 60 });
    } else {
      setMarathonLives((l) => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          // Will transition after reviewing explanation
        }
        return nextLives;
      });
    }
  };

  const handleNextMarathonQuestion = () => {
    setMarathonSelectedOption(null);
    setMarathonShowExplanation(false);

    if (marathonLives <= 0) {
      setMarathonState("failed");
      if (marathonEarnedXP > 0) {
        onAwardRewards(marathonEarnedXP, marathonEarnedCoins, `Katta Bilim Marafoni (${MARATHON_QUESTIONS[marathonIdx]?.distanceKm || 0} km)`);
      }
      return;
    }

    if (marathonIdx + 1 < MARATHON_QUESTIONS.length) {
      const nextIdx = marathonIdx + 1;
      setMarathonIdx(nextIdx);

      // Halfway or major milestone checkpoint
      if (nextIdx === 9) {
        setMarathonState("checkpoint");
      }
    } else {
      // Won Marathon!
      setMarathonState("won");
      const bonusXP = 500;
      const totalXP = marathonEarnedXP + bonusXP;
      const totalCoins = marathonEarnedCoins + 50;
      confetti({ particleCount: 150, spread: 100 });
      onAwardRewards(totalXP, totalCoins, "Katta Bilim Marafoni Gʻolibi (42.2 km toʻliq masofa!)");
    }
  };

  const currentBlitzQ = blitzQuestions[blitzIdx];
  const currentMarathonQ = MARATHON_QUESTIONS[marathonIdx] || MARATHON_QUESTIONS[0];
  const marathonCurrentKm = currentMarathonQ.distanceKm;

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {toastLimitNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl bg-amber-950 text-amber-200 border border-amber-600 shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <Bot className="w-5 h-5 text-amber-400" />
          <span>{toastLimitNotice}</span>
        </div>
      )}

      {/* DTM VA MARAFON JILDLARI (DISTINCT TWO FOLDERS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>Imtihon & Bilim Jildlari (Tanlang)</span>
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {activeMode === "blitz" ? "1-Jild ochilgan" : "2-Jild ochilgan"}
          </span>
        </div>

        {/* Real physical folder tab bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FOLDER 1: DTM MARKAZI */}
          <button
            onClick={() => setActiveMode("blitz")}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between gap-3 shadow-sm ${
              activeMode === "blitz"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  {activeMode === "blitz" ? (
                    <FolderOpen className="w-6 h-6 text-amber-500" />
                  ) : (
                    <Folder className="w-6 h-6 text-amber-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300">
                      1-Jild
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      100 ta Savol
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Davlat Test Markazi (DTM) Blitz
                  </h3>
                </div>
              </div>
              <Zap className={`w-5 h-5 ${activeMode === "blitz" ? "text-amber-500" : "text-slate-400"}`} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              45 soniyali intensiv test sinovi, combo tizimi va AI 50/50 yordamchisi bilan haqiqiy DTM formatidagi savollar.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono border-t border-amber-200 dark:border-amber-900/40 pt-2 text-amber-800 dark:text-amber-400 font-bold">
              <span>⏱️ 45 Soniyalik Rejim</span>
              <span>{activeMode === "blitz" ? "✓ Jild Ochiq" : "Ochish uchun bosing →"}</span>
            </div>
          </button>

          {/* FOLDER 2: KATTA BILIM MARAFONI */}
          <button
            onClick={() => setActiveMode("marathon")}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between gap-3 shadow-sm ${
              activeMode === "marathon"
                ? "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 ring-2 ring-rose-400/40 shadow-lg shadow-rose-500/10"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  {activeMode === "marathon" ? (
                    <FolderOpen className="w-6 h-6 text-rose-500" />
                  ) : (
                    <Folder className="w-6 h-6 text-rose-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-800 dark:text-rose-300">
                      2-Jild
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      42.2 km Masofa
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    Respublika Katta Bilim Marafoni
                  </h3>
                </div>
              </div>
              <Flame className={`w-5 h-5 ${activeMode === "marathon" ? "text-rose-500" : "text-slate-400"}`} />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              19 ta chuqurlashtirilgan ilmiy bosqich, 3 ta jon tizimi (❤️❤️❤️) va har bir xatodan keyin batafsil formula yechimi.
            </p>

            <div className="flex items-center justify-between text-[11px] font-mono border-t border-rose-200 dark:border-rose-900/40 pt-2 text-rose-800 dark:text-rose-400 font-bold">
              <span>🏃‍♂️ 42.195 km Marafon</span>
              <span>{activeMode === "marathon" ? "✓ Jild Ochiq" : "Ochish uchun bosing →"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1-JILD ICHIDAGI HUJJAT VA DTM BLITZ TESTI */}
      {/* ======================================================== */}
      {activeMode === "blitz" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Folder Stamp Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>DTM Davlat Test Sinovlari Markazi Hujjati</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    № DTM-2026/A
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Oʻzbekiston Respublikasi Oliy taʼlim muassasalariga kirish imtihonlari standartlari
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRequestAIHint}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Bot className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <span>AI Maslahatchi ({aiHintsRemaining}/3 ta)</span>
              </button>
            </div>
          </div>

          {/* BLITZ STATE: READY */}
          {blitzState === "ready" && (
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25">
                <Gamepad2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  45 Soniyalik DTM Blitz Jangi! ⚡
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  100 ta DTM bazasidan 15 ta tasodifiy savol beriladi. Har bir toʻgʻri javob combo ball va qoʻshimcha vaqt keltiradi!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-amber-600 dark:text-amber-400 font-bold block mb-1">⏱️ 45 Soniya</span>
                  <span className="text-slate-600 dark:text-slate-300">Tez va aniq javob</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">🤖 3x AI Maslahat</span>
                  <span className="text-slate-600 dark:text-slate-300">50/50 variant qisqartirish</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">💎 XP & Koinlar</span>
                  <span className="text-slate-600 dark:text-slate-300">Darajani koʻtaradi</span>
                </div>
              </div>

              <button
                onClick={startBlitzGame}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Sinovni Boshlash</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* BLITZ STATE: PLAYING */}
          {blitzState === "playing" && currentBlitzQ && (
            <div className="space-y-6 relative">
              {/* Header Stats */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                      blitzTimeLeft <= 10
                        ? "bg-rose-100 dark:bg-rose-950/80 border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 animate-pulse"
                        : "bg-amber-100 dark:bg-slate-800 border-amber-300 dark:border-slate-700 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>{blitzTimeLeft}s</span>
                  </div>

                  {blitzCombo > 1 && (
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-950/80 border border-orange-400 dark:border-orange-500 text-orange-800 dark:text-orange-300 text-xs font-bold animate-bounce">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span>{blitzCombo}x Combo!</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
                    Savol: <strong className="text-slate-900 dark:text-white">{blitzIdx + 1}</strong> / {blitzQuestions.length}
                  </span>

                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
                    Ball: {blitzScore}
                  </div>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
                  style={{ width: `${((blitzIdx + 1) / blitzQuestions.length) * 100}%` }}
                />
              </div>

              {/* Subject Tag */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentBlitzQ.subject}
                </span>
                {currentBlitzQ.topic && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    • {currentBlitzQ.topic}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {currentBlitzQ.question}
                </h3>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentBlitzQ.options.map((opt, idx) => {
                  const isEliminated = eliminatedOptions.includes(idx);
                  return (
                    <button
                      key={idx}
                      disabled={isEliminated || blitzFeedback !== null}
                      onClick={() => handleBlitzAnswer(idx)}
                      className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${
                        isEliminated
                          ? "opacity-25 border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 line-through text-slate-400 cursor-not-allowed"
                          : "border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 active:scale-98 shadow-xs"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs font-mono font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {blitzFeedback !== null && idx === currentBlitzQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Animation Overlay */}
              {blitzFeedback === "correct" && (
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Toʻgʻri Javob! +1 Ball va +2s Vaqt qoʻshildi!</span>
                </div>
              )}

              {blitzFeedback === "wrong" && (
                <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-600 text-rose-900 dark:text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Xato javob! Keyingi savolga oʻtamiz...</span>
                </div>
              )}
            </div>
          )}

          {/* BLITZ STATE: FINISHED */}
          {blitzState === "finished" && (
            <div className="text-center py-6 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  DTM Blitz Yakunlandi! 🎉
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Siz 15 ta DTM savolidan <strong className="text-indigo-600 dark:text-indigo-400">{blitzScore} ta</strong> toʻgʻri javob berdingiz.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <span className="text-xs font-semibold block text-amber-700 dark:text-amber-400">Yutilgan Tajriba</span>
                  <span className="text-2xl font-extrabold font-mono">+{blitzScore * 15} XP</span>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200">
                  <span className="text-xs font-semibold block text-cyan-700 dark:text-cyan-400">Yutilgan Tangalar</span>
                  <span className="text-2xl font-extrabold font-mono">+{Math.floor(blitzScore * 3)} 💎</span>
                </div>
              </div>

              <button
                onClick={startBlitzGame}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yangi DTM Toʻplamini Boshlash</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2-JILD ICHIDAGI KATTA BILIM MARAFONI (42.2 KM) */}
      {/* ======================================================== */}
      {activeMode === "marathon" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Marathon Header */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Respublika Ilmiy Marafoni Qaydnomasi</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                    Masofa: 42.195 km
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chuqurlashtirilgan fizika, matematika va fan olimpiadalari savollari marshruti
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-3 py-1.5 rounded-xl">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 ${
                      i < marathonLives ? "text-rose-500 fill-rose-500" : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* MARATHON STATE: READY */}
          {marathonState === "ready" && (
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-500/25">
                <Flame className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  42.195 km Katta Ilmiy Marafon! 🏃‍♂️
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Har bir toʻgʻri javob sizni marraga yaqinlashtiradi. Sizda 3 ta jon bor (❤️❤️❤️). Xato qilingan savollarda toʻliq fizik-matematik yechim taqdim etiladi.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-left text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-rose-600 dark:text-rose-400 font-bold block mb-1">🎯 19 ta Bosqich</span>
                  <span className="text-slate-600 dark:text-slate-300">1.5 km dan 42.2 km gacha</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-amber-600 dark:text-amber-400 font-bold block mb-1">❤️ 3 ta Jon</span>
                  <span className="text-slate-600 dark:text-slate-300">Har bir xatoda tahlil</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold block mb-1">🏆 Marra Mukofoti</span>
                  <span className="text-slate-600 dark:text-slate-300">+500 XP va maxsus nishon</span>
                </div>
              </div>

              <button
                onClick={startMarathonGame}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-base shadow-xl shadow-rose-600/25 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Marafonni Boshlash (Start!)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* MARATHON STATE: RUNNING / CHECKPOINT */}
          {(marathonState === "running" || marathonState === "checkpoint") && (
            <div className="space-y-6">
              {/* Marathon Track Visual Progress */}
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Start (0 km)</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">🚩 Yarim marafon (21 km)</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">🏁 Finis (42.2 km)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-gradient-to-r from-rose-500 via-orange-500 to-emerald-500 h-full transition-all duration-500"
                    style={{
                      width: `${(currentMarathonQ.distanceKm / 42.195) * 100}%`,
                    }}
                  />
                  {/* 21km pin */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: "50%" }} />
                </div>
                <div className="flex justify-between text-xs font-mono pt-1">
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    Bosqich: {marathonIdx + 1} / {MARATHON_QUESTIONS.length}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    Masofa: {currentMarathonQ.distanceKm} km
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    +{marathonEarnedXP} XP
                  </span>
                </div>
              </div>

              {/* Subject Tag */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {currentMarathonQ.subject}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentMarathonQ.topic}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">
                  [Qiyinlik: {currentMarathonQ.difficulty}]
                </span>
              </div>

              {/* Question */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {currentMarathonQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentMarathonQ.options.map((opt, idx) => {
                  const isSelected = marathonSelectedOption === idx;
                  const isCorrect = idx === currentMarathonQ.correctIndex;

                  let btnStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200";

                  if (marathonShowExplanation) {
                    if (isCorrect) {
                      btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200";
                    } else {
                      btnStyle = "opacity-40 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={marathonShowExplanation}
                      onClick={() => handleMarathonAnswer(idx)}
                      className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer relative overflow-hidden flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs font-mono font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {marathonShowExplanation && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {marathonShowExplanation && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {marathonShowExplanation && (
                <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Fizik & Matematik Formula Yechimi:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {currentMarathonQ.explanation}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextMarathonQuestion}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>
                        {marathonLives <= 0
                          ? "Natijani Koʻrish"
                          : marathonIdx + 1 === MARATHON_QUESTIONS.length
                          ? "Finisga Yetish (Chempion!)"
                          : "Keyingi Masofaga Yugurish 🏃‍♂️"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* FAILED MARATHON */}
          {marathonState === "failed" && (
            <div className="text-center py-6 space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                  Marafon Yakunlandi! 🏁
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Jonlaringiz tugadi, lekin siz <strong className="text-rose-600 dark:text-rose-400">{currentMarathonQ.distanceKm} km</strong> masofani zabt etdingiz!
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                  <span className="text-xs font-semibold block text-rose-700 dark:text-rose-400">Yugurilgan Masofa</span>
                  <span className="text-2xl font-extrabold font-mono">{currentMarathonQ.distanceKm} km</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  <span className="text-xs font-semibold block text-emerald-700 dark:text-emerald-400">Jami Yutuq</span>
                  <span className="text-2xl font-extrabold font-mono">+{marathonEarnedXP} XP</span>
                </div>
              </div>

              <button
                onClick={startMarathonGame}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qaytadan Boshlash (Start chizigʻiga qaytish)</span>
              </button>
            </div>
          )}

          {/* WON MARATHON */}
          {marathonState === "won" && (
            <div className="text-center py-6 space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                  Siz Marafon Chempionisiz! 🏆
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Toʻliq 42.195 km masofani zabt etib, barcha chuqurlashtirilgan savollarni muvaffaqiyatli yengib oʻtdingiz!
                </p>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <span className="text-xs font-semibold block text-amber-700 dark:text-amber-400">Bonus Chempionlik XP</span>
                  <span className="text-2xl font-extrabold font-mono">+{marathonEarnedXP + 500} XP</span>
                </div>
                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200">
                  <span className="text-xs font-semibold block text-cyan-700 dark:text-cyan-400">Oltin Tangalar</span>
                  <span className="text-2xl font-extrabold font-mono">+{marathonEarnedCoins + 50} 💎</span>
                </div>
              </div>

              <button
                onClick={startMarathonGame}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yangi Marafon Yugurishi</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* AI Hint Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI Imtihon Maslahatchisi</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Kunlik bepul yordam: {aiHintsRemaining} ta qoldi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Mavzu boʻyicha maslahat:</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                {aiHintText}
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  💡 <strong>50/50 yordam:</strong> Variantlar ichidan 2 ta notoʻgʻri javob olib tashlandi!
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAiModalOpen(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer mt-2"
            >
              Tushundim, Davom Etish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
