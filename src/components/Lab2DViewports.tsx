import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Maximize2,
  Compass,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FormulaExplanationBox } from "./FormulaExplanationBox";

// ----------------------------------------------------
// 1. PYTHAGORAS 2D COMPONENT
// ----------------------------------------------------
interface Pythagoras2DProps {
  pythA: number;
  setPythA: (v: number) => void;
  pythB: number;
  setPythB: (v: number) => void;
  onVerify: () => void;
}

export const Pythagoras2D: React.FC<Pythagoras2DProps> = ({
  pythA,
  setPythA,
  pythB,
  setPythB,
  onVerify,
}) => {
  const pythC = Math.sqrt(pythA * pythA + pythB * pythB);
  const scale = 22; // pixels per unit

  // Coordinates in SVG:
  // Origin B (right-angle) at (170, 240)
  const originX = 170;
  const originY = 240;
  const ax = originX + pythA * scale; // Point C (a, 0)
  const ay = originY;
  const bx = originX; // Point B (0, 0)
  const by = originY;
  const cx = originX; // Point A (0, b)
  const cy = originY - pythB * scale;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 2D CONTROLS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] border border-cyan-200 dark:border-cyan-800">
              2D TEKISLIK
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              2D Pifagor Kvadratlari
            </h3>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          Dekart koordinata tekisligida toʻgʻri burchakli uchburchak tomonlariga qurilgan 2D kvadratlar yuzasining oʻzaro tengligini oʻrganing: S_a + S_b = S_c.
        </p>

        {/* PRESET BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPythA(3);
              setPythB(4);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            Misr (3-4-5)
          </button>
          <button
            onClick={() => {
              setPythA(6);
              setPythB(8);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            Klassik (6-8-10)
          </button>
          <button
            onClick={() => {
              setPythA(5);
              setPythB(12);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
          >
            (5-12-13)
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Katet A (gorizontal):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{pythA} sm</span>
          </div>
          <input
            type="range"
            min={3}
            max={10}
            step={1}
            value={pythA}
            onChange={(e) => setPythA(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
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

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Gipotenuza c = √(a² + b²):</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {pythC.toFixed(2)} sm
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Kvadrat S_a (A²):</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
              {pythA * pythA} sm²
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Kvadrat S_b (B²):</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
              {pythB * pythB} sm²
            </span>
          </div>
          <div className="flex justify-between text-slate-800 dark:text-slate-200 border-t border-slate-200 dark:border-slate-800 pt-2 font-bold">
            <span>S_c = S_a + S_b:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {pythA * pythA + pythB * pythB} sm²
            </span>
          </div>
        </div>

        <button
          onClick={onVerify}
          className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>2D Teoremani Tasdiqlash (+50 XP)</span>
        </button>
      </div>

      {/* 2D CANVAS VIEWPORT */}
      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
        <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">2D Tekislik & Kvadratlar Chizmasi</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Toʻgʻri burchak: ∠B = 90°
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 flex items-center justify-center relative overflow-hidden">
          <svg
            viewBox="0 0 500 420"
            className="w-full h-full max-h-[390px] overflow-visible"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              </pattern>
            </defs>

            {/* Background Cartesian Grid */}
            <rect width="500" height="420" fill="url(#grid)" opacity="0.35" />

            {/* Square on side B (left of vertical leg) */}
            <rect
              x={originX - pythB * scale}
              y={originY - pythB * scale}
              width={pythB * scale}
              height={pythB * scale}
              fill="rgba(6, 182, 212, 0.25)"
              stroke="#06b6d4"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={originX - (pythB * scale) / 2}
              y={originY - (pythB * scale) / 2}
              fill="#22d3ee"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              b² = {pythB * pythB} sm²
            </text>

            {/* Square on side A (below horizontal leg) */}
            <rect
              x={originX}
              y={originY}
              width={pythA * scale}
              height={pythA * scale}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#3b82f6"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={originX + (pythA * scale) / 2}
              y={originY + (pythA * scale) / 2}
              fill="#60a5fa"
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              a² = {pythA * pythA} sm²
            </text>

            {/* Square on hypotenuse C (rotated) */}
            {(() => {
              const angleDeg =
                (Math.atan2(by - cy, ax - bx) * 180) / Math.PI;
              const angleRad = (angleDeg * Math.PI) / 180;
              const cPx = pythC * scale;
              const x3 = ax - cPx * Math.sin(angleRad);
              const y3 = ay - cPx * Math.cos(angleRad);
              const x4 = cx - cPx * Math.sin(angleRad);
              const y4 = cy - cPx * Math.cos(angleRad);

              return (
                <g>
                  <polygon
                    points={`${ax},${ay} ${cx},${cy} ${x4},${y4} ${x3},${y3}`}
                    fill="rgba(245, 158, 11, 0.22)"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  <text
                    x={(ax + cx + x3 + x4) / 4}
                    y={(ay + cy + y3 + y4) / 4}
                    fill="#fbbf24"
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    c² = {pythA * pythA + pythB * pythB} sm²
                  </text>
                </g>
              );
            })()}

            {/* The Right Triangle ABC */}
            <polygon
              points={`${bx},${by} ${ax},${ay} ${cx},${cy}`}
              fill="rgba(99, 102, 241, 0.4)"
              stroke="#818cf8"
              strokeWidth="3"
            />

            {/* 90-degree corner marker */}
            <rect
              x={originX}
              y={originY - 16}
              width="16"
              height="16"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            <circle cx={originX + 8} cy={originY - 8} r="2" fill="#cbd5e1" />

            {/* Triangle Vertex Labels */}
            <circle cx={bx} cy={by} r="4" fill="#ffffff" />
            <text
              x={bx - 12}
              y={by + 16}
              fill="#ffffff"
              fontSize="12"
              fontWeight="bold"
            >
              B (90°)
            </text>

            <circle cx={ax} cy={ay} r="4" fill="#60a5fa" />
            <text
              x={ax + 8}
              y={ay + 16}
              fill="#60a5fa"
              fontSize="12"
              fontWeight="bold"
            >
              C ({pythA}sm)
            </text>

            <circle cx={cx} cy={cy} r="4" fill="#22d3ee" />
            <text
              x={cx - 16}
              y={cy - 10}
              fill="#22d3ee"
              fontSize="12"
              fontWeight="bold"
            >
              A ({pythB}sm)
            </text>

            {/* Hypotenuse Dimension Label */}
            <text
              x={(ax + cx) / 2 + 14}
              y={(ay + cy) / 2 - 14}
              fill="#f59e0b"
              fontSize="12"
              fontWeight="bold"
            >
              c = {pythC.toFixed(2)} sm
            </text>
          </svg>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">2D Pifagor Nisbati:</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {pythA}² + {pythB}² = {pythA * pythA} + {pythB * pythB} ={" "}
            {pythA * pythA + pythB * pythB} (c = {pythC.toFixed(2)} sm)
          </span>
        </div>

        <FormulaExplanationBox
          type="pythagoras"
          dimension="2d"
          params={{ pythA, pythB }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 2. ATOM 2D COMPONENT (BOHR MODEL)
// ----------------------------------------------------
interface Atom2DProps {
  atomElement: "H" | "He" | "Li" | "C" | "O";
  setAtomElement: (elem: "H" | "He" | "Li" | "C" | "O") => void;
  orbitalSpeed: number;
  setOrbitalSpeed: (speed: number) => void;
  onVerify: () => void;
}

export const Atom2D: React.FC<Atom2DProps> = ({
  atomElement,
  setAtomElement,
  orbitalSpeed,
  setOrbitalSpeed,
  onVerify,
}) => {
  const [angle, setAngle] = useState<number>(0);
  const [isQuantumJumping, setIsQuantumJumping] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + orbitalSpeed * 2.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [orbitalSpeed]);

  const elementConfigs = {
    H: {
      name: "Vodorod (H)",
      protons: 1,
      neutrons: 0,
      kElectrons: 1,
      lElectrons: 0,
      color: "#38bdf8",
      config: "1s¹",
    },
    He: {
      name: "Geliy (He)",
      protons: 2,
      neutrons: 2,
      kElectrons: 2,
      lElectrons: 0,
      color: "#facc15",
      config: "1s²",
    },
    Li: {
      name: "Litiy (Li)",
      protons: 3,
      neutrons: 4,
      kElectrons: 2,
      lElectrons: 1,
      color: "#ec4899",
      config: "1s² 2s¹",
    },
    C: {
      name: "Uglerod (C)",
      protons: 6,
      neutrons: 6,
      kElectrons: 2,
      lElectrons: 4,
      color: "#a855f7",
      config: "1s² 2s² 2p²",
    },
    O: {
      name: "Kislorod (O)",
      protons: 8,
      neutrons: 8,
      kElectrons: 2,
      lElectrons: 6,
      color: "#22c55e",
      config: "1s² 2s² 2p⁴",
    },
  };

  const cur = elementConfigs[atomElement];

  const handleQuantumJump = () => {
    if (isQuantumJumping) return;
    setIsQuantumJumping(true);
    confetti({ particleCount: 35, spread: 60 });
    setTimeout(() => {
      setIsQuantumJumping(false);
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-[10px] border border-cyan-200 dark:border-cyan-800">
            2D TEKISLIK
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
            2D Bor Atom Modeli
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          Niels Bohrning konsentrik kvant pogʻonalari: K-qobiq (n=1, maks 2e⁻) va L-qobiq (n=2, maks 8e⁻) boʻylab elektronlar harakati.
        </p>

        <div className="space-y-2">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block">
            Kimyoviy element:
          </span>
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
            <span className="text-slate-600 dark:text-slate-300 font-medium">Elektron tezligi:</span>
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
            <span>Element & Formula:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono">{cur.name} ({cur.config})</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Yadro zaryadi Z (Proton):</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">+{cur.protons}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>K-qobiq (n=1):</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{cur.kElectrons} ta e⁻</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>L-qobiq (n=2):</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{cur.lElectrons} ta e⁻</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleQuantumJump}
            disabled={isQuantumJumping}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{isQuantumJumping ? "Kvant sakramoqda..." : "Kvant Sakrash (Foton)"}</span>
          </button>
          <button
            onClick={onVerify}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all active:scale-95 cursor-pointer"
          >
            Tasdiqlash
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
        <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">2D Bor Energetik Qobiqlari</span>
          </div>
          {isQuantumJumping && (
            <span className="text-[11px] font-bold text-amber-400 animate-pulse flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ΔE = h·ν foton ajraldi!</span>
            </span>
          )}
        </div>

        <div className="w-full h-80 sm:h-96 flex items-center justify-center relative">
          <svg viewBox="0 0 400 400" className="w-72 h-72 sm:w-80 sm:h-80 overflow-visible">
            {/* K-Shell Ring (n=1) */}
            <circle
              cx="200"
              cy="200"
              r="60"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              opacity="0.6"
            />
            <text x="200" y="132" fill="#06b6d4" fontSize="10" textAnchor="middle" opacity="0.8">
              K-qobiq (n=1)
            </text>

            {/* L-Shell Ring (n=2) */}
            <circle
              cx="200"
              cy="200"
              r="115"
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              opacity="0.5"
            />
            <text x="200" y="78" fill="#818cf8" fontSize="10" textAnchor="middle" opacity="0.8">
              L-qobiq (n=2)
            </text>

            {/* Quantum emission wave if jumping */}
            {isQuantumJumping && (
              <path
                d="M 200 140 Q 230 110, 260 140 T 320 140"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                className="animate-pulse"
              />
            )}

            {/* K-Shell Electrons */}
            {Array.from({ length: cur.kElectrons }).map((_, i) => {
              const elAngle = (angle + i * 180) * (Math.PI / 180);
              const ex = 200 + 60 * Math.cos(elAngle);
              const ey = 200 + 60 * Math.sin(elAngle);
              return (
                <g key={`k-${i}`}>
                  <circle cx={ex} cy={ey} r="6" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={ex} y={ey + 3} fill="#050c1e" fontSize="8" fontWeight="bold" textAnchor="middle">
                    -
                  </text>
                </g>
              );
            })}

            {/* L-Shell Electrons */}
            {Array.from({ length: cur.lElectrons }).map((_, i) => {
              const elAngle =
                (-angle * 0.8 + (i * 360) / Math.max(1, cur.lElectrons)) *
                (Math.PI / 180);
              const r = isQuantumJumping && i === 0 ? 140 : 115;
              const ex = 200 + r * Math.cos(elAngle);
              const ey = 200 + r * Math.sin(elAngle);
              return (
                <g key={`l-${i}`}>
                  <circle cx={ex} cy={ey} r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={ex} y={ey + 3} fill="#050c1e" fontSize="8" fontWeight="bold" textAnchor="middle">
                    -
                  </text>
                </g>
              );
            })}

            {/* Central Nucleus with Protons & Neutrons */}
            <circle
              cx="200"
              cy="200"
              r="24"
              fill="url(#nucleusGradient)"
              stroke="#f43f5e"
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            <defs>
              <radialGradient id="nucleusGradient">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#9f1239" />
              </radialGradient>
            </defs>
            <text
              x="200"
              y="198"
              fill="#ffffff"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              {cur.protons}p⁺
            </text>
            <text
              x="200"
              y="210"
              fill="#cbd5e1"
              fontSize="9"
              textAnchor="middle"
            >
              {cur.neutrons}n⁰
            </text>
          </svg>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Elektron Konfiguratsiyasi:</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {cur.name}: {cur.config} ({cur.protons} proton, {cur.kElectrons + cur.lElectrons} elektron)
          </span>
        </div>

        <FormulaExplanationBox
          type="atom"
          dimension="2d"
          params={{ element: atomElement, speed: orbitalSpeed }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. OPTICS 2D COMPONENT (SNELL'S LAW & RAY TRACING)
// ----------------------------------------------------
interface Optics2DProps {
  prismAngle: number;
  setPrismAngle: (v: number) => void;
  prismMaterial: "crown" | "flint" | "diamond";
  setPrismMaterial: (v: "crown" | "flint" | "diamond") => void;
  onVerify: () => void;
}

export const Optics2D: React.FC<Optics2DProps> = ({
  prismAngle,
  setPrismAngle,
  prismMaterial,
  setPrismMaterial,
  onVerify,
}) => {
  const refractiveIndices = { crown: 1.52, flint: 1.66, diamond: 2.42 };
  const n = refractiveIndices[prismMaterial];

  // Snell's Law calculations:
  // sin(beta) = sin(alpha) / n
  const alphaRad = (prismAngle * Math.PI) / 180;
  const betaRad = Math.asin(Math.min(0.99, Math.sin(alphaRad) / n));
  const betaDeg = (betaRad * 180) / Math.PI;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] border border-amber-200 dark:border-amber-800">
            2D TEKISLIK
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
            2D Geometrik Optika
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          Snellius qonuni n₁·sin(α) = n₂·sin(β) boʻyicha prizma qirrasiga tushgan nurning sinishi va kamalak nurlarining dispersiyasini 2D chizmada tekshiring.
        </p>

        <div className="space-y-2">
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block">
            Prizma materiali:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
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
            <span className="text-slate-600 dark:text-slate-300 font-medium">Nur tushish burchagi α:</span>
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
            <span>Muhit koʻrsatkichi n₂:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{n}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Sinish burchagi β:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
              {betaDeg.toFixed(1)}°
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Ogʻish burchagi δ:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {(prismAngle - betaDeg).toFixed(1)}°
            </span>
          </div>
        </div>

        <button
          onClick={onVerify}
          className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>2D Optika Isbotini Saqlash (+50 XP)</span>
        </button>
      </div>

      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
        <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-bold">2D Nurlar Traektoriyasi & Dispersiya</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            n₁·sin(α) = n₂·sin(β)
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 flex items-center justify-center relative">
          <svg viewBox="0 0 520 380" className="w-full h-full max-h-[360px] overflow-visible">
            {/* Grid */}
            <rect width="520" height="380" fill="#020617" />

            {/* Prism Body (Equilateral Triangle in 2D) */}
            <polygon
              points="240,60 140,280 340,280"
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />
            <text x="240" y="220" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle" opacity="0.8">
              Prizma (n = {n})
            </text>

            {/* Incident White Ray from Left */}
            <line
              x1="40"
              y1={240 - prismAngle * 1.8}
              x2="180"
              y2="190"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="70" y={220 - prismAngle * 1.8} fill="#ffffff" fontSize="11" fontWeight="bold">
              Oq Nur (α = {prismAngle}°)
            </text>

            {/* Normal Dashed Line */}
            <line
              x1="130"
              y1="165"
              x2="230"
              y2="215"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <text x="125" y="155" fill="#94a3b8" fontSize="10">
              Normal
            </text>

            {/* Refracted Ray Inside Prism */}
            <line
              x1="180"
              y1="190"
              x2="280"
              y2="200"
              stroke="#38bdf8"
              strokeWidth="3"
            />

            {/* 7 Dispersed Rays Exiting to Observation Screen */}
            {[
              { color: "#ef4444", label: "Qizil (700nm)", yOff: -18 },
              { color: "#f97316", label: "Zargʻaldoq", yOff: -12 },
              { color: "#eab308", label: "Sariq", yOff: -6 },
              { color: "#22c55e", label: "Yashil", yOff: 0 },
              { color: "#06b6d4", label: "Moviy", yOff: 6 },
              { color: "#3b82f6", label: "Koʻk", yOff: 12 },
              { color: "#a855f7", label: "Binafsha (400nm)", yOff: 18 },
            ].map((ray, idx) => (
              <g key={idx}>
                <line
                  x1="280"
                  y1="200"
                  x2="460"
                  y2={220 + ray.yOff * (n * 0.7)}
                  stroke={ray.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* Observation Screen on Right */}
            <line x1="460" y1="140" x2="460" y2="300" stroke="#cbd5e1" strokeWidth="4" />
            <text x="470" y="160" fill="#cbd5e1" fontSize="10" fontWeight="bold">
              Spektr Ekrani
            </text>
            <text x="470" y="290" fill="#a855f7" fontSize="10">
              Binafsha
            </text>
            <text x="470" y="210" fill="#ef4444" fontSize="10">
              Qizil
            </text>
          </svg>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Snellius Qonuni:</span>
          <span className="font-mono font-bold text-amber-400 text-sm">
            1.0 · sin({prismAngle}°) = {n} · sin({betaDeg.toFixed(1)}°)
          </span>
        </div>

        <FormulaExplanationBox
          type="optics"
          dimension="2d"
          params={{ prismAngle, prismMaterial }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. PROJECTILE 2D COMPONENT (BALLISTIC TRAJECTORY)
// ----------------------------------------------------
interface Projectile2DProps {
  projVelocity: number;
  setProjVelocity: (v: number) => void;
  projAngle: number;
  setProjAngle: (v: number) => void;
  targetDistance: number;
  onAwardXP: (amount: number, reason: string) => void;
  onAwardRewards?: (xp: number, coins: number, reason: string) => void;
}

export const Projectile2D: React.FC<Projectile2DProps> = ({
  projVelocity,
  setProjVelocity,
  projAngle,
  setProjAngle,
  targetDistance,
  onAwardXP,
  onAwardRewards,
}) => {
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [ballT, setBallT] = useState<number>(0);
  const [resultMsg, setResultMsg] = useState<string | null>(null);

  const rad = (projAngle * Math.PI) / 180;
  const g = 9.8;
  const vy = projVelocity * Math.sin(rad);
  const vx = projVelocity * Math.cos(rad);
  const totalFlightTime = (2 * vy) / g;
  const maxRange = (projVelocity * projVelocity * Math.sin(2 * rad)) / g;
  const maxHeight = (vy * vy) / (2 * g);

  const fireCannon2D = () => {
    if (isFiring) return;
    setIsFiring(true);
    setResultMsg(null);
    setBallT(0);

    const startTime = Date.now();
    const duration = 1600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setBallT(progress);

      if (progress >= 1) {
        clearInterval(interval);
        setIsFiring(false);
        const diff = Math.abs(maxRange - targetDistance);

        if (diff <= 4.0) {
          setResultMsg("🎯 2D Nishon aniq urildi! (+80 XP va +25 💎)");
          confetti({ particleCount: 70, spread: 70 });
          if (onAwardRewards) {
            onAwardRewards(80, 25, "2D Parabolik traektoriya nishonini zabt etdi");
          } else {
            onAwardXP(80, "2D Parabolik traektoriya nishonini zabt etdi");
          }
        } else if (maxRange < targetDistance) {
          setResultMsg(`Toʻp ${diff.toFixed(1)} m yaqinroqqa tushdi. Tezlik yoki burchakni oshiring!`);
        } else {
          setResultMsg(`Toʻp ${diff.toFixed(1)} m uzoqroqqa oʻtib ketdi. Tezlikni kamaytiring!`);
        }
      }
    }, 20);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-800">
            2D TEKISLIK
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
            2D Parabolik Ballistika Grafigi
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          y(x) = x·tg(α) - (g·x²)/(2·v₀²·cos²α) matematik formulasi asosida 2D koordinata toʻrida parvoz egri chizigʻini hisoblang va nishonni urib tushiring.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Boshlangʻich tezlik v₀:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">{projVelocity} m/s</span>
          </div>
          <input
            type="range"
            min={15}
            max={40}
            step={1}
            value={projVelocity}
            onChange={(e) => setProjVelocity(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Otish burchagi α:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{projAngle}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={75}
            step={1}
            value={projAngle}
            onChange={(e) => setProjAngle(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Nishon masofasi:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">{targetDistance} metr</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Uchish masofasi L:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">{maxRange.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Maksimal balandlik H_max:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">{maxHeight.toFixed(1)} m</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Uchish vaqti t:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">{totalFlightTime.toFixed(2)} soniya</span>
          </div>
        </div>

        {resultMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-bold ${
              resultMsg.includes("aniq")
                ? "bg-emerald-950/80 text-emerald-200 border border-emerald-600"
                : "bg-amber-950/80 text-amber-200 border border-amber-600"
            }`}
          >
            {resultMsg}
          </div>
        )}

        <button
          onClick={fireCannon2D}
          disabled={isFiring}
          className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          <span>{isFiring ? "2D Parvoz Bajarilmoqda..." : "2D Zambarakdan Otish!"}</span>
        </button>
      </div>

      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
        <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-bold">2D Parabola Koordinata Oʻqi</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Nishon: X = {targetDistance}m
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 flex items-center justify-center relative">
          <svg viewBox="0 0 540 380" className="w-full h-full max-h-[360px] overflow-visible">
            {/* Coordinate Grid */}
            <line x1="50" y1="320" x2="500" y2="320" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="320" x2="50" y2="40" stroke="#475569" strokeWidth="2" />

            {/* X-axis ticks (0m to 90m) */}
            {[0, 20, 40, 60, 80].map((val) => {
              const xPos = 50 + val * 4.8;
              return (
                <g key={`x-${val}`}>
                  <line x1={xPos} y1="320" x2={xPos} y2="326" stroke="#94a3b8" />
                  <text x={xPos} y="342" fill="#94a3b8" fontSize="10" textAnchor="middle">
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Y-axis ticks (0m to 40m) */}
            {[0, 10, 20, 30].map((val) => {
              const yPos = 320 - val * 6.5;
              return (
                <g key={`y-${val}`}>
                  <line x1="44" y1={yPos} x2="50" y2={yPos} stroke="#94a3b8" />
                  <text x="38" y={yPos + 3} fill="#94a3b8" fontSize="10" textAnchor="end">
                    {val}m
                  </text>
                </g>
              );
            })}

            {/* Parabolic Path Curve */}
            {(() => {
              const points: string[] = [];
              const steps = 40;
              for (let i = 0; i <= steps; i++) {
                const xVal = (maxRange * i) / steps;
                const yVal = xVal * Math.tan(rad) - (g * xVal * xVal) / (2 * projVelocity * projVelocity * Math.cos(rad) * Math.cos(rad));
                const plotX = 50 + xVal * 4.8;
                const plotY = 320 - Math.max(0, yVal) * 6.5;
                points.push(`${plotX},${plotY}`);
              }
              return (
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                />
              );
            })()}

            {/* Max Height Vertex Point */}
            <circle
              cx={50 + (maxRange / 2) * 4.8}
              cy={320 - maxHeight * 6.5}
              r="4"
              fill="#10b981"
            />
            <text
              x={50 + (maxRange / 2) * 4.8}
              y={320 - maxHeight * 6.5 - 8}
              fill="#10b981"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              H_max = {maxHeight.toFixed(1)}m
            </text>

            {/* Target Flag at 65m */}
            <g transform={`translate(${50 + targetDistance * 4.8}, 320)`}>
              <line x1="0" y1="0" x2="0" y2="-40" stroke="#f59e0b" strokeWidth="2.5" />
              <polygon points="0,-40 20,-30 0,-20" fill="#f43f5e" />
              <circle cx="0" cy="0" r="4" fill="#f59e0b" />
              <text x="0" y="16" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                Nishon ({targetDistance}m)
              </text>
            </g>

            {/* Cannon Base & Barrel */}
            <g transform="translate(50, 320)">
              <circle cx="0" cy="0" r="12" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <line
                x1="0"
                y1="0"
                x2={24 * Math.cos(rad)}
                y2={-24 * Math.sin(rad)}
                stroke="#cbd5e1"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            {/* Ball flying in 2D */}
            {isFiring && (() => {
              const curX = maxRange * ballT;
              const curY = curX * Math.tan(rad) - (g * curX * curX) / (2 * projVelocity * projVelocity * Math.cos(rad) * Math.cos(rad));
              const plotX = 50 + curX * 4.8;
              const plotY = 320 - Math.max(0, curY) * 6.5;
              return (
                <circle
                  cx={plotX}
                  cy={plotY}
                  r="7"
                  fill="#fbbf24"
                  stroke="#ef4444"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              );
            })()}
          </svg>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Ballistika formulasi:</span>
          <span className="font-mono font-bold text-rose-400 text-sm">
            L = (v₀²·sin(2α)) / g = {maxRange.toFixed(1)} metr
          </span>
        </div>

        <FormulaExplanationBox
          type="projectile"
          dimension="2d"
          params={{ velocity: projVelocity, angle: projAngle }}
        />
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. SPRING 2D COMPONENT (HARMONIC OSCILLATION GRAPH)
// ----------------------------------------------------
interface Spring2DProps {
  springMass: number;
  setSpringMass: (v: number) => void;
  springK: number;
  setSpringK: (v: number) => void;
  onVerify: () => void;
}

export const Spring2D: React.FC<Spring2DProps> = ({
  springMass,
  setSpringMass,
  springK,
  setSpringK,
  onVerify,
}) => {
  const [dispOffset, setDispOffset] = useState<number>(0);
  const [wavePoints, setWavePoints] = useState<{ x: number; y: number }[]>([]);

  const omega = Math.sqrt(springK / springMass);
  const period = 2 * Math.PI * Math.sqrt(springMass / springK);
  const frequency = 1 / period;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      const amplitude = 32;
      const y = amplitude * Math.cos(omega * t);
      setDispOffset(y);

      setWavePoints((prev) => {
        const next = [...prev, { x: prev.length * 3, y }];
        if (next.length > 70) next.shift();
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [springMass, springK, omega]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-5 transition-colors">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
            2D TEKISLIK
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
            2D Guk Qonuni & Tebranish Grafigi
          </h3>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
          Garmonik tebranishning 2D x(t) = A·cos(ωt) toʻlqin grafigini ossillograf kabi jonli chizilishini va prujina elastiklik kuchini oʻrganing.
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
              {period.toFixed(2)} soniya
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Chastota ν = 1/T:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
              {frequency.toFixed(2)} Hz
            </span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Ogʻish x:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {dispOffset.toFixed(1)} sm
            </span>
          </div>
        </div>

        <button
          onClick={onVerify}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>2D Tebranishni Tasdiqlash (+50 XP)</span>
        </button>
      </div>

      <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden select-none min-h-[460px]">
        <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">2D Mayatnik & Jonli Ossillograf Grafigi</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            T = {period.toFixed(2)} s, ν = {frequency.toFixed(2)} Hz
          </span>
        </div>

        <div className="w-full h-80 sm:h-96 flex items-center justify-center relative">
          <svg viewBox="0 0 520 380" className="w-full h-full max-h-[360px] overflow-visible">
            {/* Split Screen: Left is Spring, Right is Oscillograph Wave */}
            <rect width="520" height="380" fill="#020617" />

            {/* Divider line */}
            <line x1="160" y1="20" x2="160" y2="360" stroke="#1e293b" strokeWidth="2" strokeDasharray="4,4" />

            {/* Left: Support Beam */}
            <rect x="30" y="40" width="100" height="12" fill="#334155" rx="3" />

            {/* Ruler */}
            <line x1="30" y1="52" x2="30" y2="320" stroke="#64748b" strokeWidth="1.5" />
            {[0, 10, 20, 30].map((cm) => (
              <g key={`ruler-${cm}`}>
                <line x1="26" y1={80 + cm * 6} x2="30" y2={80 + cm * 6} stroke="#94a3b8" />
                <text x="22" y={83 + cm * 6} fill="#94a3b8" fontSize="8" textAnchor="end">
                  {cm}
                </text>
              </g>
            ))}

            {/* 2D Spring Path */}
            <path
              d={`M 80 52 
                 L 80 70 
                 Q 95 ${85 + dispOffset * 0.1}, 80 ${100 + dispOffset * 0.2}
                 Q 65 ${115 + dispOffset * 0.3}, 80 ${130 + dispOffset * 0.4}
                 Q 95 ${145 + dispOffset * 0.5}, 80 ${160 + dispOffset * 0.6}
                 Q 65 ${175 + dispOffset * 0.7}, 80 ${190 + dispOffset * 0.8}
                 L 80 ${210 + dispOffset}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Hanging Weight */}
            <rect
              x="55"
              y={210 + dispOffset}
              width="50"
              height="38"
              fill="url(#weightGradient)"
              stroke="#38bdf8"
              strokeWidth="2"
              rx="6"
            />
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            <text
              x="80"
              y={234 + dispOffset}
              fill="#ffffff"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              {springMass} kg
            </text>

            {/* Connecting Pointer line to Oscilloscope */}
            <line
              x1="105"
              y1={229 + dispOffset}
              x2="190"
              y2={229 + dispOffset}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="2,2"
              opacity="0.7"
            />

            {/* Right: Oscilloscope Grid */}
            <rect x="180" y="40" width="310" height="300" fill="#0f172a" rx="8" stroke="#334155" />
            <line x1="180" y1="190" x2="490" y2="190" stroke="#475569" strokeWidth="1" strokeDasharray="2,2" />
            <text x="480" y="185" fill="#64748b" fontSize="10" textAnchor="end">
              Muvozanat (x=0)
            </text>

            {/* Sine Wave Curve */}
            {wavePoints.length > 1 && (
              <polyline
                points={wavePoints
                  .map((p, idx) => `${190 + idx * 4.2},${190 + p.y}`)
                  .join(" ")}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />
            )}

            {/* Oscilloscope Moving Pen Head */}
            <circle
              cx={190 + (wavePoints.length - 1) * 4.2}
              cy={190 + dispOffset}
              r="4"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Garmonik Tebranish Qonuni:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            T = 2π·√(m/k) = {period.toFixed(2)} s (ν = {frequency.toFixed(2)} Hz)
          </span>
        </div>

        <FormulaExplanationBox
          type="spring"
          dimension="2d"
          params={{ mass: springMass, k: springK }}
        />
      </div>
    </div>
  );
};
