import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Eye,
  Compass,
  Cpu,
  Sparkles,
  Target,
  Activity,
  CheckCircle2,
  Diamond,
  Play,
  Layers,
  Trophy,
  Maximize2,
  Minimize2,
  FlaskConical,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile, LabTask } from "../types";
import { LAB_TASKS } from "../data/labTasks";
import { LabTasksPanel } from "./LabTasksPanel";
import { LabPracticeExperiment } from "./LabPracticeExperiment";
import {
  Pythagoras2D,
  Atom2D,
  Optics2D,
  Projectile2D,
  Spring2D,
} from "./Lab2DViewports";
import {
  Pythagoras3DReal,
  Atom3DReal,
  Optics3DReal,
  Projectile3DReal,
  Spring3DReal,
} from "./Lab3DViewports";
import { FormulaExplanationBox } from "./FormulaExplanationBox";

interface InteractiveLabProps {
  initialType?: string;
  onAwardXP: (amount: number, reason: string) => void;
  onAwardRewards?: (xp: number, coins: number, reason: string) => void;
  userProfile?: UserProfile;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({
  initialType = "pythagoras",
  onAwardXP,
  onAwardRewards,
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialType);

  // 2D vs 3D DIMENSION MODE WITH PERSISTENCE
  const [dimensionMode, setDimensionMode] = useState<"2d" | "3d">(() => {
    return (localStorage.getItem("aimaktab_lab_dimension") as "2d" | "3d") || "3d";
  });

  const handleToggleDimension = (mode: "2d" | "3d") => {
    setDimensionMode(mode);
    localStorage.setItem("aimaktab_lab_dimension", mode);
  };

  // COMPLETED LAB TASKS PERSISTENCE
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("aimaktab_completed_lab_tasks");
      return saved ? JSON.parse(saved) : ["task-pyth-2d-1"];
    } catch {
      return ["task-pyth-2d-1"];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "aimaktab_completed_lab_tasks",
      JSON.stringify(completedTaskIds)
    );
  }, [completedTaskIds]);

  const triggerReward = (xp: number, coins: number, reason: string) => {
    if (onAwardRewards) {
      onAwardRewards(xp, coins, reason);
    } else {
      onAwardXP(xp, reason);
    }
  };

  useEffect(() => {
    if (initialType) {
      if (initialType === "ohm") {
        setActiveTab("optics3d");
      } else if (initialType === "sort_algorithm" || initialType === "dna") {
        setActiveTab("atom3d");
      } else if (initialType === "practice_exp") {
        setActiveTab("practice_exp");
      } else if (initialType === "custom_formula") {
        setActiveTab("pythagoras");
      } else {
        setActiveTab(initialType);
      }
    }
  }, [initialType]);

  // 3D VIEWPORT CAMERA CONTROLS
  const [rotX, setRotX] = useState<number>(22);
  const [rotY, setRotY] = useState<number>(-35);
  const [zoom] = useState<number>(1);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; startRotX: number; startRotY: number }>({
    x: 0,
    y: 0,
    startRotX: 22,
    startRotY: -35,
  });

  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      setRotY((y) => (y + 0.8) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isAutoRotate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startRotX: rotX,
      startRotY: rotY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const newRotX = Math.max(-60, Math.min(80, dragStartRef.current.startRotX - dy * 0.4));
    const newRotY = (dragStartRef.current.startRotY + dx * 0.5) % 360;
    setRotX(newRotX);
    setRotY(newRotY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setCameraPreset = (preset: "iso" | "front" | "top") => {
    setIsAutoRotate(false);
    if (preset === "iso") {
      setRotX(25);
      setRotY(-35);
    } else if (preset === "front") {
      setRotX(0);
      setRotY(0);
    } else if (preset === "top") {
      setRotX(75);
      setRotY(0);
    }
  };

  // 1. PYTHAGORAS STATE
  const [pythA, setPythA] = useState<number>(6);
  const [pythB, setPythB] = useState<number>(8);
  const pythC = Math.sqrt(pythA * pythA + pythB * pythB);

  // 2. ATOM & QUANTUM ORBITALS STATE
  const [atomElement, setAtomElement] = useState<"H" | "He" | "Li" | "C" | "O">("Li");
  const [orbitalSpeed, setOrbitalSpeed] = useState<number>(1);
  const [atomAngle, setAtomAngle] = useState<number>(0);

  useEffect(() => {
    if (activeTab !== "atom3d") return;
    const interval = setInterval(() => {
      setAtomAngle((prev) => (prev + orbitalSpeed * 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [activeTab, orbitalSpeed]);

  const elementConfigs = {
    H: { name: "Vodorod (H)", protons: 1, neutrons: 0, electrons: 1, color: "#38bdf8", mass: "1.008 u" },
    He: { name: "Geliy (He)", protons: 2, neutrons: 2, electrons: 2, color: "#facc15", mass: "4.002 u" },
    Li: { name: "Litiy (Li)", protons: 3, neutrons: 4, electrons: 3, color: "#ec4899", mass: "6.94 u" },
    C: { name: "Uglerod (C)", protons: 6, neutrons: 6, electrons: 6, color: "#a855f7", mass: "12.011 u" },
    O: { name: "Kislorod (O)", protons: 8, neutrons: 8, electrons: 8, color: "#22c55e", mass: "15.999 u" },
  };
  const curElem = elementConfigs[atomElement];

  // 3. OPTICAL PRISM & DISPERSION STATE
  const [prismAngle, setPrismAngle] = useState<number>(45);
  const [prismMaterial, setPrismMaterial] = useState<"crown" | "flint" | "diamond">("crown");
  const refractiveIndices = { crown: 1.52, flint: 1.66, diamond: 2.42 };

  // 4. PROJECTILE / PARABOLIC SNIPER STATE
  const [projVelocity, setProjVelocity] = useState<number>(26);
  const [projAngle, setProjAngle] = useState<number>(45);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [projBallProgress, setProjBallProgress] = useState<number>(0);
  const targetDistance = 65;
  const [projResult, setProjResult] = useState<string | null>(null);

  const rad = (projAngle * Math.PI) / 180;
  const g = 9.8;
  const vy = projVelocity * Math.sin(rad);
  const maxRange = (projVelocity * projVelocity * Math.sin(2 * rad)) / g;
  const maxHeight = (vy * vy) / (2 * g);

  const launchProjectile3D = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    setProjResult(null);
    setProjBallProgress(0);

    const startTime = Date.now();
    const duration = 1800;

    const animTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setProjBallProgress(progress);

      if (progress >= 1) {
        clearInterval(animTimer);
        setIsLaunching(false);
        const distanceDiff = Math.abs(maxRange - targetDistance);

        if (distanceDiff <= 4.0) {
          setProjResult("Nishon 3D fazoda aniq urildi! 🎯 (+80 XP va +25 💎)");
          confetti({ particleCount: 70, spread: 70 });
          triggerReward(80, 25, "3D Parabolik snayper nishonini zabt etdi");
        } else if (maxRange < targetDistance) {
          setProjResult(`Toʻp ${distanceDiff.toFixed(1)} m yaqinroqqa tushdi. Tezlikni oshiring!`);
        } else {
          setProjResult(`Toʻp ${distanceDiff.toFixed(1)} m uzoqroqqa oʻtib ketdi. Tezlik yoki burchakni kamaytiring!`);
        }
      }
    }, 20);
  };

  // 5. HOOKE'S LAW / SPRING OSCILLATOR
  const [springMass, setSpringMass] = useState<number>(2.5);
  const [springK, setSpringK] = useState<number>(40);
  const [springOffset, setSpringOffset] = useState<number>(0);

  useEffect(() => {
    if (activeTab !== "spring3d" || dimensionMode !== "3d") return;
    const omega = Math.sqrt(springK / springMass);
    const start = Date.now();

    const interval = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      const amplitude = 35 * Math.exp(-0.04 * t);
      const disp = amplitude * Math.cos(omega * t);
      setSpringOffset(disp);
    }, 25);

    return () => clearInterval(interval);
  }, [activeTab, dimensionMode, springMass, springK]);

  // TASK VERIFICATION AND CLAIMING ENGINE
  const canClaimTask = (task: LabTask): boolean => {
    switch (task.id) {
      case "task-pyth-2d-1":
        return pythA === 3 && pythB === 4;
      case "task-pyth-2d-2":
        return pythA === 6 && pythB === 8;
      case "task-pyth-3d-1":
        return dimensionMode === "3d";
      case "task-pyth-3d-2":
        return pythA === 9 && pythB === 10;
      case "task-atom-2d-1":
        return atomElement === "Li";
      case "task-atom-2d-2":
        return atomElement === "C";
      case "task-atom-3d-1":
        return atomElement === "O";
      case "task-atom-3d-2":
        return atomElement === "He" && orbitalSpeed >= 2.5;
      case "task-optics-2d-1":
        return prismAngle === 45;
      case "task-optics-2d-2":
        return prismMaterial === "flint";
      case "task-optics-3d-1":
        return prismMaterial === "diamond";
      case "task-optics-3d-2":
        return prismAngle >= 60;
      case "task-proj-2d-1":
        return projVelocity === 26 && projAngle === 45;
      case "task-proj-2d-2":
        return projAngle === 30;
      case "task-proj-3d-1":
        return dimensionMode === "3d" && Math.abs(maxRange - targetDistance) <= 4.0;
      case "task-proj-3d-2":
        return projVelocity >= 28;
      case "task-spring-2d-1":
        return springMass === 2.5 && springK === 40;
      case "task-spring-2d-2":
        return springMass >= 4.5;
      case "task-spring-3d-1":
        return dimensionMode === "3d";
      case "task-spring-3d-2":
        return springK >= 80;
      default:
        return true;
    }
  };

  const handleClaimTask = (task: LabTask) => {
    if (completedTaskIds.includes(task.id)) return;

    if (!canClaimTask(task)) {
      alert(`Topshiriq shartlari hali toʻliq bajarilmadi!\nShart: ${task.targetCriteria}\nMaslahat: ${task.hint}`);
      return;
    }

    setCompletedTaskIds((prev) => [...prev, task.id]);
    confetti({ particleCount: 70, spread: 80 });
    triggerReward(task.xpReward, task.coinsReward, `Laboratoriya Zadaniyasi: "${task.title}"`);
  };

  const [isLabFullscreen, setIsLabFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isLabFullscreen) setIsLabFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLabFullscreen]);

  return (
    <div
      className={`space-y-6 transition-all duration-300 ${
        isLabFullscreen
          ? "fixed inset-0 z-50 bg-white dark:bg-black overflow-y-auto p-4 sm:p-8 text-slate-900 dark:text-white"
          : "relative"
      }`}
    >
      {/* LAB HEADER */}
      <div className="bg-white dark:bg-black/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            {dimensionMode === "2d" ? (
              <Layers className="w-4 h-4 text-cyan-500 animate-pulse" />
            ) : (
              <Box className="w-4 h-4 text-indigo-500 animate-pulse" />
            )}
            <span>2D & 3D Interaktiv Virtual Laboratoriya</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
            Fizika & Matematika Eksperiment Maydoni
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
            2D tekislik chizmalari va 3D fazoviy modellar oʻrtasida erkin almashtiring. Maxsus topshiriqlar (zadaniyalar)ni bajaring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* ASOSIY ALOHIDA KICHKINA TUGMA: 2D YOKI 3D REJIMGA OʻTKAZISH */}
          <div className="flex items-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 hidden sm:inline">
              Oʻlcham:
            </span>
            <button
              id="top-toggle-2d-mode-btn"
              onClick={() => handleToggleDimension("2d")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dimensionMode === "2d"
                  ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="2D"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D</span>
            </button>

            <button
              id="top-toggle-3d-mode-btn"
              onClick={() => handleToggleDimension("3d")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                dimensionMode === "3d"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-105"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="3D"
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D</span>
            </button>
          </div>

          <button
            onClick={() => setIsLabFullscreen(!isLabFullscreen)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm"
            title={isLabFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Laboratoriyani toʻliq ekranda ochish"}
          >
            {isLabFullscreen ? <Minimize2 className="w-4 h-4 text-rose-500" /> : <Maximize2 className="w-4 h-4 text-indigo-500" />}
          </button>

          {userProfile && (
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0 shadow-xs">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-8 h-8 rounded-lg object-cover border border-indigo-500"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{userProfile.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    <Diamond className="w-3 h-3" />
                    <span>{userProfile.coins} 💎</span>
                  </span>
                  <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {userProfile.xp} XP
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EXPERIMENT TOP TABS */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("pythagoras")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "pythagoras"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-800"
            }`}
          >
            <Box className="w-4 h-4 text-indigo-400" />
            <span>Pifagor Teoremasi</span>
          </button>

          <button
            onClick={() => setActiveTab("atom3d")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "atom3d"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Kvant Atom Orbitallari</span>
          </button>

          <button
            onClick={() => setActiveTab("optics3d")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "optics3d"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Optik Shisha Prizma</span>
          </button>

          <button
            onClick={() => setActiveTab("projectile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "projectile"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-800"
            }`}
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span>Parabolik Ballistika</span>
          </button>

          <button
            onClick={() => setActiveTab("spring3d")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "spring3d"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white border-slate-200 dark:border-slate-800"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Guk Qonuni (Prujina)</span>
          </button>

          <button
            id="lab-tab-practice-exp"
            onClick={() => setActiveTab("practice_exp")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              activeTab === "practice_exp"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400/50"
                : "bg-white dark:bg-black text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border-slate-200 dark:border-slate-800"
            }`}
          >
            <FlaskConical className="w-4 h-4 text-emerald-500" />
            <span>Mustaqil Ish (Amaliy Sinov)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
              +75 XP
            </span>
          </button>
        </div>
      </div>

      {/* 3D CAMERA CONTROLS BAR (SHOWN ONLY IN 3D MODE) */}
      {dimensionMode === "3d" && activeTab !== "practice_exp" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in shadow-lg">
          <div className="flex items-center gap-2 text-slate-300">
            <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
            <span className="font-bold">WebGL 3D:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
              Three.js 60 FPS
            </span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              (Sichqoncha bilan 360° erkin aylantiring, gʻildirak bilan masshtablang)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                isAutoRotate
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{isAutoRotate ? "Avto-Aylanish: Faol" : "Avto-Aylantirish"}</span>
            </button>

            <button
              onClick={() => setIsLabFullscreen(!isLabFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 px-2.5 text-xs font-semibold"
              title={isLabFullscreen ? "Toʻliq ekrandan chiqish (ESC)" : "Laboratoriyani toʻliq ekranga olish"}
            >
              {isLabFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Kichraytirish</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Toʻliq Ekran</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MUSTAQIL ISH / AMALIY EKSPERIMENT SINTEZI */}
      {activeTab === "practice_exp" && (
        <div className="animate-in fade-in duration-200">
          <LabPracticeExperiment
            onAwardXP={onAwardXP}
            onAwardRewards={onAwardRewards}
          />
        </div>
      )}

      {/* 2D MODE VIEWPORT */}
      {activeTab !== "practice_exp" && activeTab !== "custom_formula" && dimensionMode === "2d" && (
        <div className="animate-in fade-in duration-200">
          {activeTab === "pythagoras" && (
            <Pythagoras2D
              pythA={pythA}
              setPythA={setPythA}
              pythB={pythB}
              setPythB={setPythB}
              onVerify={() => {
                confetti({ particleCount: 50 });
                triggerReward(50, 15, "2D Pifagor teoremasini tasdiqladi");
              }}
            />
          )}

          {activeTab === "atom3d" && (
            <Atom2D
              atomElement={atomElement}
              setAtomElement={setAtomElement}
              orbitalSpeed={orbitalSpeed}
              setOrbitalSpeed={setOrbitalSpeed}
              onVerify={() => {
                confetti({ particleCount: 50 });
                triggerReward(50, 15, "2D Bor atom modelini tekshirdi");
              }}
            />
          )}

          {activeTab === "optics3d" && (
            <Optics2D
              prismAngle={prismAngle}
              setPrismAngle={setPrismAngle}
              prismMaterial={prismMaterial}
              setPrismMaterial={setPrismMaterial}
              onVerify={() => {
                confetti({ particleCount: 50 });
                triggerReward(50, 15, "2D Optika dispersiyasini qayd etdi");
              }}
            />
          )}

          {activeTab === "projectile" && (
            <Projectile2D
              projVelocity={projVelocity}
              setProjVelocity={setProjVelocity}
              projAngle={projAngle}
              setProjAngle={setProjAngle}
              targetDistance={targetDistance}
              onAwardXP={onAwardXP}
              onAwardRewards={onAwardRewards}
            />
          )}

          {activeTab === "spring3d" && (
            <Spring2D
              springMass={springMass}
              setSpringMass={setSpringMass}
              springK={springK}
              setSpringK={setSpringK}
              onVerify={() => {
                confetti({ particleCount: 50 });
                triggerReward(50, 15, "2D Guk qonuni tebranishini qayd etdi");
              }}
            />
          )}
        </div>
      )}

      {/* 3D MODE VIEWPORT */}
      {activeTab !== "practice_exp" && activeTab !== "custom_formula" && dimensionMode === "3d" && (
        <div className="animate-in fade-in duration-200">
          {activeTab === "pythagoras" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                    3D FAZO
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                    3D Pifagor Kublari & Prizma
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Katetlarga qurilgan 3D kublar hajmi va yuzalari gipotenuza kubi bilan mutanosibligini fazoviy koʻring.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Katet A (gorizontal):</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{pythA} sm</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    step={1}
                    value={pythA}
                    onChange={(e) => setPythA(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Katet B (vertikal):</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{pythB} sm</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={10}
                    step={1}
                    value={pythB}
                    onChange={(e) => setPythB(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span>Vizual Ranglar Qoʻllanmasi:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">90° Burchak</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-indigo-600 inline-block shrink-0" />
                      <span>Katet a² (Binafsha plita):</span>
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{pythA * pythA} katakcha</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-cyan-500 inline-block shrink-0" />
                      <span>Katet b² (Moviy plita):</span>
                    </span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{pythB * pythB} katakcha</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block shrink-0" />
                      <span>Gipotenuza c² (Sariq plita):</span>
                    </span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{(pythA * pythA + pythB * pythB)} katakcha</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-300 leading-relaxed">
                    💡 <strong>Teorema mohiyati:</strong> Ikkala katet kvadratlarining katakchalari sonini qoʻshsangiz ({pythA * pythA} + {pythB * pythB}), aynan gipotenuza kvadrati katakchalari ({pythA * pythA + pythB * pythB}) ga teng boʻladi!
                  </div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 60, spread: 60 });
                    triggerReward(50, 15, "3D Pifagor teoremasini tekshirdi");
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>3D Teoremani Tasdiqlash (+50 XP)</span>
                </button>
              </div>

              <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3D Fazo: Sichqoncha bilan 360° aylantiring & zoom qiling</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-950/80 px-2.5 py-1 rounded-md border border-indigo-800/60">
                    Real 3D Mesh
                  </span>
                </div>

                {/* REAL THREE.JS WEBGL 3D VIEWPORT */}
                <Pythagoras3DReal pythA={pythA} pythB={pythB} isAutoRotate={isAutoRotate} />

                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">3D Pifagor Tengligi:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    a² ({pythA * pythA}) + b² ({pythB * pythB}) = c² ({(pythA * pythA + pythB * pythB).toFixed(0)})
                  </span>
                </div>

                <FormulaExplanationBox
                  type="pythagoras"
                  dimension="3d"
                  params={{ pythA, pythB }}
                />
              </div>
            </div>
          )}

          {activeTab === "atom3d" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                    3D FAZO
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                    3D Kvant Atom Orbitallari
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Bohr-Rutherford modeli boʻyicha atom yadrosi va fazoda 3 xil tekislikda aylanuvchi elektron orbitallari.
                </p>

                <div className="space-y-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block">Elementni tanlang:</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {(["H", "He", "Li", "C", "O"] as const).map((sym) => (
                      <button
                        key={sym}
                        onClick={() => setAtomElement(sym)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          atomElement === sym
                            ? "bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-600/30"
                            : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Elektron aylanish tezligi:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{orbitalSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.5}
                    value={orbitalSpeed}
                    onChange={(e) => setOrbitalSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Modda nomi:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{curElem.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Protonlar:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{curElem.protons} ta</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Neytronlar:</span>
                    <span className="font-bold text-slate-500 dark:text-slate-400 font-mono">{curElem.neutrons} ta</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Elektronlar:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{curElem.electrons} ta</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 50 });
                    triggerReward(50, 15, "3D Kvant atom modelini toʻliq tahlil qildi");
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Kvant Holatni Saqlash (+50 XP)
                </button>
              </div>

              <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3D Fazoda protonlar, neytronlar va elektron orbital bulutini kuzating</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/60">
                    Real 3D Kvant Fazo
                  </span>
                </div>

                {/* REAL THREE.JS WEBGL 3D VIEWPORT */}
                <Atom3DReal element={atomElement} orbitalSpeed={orbitalSpeed} isAutoRotate={isAutoRotate} />

                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Bohr kvantlanish holati:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">
                    r_n = n²·a₀ ({curElem.electrons} ta elektron statsionar orbitalda)
                  </span>
                </div>

                <FormulaExplanationBox
                  type="atom"
                  dimension="3d"
                  params={{ element: atomElement, speed: orbitalSpeed }}
                />
              </div>
            </div>
          )}

          {activeTab === "optics3d" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                    3D FAZO
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                    3D Optik Shisha Prizma & Dispersiya
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Snellius qonuni n₁·sin(α) = n₂·sin(β) va Nyuton tajribasi: oq yorugʻlik nuri 3D prizmadan oʻtib kamalak spektriga ajraladi.
                </p>

                <div className="space-y-2">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block">Prizma materiali:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "crown", label: "Shisha n=1.52" },
                      { id: "flint", label: "Flint n=1.66" },
                      { id: "diamond", label: "Olmos n=2.42" },
                    ].map((mat) => (
                      <button
                        key={mat.id}
                        onClick={() => setPrismMaterial(mat.id as any)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                          prismMaterial === mat.id
                            ? "bg-amber-600 border-amber-400 text-white shadow-md shadow-amber-600/30"
                            : "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500"
                        }`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Nur tushish burchagi:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{prismAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={70}
                    step={1}
                    value={prismAngle}
                    onChange={(e) => setPrismAngle(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Sinish koʻrsatkichi n:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {refractiveIndices[prismMaterial]}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Eng koʻp sinadigan:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Binafsha (λ=400 nm)</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Eng kam sinadigan:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">Qizil (λ=700 nm)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 50 });
                    triggerReward(50, 15, "3D Optik prizma dispersiyasini sinadi");
                  }}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Spektrni Qayd Qilish (+50 XP)
                </button>
              </div>

              <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>3D Shisha Prizma: Lazer nuri va 7 rangli dispersiya nurlari</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/60">
                    Real 3D Refraction
                  </span>
                </div>

                {/* REAL THREE.JS WEBGL 3D VIEWPORT */}
                <Optics3DReal prismAngle={prismAngle} prismMaterial={prismMaterial} isAutoRotate={isAutoRotate} />

                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Dispersiya qonuniyati:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    n(λ) = A + B/λ² (Toʻlqin uzunligi qisqargani sari sinish koeffitsiyenti ortadi)
                  </span>
                </div>

                <FormulaExplanationBox
                  type="optics"
                  dimension="3d"
                  params={{ prismAngle, prismMaterial }}
                />
              </div>
            </div>
          )}

          {activeTab === "projectile" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                    3D FAZO
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                    3D Parabolik Ballistika Snayperi
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Zambarak burchagi va boshlangʻich tezlikni hisoblang, 3D fazoda nishonni urish uchun toʻgʻri traektoriyani toping.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Boshlangʻich tezlik v₀:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{projVelocity} m/s</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={40}
                    step={1}
                    value={projVelocity}
                    onChange={(e) => setProjVelocity(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Otish burchagi α:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{projAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={75}
                    step={1}
                    value={projAngle}
                    onChange={(e) => setProjAngle(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Nishon masofasi:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{targetDistance} metr</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Hisoblangan masofa L:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{maxRange.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Maksimal balandlik H_max:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{maxHeight.toFixed(1)} m</span>
                  </div>
                </div>

                {projResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold ${
                      projResult.includes("aniq")
                        ? "bg-emerald-950/80 text-emerald-200 border border-emerald-600"
                        : "bg-amber-950/80 text-amber-200 border border-amber-600"
                    }`}
                  >
                    {projResult}
                  </div>
                )}

                <button
                  onClick={launchProjectile3D}
                  disabled={isLaunching}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{isLaunching ? "3D Otish Bajarilmoqda..." : "3D Zambarakdan Otish!"}</span>
                </button>
              </div>

              <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-rose-400" />
                    <span>3D Ballistika Poligoni: Zambarak, Parabola trayektoriyasi va Nishon</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono font-bold bg-rose-950/80 px-2.5 py-1 rounded-md border border-rose-800/60">
                    Real 3D Physics
                  </span>
                </div>

                {/* REAL THREE.JS WEBGL 3D VIEWPORT */}
                <Projectile3DReal
                  velocity={projVelocity}
                  angle={projAngle}
                  targetDist={targetDistance}
                  isLaunching={isLaunching}
                  isAutoRotate={isAutoRotate}
                />

                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Ballistika formulasi:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    L = (v₀²·sin(2α)) / g = {maxRange.toFixed(1)} metr
                  </span>
                </div>

                <FormulaExplanationBox
                  type="projectile"
                  dimension="3d"
                  params={{ velocity: projVelocity, angle: projAngle }}
                />
              </div>
            </div>
          )}

          {activeTab === "spring3d" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] border border-indigo-200 dark:border-indigo-800">
                    3D FAZO
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                    3D Guk Qonuni & Tebranish Mayatnigi
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  F = -kx elastiklik kuchi va T = 2π√(m/k) tebranish davri boʻyicha garmonik tebranuvchi spiral prujina va yuk.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Yuk massasi m:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{springMass} kg</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={5}
                    step={0.5}
                    value={springMass}
                    onChange={(e) => setSpringMass(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Prujina bikrligi k:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{springK} N/m</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={springK}
                    onChange={(e) => setSpringK(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Davr T = 2π√(m/k):</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {(2 * Math.PI * Math.sqrt(springMass / springK)).toFixed(2)} soniya
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Chastota ν = 1/T:</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                      {(1 / (2 * Math.PI * Math.sqrt(springMass / springK))).toFixed(2)} Hz
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Ogʻish x:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
                      {springOffset.toFixed(1)} sm
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    confetti({ particleCount: 50 });
                    triggerReward(50, 15, "3D Guk qonuni tebranishlarini hisobladi");
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  Garmonik Tebranishni Yozib Olish (+50 XP)
                </button>
              </div>

              <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3D Fazoviy Metall Prujina & Tebranuvchi Ogʻirlik Yuki</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
                    Real 3D Mesh & Motion
                  </span>
                </div>

                {/* REAL THREE.JS WEBGL 3D VIEWPORT */}
                <Spring3DReal
                  springMass={springMass}
                  springK={springK}
                  springOffset={springOffset}
                  isAutoRotate={isAutoRotate}
                />

                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Garmonik tebranish davri:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    T = 2π·√(m/k) = {(2 * Math.PI * Math.sqrt(springMass / springK)).toFixed(2)} s
                  </span>
                </div>

                <FormulaExplanationBox
                  type="spring"
                  dimension="3d"
                  params={{ mass: springMass, k: springK }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEDICATED 2D & 3D ZADANIYALAR (TASKS) PANEL */}
      <LabTasksPanel
        tasks={LAB_TASKS}
        activeTab={activeTab}
        dimensionMode={dimensionMode}
        onToggleDimension={handleToggleDimension}
        completedTaskIds={completedTaskIds}
        onClaimTask={handleClaimTask}
        canClaimTask={canClaimTask}
      />
    </div>
  );
};
