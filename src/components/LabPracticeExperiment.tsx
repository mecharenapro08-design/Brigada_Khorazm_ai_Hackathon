import React, { useState, useEffect, useRef } from "react";
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  Calculator,
  Info,
  Sliders,
  Timer,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

interface LabPracticeExperimentProps {
  onAwardRewards?: (xp: number, coins: number, reason: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const LabPracticeExperiment: React.FC<LabPracticeExperimentProps> = ({
  onAwardRewards,
  onAwardXP,
}) => {
  // Tanlangan laboratoriya misoli
  const [activeExperiment, setActiveExperiment] = useState<"spring_hooke" | "pendulum_g">("spring_hooke");

  // === 1-MISOL: GUK QONUNI VA PRUJINA BIKRLIGI (k) ===
  const [springMassGrams, setSpringMassGrams] = useState<number>(250); // 250 g = 0.25 kg
  const [isSpringSimulating, setIsSpringSimulating] = useState<boolean>(false);
  const [springDisplacementCm, setSpringDisplacementCm] = useState<number>(0);
  const [userSpringKInput, setUserSpringKInput] = useState<string>("");
  const [springResultReport, setSpringResultReport] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    userK: number;
    actualK: number;
    errorMargin: number;
    message: string;
  } | null>(null);

  // Haqiqiy prujina parametri (Bikrligi k = 50 N/m)
  const ACTUAL_SPRING_K = 50.0; // 50 N/m
  const G = 9.8; // m/s^2
  const INITIAL_LENGTH_CM = 15.0; // Bo'sh prujina uzunligi

  // Prujina tebranish animatsiyasi
  useEffect(() => {
    if (!isSpringSimulating) {
      // Muvozanat holati: F = m*g = k * deltaX => deltaX = (m*g)/k (metrda)
      const massKg = springMassGrams / 1000;
      const forceN = massKg * G;
      const targetDeltaXCm = (forceN / ACTUAL_SPRING_K) * 100;
      setSpringDisplacementCm(Number(targetDeltaXCm.toFixed(2)));
      return;
    }

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const massKg = springMassGrams / 1000;
      const forceN = massKg * G;
      const targetDeltaXCm = (forceN / ACTUAL_SPRING_K) * 100;
      // Damping harmonic motion
      const decay = Math.exp(-frame * 0.05);
      const oscillation = Math.cos(frame * 0.4) * 4 * decay;
      setSpringDisplacementCm(Number((targetDeltaXCm + oscillation).toFixed(2)));

      if (frame > 60) {
        setIsSpringSimulating(false);
        setSpringDisplacementCm(Number(targetDeltaXCm.toFixed(2)));
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isSpringSimulating, springMassGrams]);

  const handleStartSpringExperiment = () => {
    setIsSpringSimulating(true);
    setSpringResultReport(null);
  };

  const handleCheckSpringResult = (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = parseFloat(userSpringKInput.replace(",", "."));
    if (isNaN(userVal) || userVal <= 0) {
      alert("Iltimos, musbat raqamli hisoblangan bikrlik qiymatini kiriting!");
      return;
    }

    const massKg = springMassGrams / 1000;
    const forceN = massKg * G;
    const deltaXMetr = springDisplacementCm / 100;
    const calculatedActualK = forceN / deltaXMetr;

    const errorMargin = Math.abs((userVal - calculatedActualK) / calculatedActualK) * 100;
    const isSuccess = errorMargin <= 5.0; // 5% dan kam xatolik

    if (isSuccess) {
      confetti({ particleCount: 70, spread: 80 });
      if (onAwardRewards) {
        onAwardRewards(60, 20, "Laboratoriya misolini aʼlo darajada hal qildi (Guk qonuni)");
      } else {
        onAwardXP(60, "Laboratoriya misolini aʼlo darajada hal qildi");
      }
    }

    setSpringResultReport({
      submitted: true,
      isCorrect: isSuccess,
      userK: userVal,
      actualK: Number(calculatedActualK.toFixed(1)),
      errorMargin: Number(errorMargin.toFixed(1)),
      message: isSuccess
        ? "Tabriklaymiz! Siz laboratoriya hisob-kitobini aʼlo darajada aniq bajardingiz!"
        : "Xatolik 5% dan yuqori boʻldi. Qaytadan tekshirib koʻring: k = F / Δx formulasi boʻyicha!",
    });
  };

  // === 2-MISOL: MATEMATIK MAYATNIK VA ERKIN TUSHISH TEZLANISHI (g) ===
  const [pendulumLengthM, setPendulumLengthM] = useState<number>(1.0); // 1.0 metr
  const [isPendulumRunning, setIsPendulumRunning] = useState<boolean>(false);
  const [pendulumTimeSec, setPendulumTimeSec] = useState<number>(0);
  const [pendulumOscillations, setPendulumOscillations] = useState<number>(10);
  const [userGInput, setUserGInput] = useState<string>("");
  const [pendulumReport, setPendulumReport] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    userG: number;
    actualG: number;
    errorMargin: number;
  } | null>(null);

  // Nazariy davr T = 2 * pi * sqrt(L / g)
  const theoreticalPeriod = 2 * Math.PI * Math.sqrt(pendulumLengthM / G);
  const totalTheoreticalTime = theoreticalPeriod * pendulumOscillations;

  useEffect(() => {
    let timer: any;
    if (isPendulumRunning) {
      const startTime = Date.now();
      timer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= totalTheoreticalTime) {
          setPendulumTimeSec(Number(totalTheoreticalTime.toFixed(2)));
          setIsPendulumRunning(false);
          clearInterval(timer);
        } else {
          setPendulumTimeSec(Number(elapsed.toFixed(2)));
        }
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPendulumRunning, totalTheoreticalTime]);

  const handleStartPendulum = () => {
    setPendulumTimeSec(0);
    setIsPendulumRunning(true);
    setPendulumReport(null);
  };

  const handleCheckPendulum = (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = parseFloat(userGInput.replace(",", "."));
    if (isNaN(userVal) || userVal <= 0) {
      alert("Iltimos, hisoblangan erkin tushish tezlanishi g qiymatini kiriting!");
      return;
    }

    const T = pendulumTimeSec / pendulumOscillations;
    const actualCalculatedG = (4 * Math.PI * Math.PI * pendulumLengthM) / (T * T);
    const errorMargin = Math.abs((userVal - actualCalculatedG) / actualCalculatedG) * 100;
    const isSuccess = errorMargin <= 5.0;

    if (isSuccess) {
      confetti({ particleCount: 70, spread: 80 });
      if (onAwardRewards) {
        onAwardRewards(60, 20, "Matematik mayatnik orqali g ni muvaffaqiyatli aniqladi");
      } else {
        onAwardXP(60, "Matematik mayatnik tajribasini bajardi");
      }
    }

    setPendulumReport({
      submitted: true,
      isCorrect: isSuccess,
      userG: userVal,
      actualG: Number(actualCalculatedG.toFixed(2)),
      errorMargin: Number(errorMargin.toFixed(1)),
    });
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Mustaqil Laboratoriya Ishi & Amaliy Eksperiment</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">
            Mustaqil Ish: Hisoblash va Eksperimental Sinov
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Fizik parametrlarni oʻzgartirib mustaqil tajriba oʻtkazing, oʻlchov natijalari asosida hisoblang va javobingizni tekshirib XP toʻplang!
          </p>
        </div>

        {/* Experiment Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setActiveExperiment("spring_hooke");
              setSpringResultReport(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeExperiment === "spring_hooke"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            1. Prujina Bikrligi (k)
          </button>
          <button
            onClick={() => {
              setActiveExperiment("pendulum_g");
              setPendulumReport(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeExperiment === "pendulum_g"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            2. Erkin Tushish Tezlanishi (g)
          </button>
        </div>
      </div>

      {/* EXPERIMENT 1: SPRING HOOKE'S LAW */}
      {activeExperiment === "spring_hooke" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Visual Stand */}
          <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between relative overflow-hidden min-h-[380px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-cyan-400 font-bold">🧪 Virtual Prujina Dinamometri</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                g = 9.8 m/s²
              </span>
            </div>

            {/* Visual Canvas of Spring with Ruler */}
            <div className="flex-1 flex items-center justify-center gap-8 py-4 relative">
              {/* Ruler */}
              <div className="w-10 h-64 bg-amber-100/90 border border-amber-300 rounded flex flex-col justify-between py-2 px-1 text-[8px] font-mono text-amber-900 select-none shadow-md">
                <span>0 cm</span>
                <span>5 cm</span>
                <span>10 cm</span>
                <span>15 cm (L₀)</span>
                <span>20 cm</span>
                <span>25 cm</span>
                <span>30 cm</span>
              </div>

              {/* Spring and Mass */}
              <div className="flex flex-col items-center">
                {/* Fixed Top Stand */}
                <div className="w-20 h-3 bg-slate-700 rounded-t border-b-2 border-indigo-500" />

                {/* Spring Coil (Height changes dynamically) */}
                <div
                  className="w-8 border-x-4 border-dashed border-cyan-400 transition-all duration-300 relative flex items-center justify-center"
                  style={{
                    height: `${Math.max(60, (INITIAL_LENGTH_CM + springDisplacementCm) * 6)}px`,
                  }}
                >
                  <div className="w-0.5 h-full bg-cyan-500/40" />
                </div>

                {/* Hanging Load (Weight) */}
                <div
                  className="w-14 rounded-lg bg-linear-to-b from-slate-600 to-slate-800 border border-slate-500 text-white text-[10px] font-bold font-mono py-2 text-center shadow-lg transition-transform"
                >
                  {springMassGrams} g
                </div>
              </div>

              {/* Live Measurements on the right */}
              <div className="space-y-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Boshlangʻich uzunlik L₀:</span>
                  <span className="text-white font-bold">{INITIAL_LENGTH_CM} sm</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Hozirgi uzunlik L:</span>
                  <span className="text-indigo-300 font-bold">
                    {(INITIAL_LENGTH_CM + springDisplacementCm).toFixed(2)} sm
                  </span>
                </div>
                <div className="pt-1 border-t border-slate-800">
                  <span className="text-cyan-400 text-[10px] block font-sans font-bold">
                    Choʻzilish Δx = L - L₀:
                  </span>
                  <span className="text-cyan-300 text-sm font-black">
                    {springDisplacementCm.toFixed(2)} sm ({(springDisplacementCm / 100).toFixed(4)} m)
                  </span>
                </div>
                <div>
                  <span className="text-emerald-400 text-[10px] block font-sans font-bold">
                    Ogʻirlik kuchi F = m · g:
                  </span>
                  <span className="text-emerald-300 text-sm font-black">
                    {((springMassGrams / 1000) * G).toFixed(2)} N
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Yuk massasi (m): <strong className="text-white">{springMassGrams} g</strong></span>
                <span className="text-slate-400">({(springMassGrams / 1000).toFixed(3)} kg)</span>
              </div>
              <input
                type="range"
                min="50"
                max="600"
                step="25"
                value={springMassGrams}
                onChange={(e) => setSpringMassGrams(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <button
                onClick={handleStartSpringExperiment}
                disabled={isSpringSimulating}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isSpringSimulating ? "Tebranmoqda..." : "Tajribani Oʻtkazish (Sinash)"}</span>
              </button>
            </div>
          </div>

          {/* Right: Theory, Task and Calculation Form */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Laboratoriya Vazifasi va Nazariy Formula:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Guk qonuniga koʻra: <strong>F = k · Δx</strong>, bu yerda <em>F</em> — osilgan yukning ogʻirlik kuchi (F = m · g), <em>Δx</em> — prujina choʻzilishi (metrda).
              </p>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 font-mono text-center text-sm font-bold text-indigo-600 dark:text-cyan-400 border border-indigo-100 dark:border-indigo-900">
                k = F / Δx = (m · g) / Δx
              </div>
            </div>

            {/* Answer Input and Verification */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>Oʻzingizning hisob-kitobingizni tekshiring:</span>
              </h4>

              <form onSubmit={handleCheckSpringResult} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                    Siz hisoblab topgan bikrlik <strong>k</strong> qiymati (N/m):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userSpringKInput}
                      onChange={(e) => setUserSpringKInput(e.target.value)}
                      placeholder="Masalan: 50.0"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                    <span className="text-xs font-mono font-bold text-slate-500">N/m</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hisoblangan Natijani Tekshirish va Xulosalash</span>
                </button>
              </form>

              {/* Feedback Report */}
              {springResultReport && (
                <div
                  className={`p-4 rounded-xl border transition-all space-y-2 animate-in fade-in ${
                    springResultReport.isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {springResultReport.isCorrect ? (
                      <>
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <span>{springResultReport.message}</span>
                      </>
                    ) : (
                      <span>{springResultReport.message}</span>
                    )}
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div>Siz kiritgan: <strong>{springResultReport.userK} N/m</strong></div>
                    <div>Tajribaviy aniq qiymat: <strong>{springResultReport.actualK} N/m</strong></div>
                    <div>Nisbiy xatolik (ε): <strong>{springResultReport.errorMargin}%</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EXPERIMENT 2: PENDULUM G DETERMINATION */}
      {activeExperiment === "pendulum_g" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Pendulum Visual Simulator */}
          <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-cyan-400 font-bold">⏱️ Matematik Mayatnik Stendi</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                N = {pendulumOscillations} ta toʻliq tebranish
              </span>
            </div>

            {/* Pendulum Animation */}
            <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
              <div className="w-16 h-2 bg-slate-600 rounded-t" />
              <div
                className={`w-0.5 bg-slate-400 transition-all origin-top flex flex-col items-center justify-end ${
                  isPendulumRunning ? "animate-bounce" : ""
                }`}
                style={{ height: `${pendulumLengthM * 160}px` }}
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-500 to-rose-500 border-2 border-white shadow-xl flex items-center justify-center text-[8px] font-bold text-white">
                  m
                </div>
              </div>

              {/* Stopwatch Display */}
              <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Elektron Sekundomer
                </span>
                <span className="text-2xl font-black font-mono text-cyan-400">
                  {pendulumTimeSec.toFixed(2)} s
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Ip uzunligi (L): <strong className="text-white">{pendulumLengthM} metr</strong></span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pendulumLengthM}
                onChange={(e) => setPendulumLengthM(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <button
                onClick={handleStartPendulum}
                disabled={isPendulumRunning}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                <Timer className="w-4 h-4" />
                <span>{isPendulumRunning ? "Tebranish sanalmoqda..." : "Sekundomerni Boshlash (N=10)"}</span>
              </button>
            </div>
          </div>

          {/* Right: Formula and Verification */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-200">
                <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Matematik Mayatnik Formulalari:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                1. Bitta toʻliq tebranish davri: <strong>T = t / N</strong><br />
                2. Erkin tushish tezlanishi formulasi: <strong>g = (4 · π² · L) / T²</strong>
              </p>
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 font-mono text-center text-sm font-bold text-purple-600 dark:text-cyan-400 border border-purple-100 dark:border-purple-900">
                g = (4 · 3.1416² · {pendulumLengthM}) / T²
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-500" />
                <span>Hisoblangan g qiymatini kiriting:</span>
              </h4>

              <form onSubmit={handleCheckPendulum} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1 font-medium">
                    Siz topgan <strong>g</strong> tezlanishi (m/s²):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={userGInput}
                      onChange={(e) => setUserGInput(e.target.value)}
                      placeholder="Masalan: 9.8"
                      className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                    <span className="text-xs font-mono font-bold text-slate-500">m/s²</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tekshirish va Xulosa Olish</span>
                </button>
              </form>

              {pendulumReport && (
                <div
                  className={`p-4 rounded-xl border transition-all space-y-2 animate-in fade-in ${
                    pendulumReport.isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                      : "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  <div className="font-bold text-sm">
                    {pendulumReport.isCorrect ? "Ajoyib natija! g aniqlandi!" : "Qaytadan hisoblang!"}
                  </div>
                  <div className="text-xs space-y-1 font-mono">
                    <div>Sizning natija: <strong>{pendulumReport.userG} m/s²</strong></div>
                    <div>Eksperiment natijasi: <strong>{pendulumReport.actualG} m/s²</strong></div>
                    <div>Xatolik: <strong>{pendulumReport.errorMargin}%</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
