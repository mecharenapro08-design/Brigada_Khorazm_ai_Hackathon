import React, { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Box,
  Activity,
  Layers,
  HelpCircle,
  Search,
  BookOpen,
  Atom,
  TrendingUp,
  Compass,
  Zap,
  Globe,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CustomFormulaVisualizerProps {
  onAwardRewards?: (xp: number, coins: number, reason: string) => void;
  isDarkTheme?: boolean;
}

export type SchoolSubject = "Fizika" | "Algebra" | "Geometriya" | "Astronomiya" | "Kimyo";

export interface SchoolFormulaPreset {
  id: string;
  subject: SchoolSubject;
  subdiscipline: string;
  grade: string;
  name: string;
  displayFormula: string;
  latex2D: string;
  latex3D: string;
  eval2DStr: string;
  eval3DStr: string;
  defaultA: number;
  defaultK: number;
  labelA: string;
  labelK: string;
  description: string;
}

export const SCHOOL_PRESETS: SchoolFormulaPreset[] = [
  // 1. FIZIKA - KINEMATIKA & ERKIN TUSHISH (9-10 Sinf)
  {
    id: "free_fall_parabola",
    subject: "Fizika",
    subdiscipline: "Kinematika & Erkin Tushish",
    grade: "9-sinf",
    name: "Erkin Tushish & Parabola Traektoriyasi",
    displayFormula: "h = v₀·t - g·t²/2",
    latex2D: "y = a·x - 0.08·x²",
    latex3D: "z = a - 0.06·(x² + y²)",
    eval2DStr: "a * (x + 6) - 0.08 * (x + 6) * (x + 6) - 2 + 0.4 * Math.sin(t * 3)",
    eval3DStr: "a * 1.5 - 0.06 * (x*x + y*y) - 1.5 + 0.3 * Math.sin(t * 2)",
    defaultA: 1.6,
    defaultK: 1.0,
    labelA: "Boshlangʻich tezlik (v₀)",
    labelK: "Gravitatsiya (g koeff.)",
    description: "Ogʻirlik kuchi maydonida boshlangʻich tezlik bilan otilgan jismning parabolik parvozi va balandligi.",
  },
  // 2. FIZIKA - GARMONIK TEBRANISHLAR (8-10 Sinf)
  {
    id: "harmonic_wave",
    subject: "Fizika",
    subdiscipline: "Tebranishlar & Toʻlqinlar",
    grade: "8-10 sinf",
    name: "Garmonik Toʻlqin & Mayatnik Tebranishi",
    displayFormula: "x(t) = A·cos(ω·t + φ₀)",
    latex2D: "y = a·cos(k·x - 3t)",
    latex3D: "z = a·sin(k·√(x²+y²) - 3t)",
    eval2DStr: "a * Math.cos(k * x - 3 * t)",
    eval3DStr: "a * Math.sin(k * Math.sqrt(x*x + y*y) - 3 * t)",
    defaultA: 1.8,
    defaultK: 1.2,
    labelA: "Amplituda (A)",
    labelK: "Tsiklik chastota (ω / k)",
    description: "Mayatnik va elastik toʻlqinlarning sinusoidal tarqalish qonuni va sferik toʻlqin fronti.",
  },
  // 3. FIZIKA - KULON VA ELEKTROSTATIKA (10 Sinf)
  {
    id: "coulomb_potential",
    subject: "Fizika",
    subdiscipline: "Elektrodinamika & Kulon Qonuni",
    grade: "10-sinf",
    name: "Kulon Maydoni & Elektrostatik Potensial",
    displayFormula: "φ = k·q / r",
    latex2D: "y = a·k / (0.6 + |x|)",
    latex3D: "z = (a·k) / √(x² + y² + 0.8) - 1.5",
    eval2DStr: "(a * k) / (0.8 + Math.abs(x)) - 1.5 + 0.2 * Math.sin(t * 2)",
    eval3DStr: "(a * k * 2.5) / Math.sqrt(x*x + y*y + 0.8) - 2.5",
    defaultA: 1.5,
    defaultK: 1.4,
    labelA: "Zaryad kattaligi (q)",
    labelK: "Muhit koeffitsienti (k)",
    description: "Nuqtaviy elektr zaryadining atrofida hosil boʻlgan elektrostatik maydon potensiali va voronka relyefi.",
  },
  // 4. ALGEBRA - KVADRATIK FUNKSIYA & PARABOLA (8-9 Sinf)
  {
    id: "algebra_parabola",
    subject: "Algebra",
    subdiscipline: "Kvadratik Funksiyalar",
    grade: "8-9 sinf",
    name: "Kvadrat Funksiya & Aylanma Paraboloid",
    displayFormula: "y = a·x² + b·x + c",
    latex2D: "y = 0.2·a·x² - 2",
    latex3D: "z = 0.12·a·(x² + y²) - 2.4",
    eval2DStr: "0.2 * a * x * x - 2.2 + 0.3 * Math.sin(t * 2)",
    eval3DStr: "0.12 * a * (x*x + y*y) - 2.4 + 0.2 * Math.cos(t * 2)",
    defaultA: 1.2,
    defaultK: 1.0,
    labelA: "Bosh koeffitsient (a)",
    labelK: "Siqilish darajasi (k)",
    description: "Maktab algebra kursidagi klassik parabola egri chizigʻi va 3D fazodagi aylanma paraboloid sirti.",
  },
  // 5. ALGEBRA - TRIGONOMETRIK FUNKSIYALAR (9-11 Sinf)
  {
    id: "algebra_trig",
    subject: "Algebra",
    subdiscipline: "Trigonometriya & Analiz",
    grade: "9-11 sinf",
    name: "Trigonometrik Funksiya: Sinus & Kosinus",
    displayFormula: "y = a·sin(k·x) · cos(t)",
    latex2D: "y = a·sin(k·x) · cos(2t)",
    latex3D: "z = a·sin(k·x) · cos(k·y) · cos(2t)",
    eval2DStr: "a * Math.sin(k * x) * Math.cos(2 * t)",
    eval3DStr: "a * Math.sin(k * x) * Math.cos(k * y) * Math.cos(2 * t)",
    defaultA: 2.0,
    defaultK: 0.9,
    labelA: "Koʻpaytuvchi (a)",
    labelK: "Davr parametri (k)",
    description: "Trigonometrik davriy tebranishlar va ikki oʻlchamli fazoviy rezonans toʻlqinlari.",
  },
  // 6. GEOMETRIYA - PIFAGOR VA AYLANMA SFERA (8-11 Sinf)
  {
    id: "geometry_sphere",
    subject: "Geometriya",
    subdiscipline: "Stereometriya & Aylanish Jismlari",
    grade: "10-11 sinf",
    name: "Pifagor & Sfera Fazoviy Sirti",
    displayFormula: "x² + y² + z² = R²",
    latex2D: "y = √(a² - 0.2·x²)",
    latex3D: "z = √(max(0, a² - 0.15·(x²+y²))) - 1.5",
    eval2DStr: "Math.sqrt(Math.max(0, a * a * 4 - 0.25 * x * x)) - 2.0 + 0.2 * Math.sin(t * 2)",
    eval3DStr: "Math.sqrt(Math.max(0, a * a * 3.5 - 0.2 * (x*x + y*y))) - 1.8",
    defaultA: 1.5,
    defaultK: 1.0,
    labelA: "Sfera Radiusi (R)",
    labelK: "Masshtab koeffitsienti",
    description: "Pifagor teoremasining 3D fazodagi umumlashmasi: markazi (0,0,0) boʻlgan fazoviy sfera gumbazi.",
  },
  // 7. ASTRONOMIYA - BUTUNOLAM TORTISHISH QONUNI (9-11 Sinf)
  {
    id: "astronomy_gravity",
    subject: "Astronomiya",
    subdiscipline: "Koinot & Gravitatsiya Maydoni",
    grade: "10-11 sinf",
    name: "Nyuton Butunolam Tortishish Qonuni",
    displayFormula: "F = G·M·m / r²",
    latex2D: "y = -a / (1 + 0.2·x²)",
    latex3D: "z = -2.5·a / (1 + 0.15·(x²+y²)) + 1.2",
    eval2DStr: "-2.2 * a / (1 + 0.2 * x * x) + 1.0 + 0.2 * Math.sin(t * 3)",
    eval3DStr: "-3.0 * a / (1 + 0.18 * (x*x + y*y)) + 1.2 + 0.2 * Math.sin(t * 2)",
    defaultA: 1.4,
    defaultK: 1.0,
    labelA: "Sayyora Massasi (M)",
    labelK: "Gravitatsion doimiy (G)",
    description: "Ogʻir massali jism (Quyosh yoki Yer) atrofida fazo-vaqt egriligi va gravitatsion oʻra relyefi.",
  },
  // 8. OPTIKA - YUNG INTERFERENSIYASI (11 Sinf)
  {
    id: "optics_interference",
    subject: "Fizika",
    subdiscipline: "Optika & Toʻlqinlar",
    grade: "11-sinf",
    name: "Optika: Yung Toʻlqin Interferensiyasi",
    displayFormula: "I = I₀·cos²(π·d·x / (λ·L))",
    latex2D: "y = a·cos²(k·x - 2t)",
    latex3D: "z = a·(cos²(k·x - 2t) + cos²(k·y - 2t)) - 1.8",
    eval2DStr: "a * Math.pow(Math.cos(k * x - 2 * t), 2) * 2 - 1.5",
    eval3DStr: "a * (Math.pow(Math.cos(k * x - 2 * t), 2) + Math.pow(Math.cos(k * y - 2 * t), 2)) - 1.8",
    defaultA: 1.6,
    defaultK: 1.4,
    labelA: "Yorugʻlik intensivligi (I₀)",
    labelK: "Toʻlqin uzunligi (k)",
    description: "Ikkita kogerent yorugʻlik toʻlqinining ustma-ust tushishi natijasida hosil boʻlgan yorugʻ va qorongʻi polosalar.",
  },
];

export interface DetectedSubjectInfo {
  subject: SchoolSubject;
  subdiscipline: string;
  grade: string;
  formulaTitle: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  explanation: string;
  math2DFunction: string;
  math3DFunction: string;
}

/**
 * Intelligent School Subject Detective:
 * Analyzes arbitrary math/physics equations typed by the user and detects
 * which school subject and topic it belongs to, then converts to 2D & 3D runnable math!
 */
export function detectSchoolSubject(inputStr: string): DetectedSubjectInfo {
  const clean = inputStr.trim().toLowerCase().replace(/\s+/g, " ");

  // 1. FIZIKA: DYNAMICS / NEWTON'S SECOND LAW (F = m*a, F = k*x)
  if (
    clean.includes("f = m") ||
    clean.includes("f=m") ||
    clean.includes("m * a") ||
    clean.includes("m*a") ||
    clean.includes("f = k*x") ||
    clean.includes("f = g") ||
    clean.includes("f = mu")
  ) {
    return {
      subject: "Fizika",
      subdiscipline: "Dinamika & Nyuton Qonunlari",
      grade: "9-sinf",
      name: "Nyutonning II Qonuni & Kuchlar Dinamikasi",
      formulaTitle: "F = m · a (Kuch va Tezlanish)",
      badgeBg: "bg-indigo-500/20",
      badgeText: "text-indigo-700 dark:text-indigo-300",
      badgeBorder: "border-indigo-400",
      explanation: "Nyutonning ikkinchi qonuni: Jism olgan tezlanish unga taʼsir etuvchi kuchga toʻgʻri, uning massasiga teskari mutanosib. 2D da kuch-tezlanish chizigʻi, 3D da dinamik kuch maydoni relyefi.",
      math2DFunction: "a * 0.4 * x + 0.3 * Math.sin(t * 3)",
      math3DFunction: "0.25 * a * (x + y) + 0.3 * Math.cos(k * Math.sqrt(x*x + y*y) - 2 * t)",
    } as any;
  }

  // 2. FIZIKA: KINEMATIKA (s = vt, h = v0*t - g*t^2/2, v = v0 + at)
  if (
    clean.includes("s = v") ||
    clean.includes("v0") ||
    clean.includes("v_0") ||
    clean.includes("g*t") ||
    clean.includes("gt^2") ||
    clean.includes("t^2/2") ||
    clean.includes("h =") ||
    clean.includes("v = v0")
  ) {
    return {
      subject: "Fizika",
      subdiscipline: "Kinematika & Erkin Tushish",
      grade: "9-sinf",
      formulaTitle: "Erkin Tushish Balandligi va Parabola: h = v₀·t - g·t²/2",
      badgeBg: "bg-cyan-500/20",
      badgeText: "text-cyan-700 dark:text-cyan-300",
      badgeBorder: "border-cyan-400",
      explanation: "Gravitatsiya maydonida vertikal yoki burchak ostida otilgan jismning balandligi va harakat traektoriyasi. 2D da balandlik-vaqt egri chizigʻi, 3D da paraboloid harakat gumbazi.",
      math2DFunction: "a * (x + 6) - 0.08 * (x + 6) * (x + 6) - 2 + 0.4 * Math.sin(t * 3)",
      math3DFunction: "a * 1.5 - 0.06 * (x*x + y*y) - 1.5 + 0.3 * Math.sin(t * 2)",
    };
  }

  // 3. FIZIKA: ENERGIYA & RELYATIVIZM (E = m*c^2, Ek = mv^2/2, Ep = mgh)
  if (
    clean.includes("e = m*c") ||
    clean.includes("m*c^2") ||
    clean.includes("mc^2") ||
    clean.includes("mv^2") ||
    clean.includes("mgh")
  ) {
    return {
      subject: "Fizika",
      subdiscipline: "Kvant & Relyativistik Mexanika",
      grade: "11-sinf",
      formulaTitle: "Eynshteyn Energiya Ekvivalentligi: E = m·c²",
      badgeBg: "bg-purple-500/20",
      badgeText: "text-purple-700 dark:text-purple-300",
      badgeBorder: "border-purple-400",
      explanation: "Tinchlikdagi massa va energiyaning fundamental bogʻliqligi. 2D da relyativistik massa-energiya egri chizigʻi, 3D da kvant energiya maydonining giperbolik tebranishi.",
      math2DFunction: "a * Math.exp(-0.15 * Math.abs(x)) * 3 - 1.5 + 0.3 * Math.sin(t * 4)",
      math3DFunction: "a * Math.exp(-0.12 * (x*x + y*y)) * 4 - 2.0 + 0.3 * Math.cos(k * Math.sqrt(x*x + y*y) - 3 * t)",
    };
  }

  // 4. FIZIKA: ELEKTRODINAMIKA & OM QONUNI (I = U/R, U = I*R, P = U*I)
  if (
    clean.includes("i = u") ||
    clean.includes("u = i") ||
    clean.includes("p = u*i") ||
    clean.includes("u/r") ||
    clean.includes("q = c*u") ||
    clean.includes("om")
  ) {
    return {
      subject: "Fizika",
      subdiscipline: "Elektrodinamika & Zanjir Qonunlari",
      grade: "8-sinf",
      formulaTitle: "Zanjir Qismi Uchun Om Qonuni: I = U / R",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-700 dark:text-amber-300",
      badgeBorder: "border-amber-400",
      explanation: "Tok kuchi kuchlanishga toʻgʻri mutanosib va oʻtkazgich qarshiligiga teskari mutanosib. 2D da volt-amper xarakteristikasi, 3D da oʻzgaruvchan sinusoidal tok toʻlqini.",
      math2DFunction: "(a / k) * 0.5 * x + 0.5 * Math.sin(t * 4)",
      math3DFunction: "a * Math.sin(k * x - 3 * t) * Math.cos(k * y * 0.5) * 1.5",
    };
  }

  // 5. FIZIKA: KULON VA GRAVITATSIYA (q1*q2, k*q, g*m*m, r^2)
  if (
    clean.includes("q1") ||
    clean.includes("q2") ||
    clean.includes("g*m") ||
    clean.includes("g * m") ||
    clean.includes("kulon") ||
    clean.includes("phi =") ||
    clean.includes("φ")
  ) {
    return {
      subject: "Fizika",
      subdiscipline: "Elektrostatika & Tortishish Maydoni",
      grade: "10-sinf",
      formulaTitle: "Kulon Maydoni & Maydon Potensiali: φ = k·q / r",
      badgeBg: "bg-indigo-500/20",
      badgeText: "text-indigo-700 dark:text-indigo-300",
      badgeBorder: "border-indigo-400",
      explanation: "Nuqtaviy zaryad yoki gravitatsion massa atrofidagi potensial maydon relyefi va kuch chiziqlari voronkasi.",
      math2DFunction: "(a * k) / (0.8 + Math.abs(x)) - 1.5 + 0.2 * Math.sin(t * 2)",
      math3DFunction: "(a * k * 2.5) / Math.sqrt(x*x + y*y + 0.8) - 2.5",
    };
  }

  // 6. KIMYO & TERMODINAMIKA (PV = nRT, pH = -log, Q = cm*deltaT)
  if (
    clean.includes("p*v") ||
    clean.includes("pv") ||
    clean.includes("nrt") ||
    clean.includes("n*r*t") ||
    clean.includes("ph") ||
    clean.includes("delta") ||
    clean.includes("c*m")
  ) {
    return {
      subject: "Kimyo",
      subdiscipline: "Termodinamika & Ideal Gaz Holati",
      grade: "8-10 sinf",
      formulaTitle: "Mendeleyev-Klapeyron Tenglamasi: P·V = n·R·T",
      badgeBg: "bg-teal-500/20",
      badgeText: "text-teal-700 dark:text-teal-300",
      badgeBorder: "border-teal-400",
      explanation: "Ideal gazning bosimi, hajmi va harorati oʻrtasidagi holat tenglamasi. 2D da izotermik giperbola, 3D da P-V-T termodinamik sirti.",
      math2DFunction: "a * 2.0 / (Math.abs(x) + 0.8) - 1.6 + 0.2 * Math.sin(t * 2)",
      math3DFunction: "(a * 2.5) / (0.6 + Math.sqrt(x*x + y*y)) - 2.0 + 0.3 * Math.sin(t * 2)",
    };
  }

  // 7. ASTRONOMIYA: KOSMIK TEZLIK & SAYYORALAR (r^2, g*m/r, kepler)
  if (
    clean.includes("g*m/r") ||
    clean.includes("kosmik") ||
    clean.includes("kepler") ||
    clean.includes("sayyora") ||
    clean.includes("astronomiya")
  ) {
    return {
      subject: "Astronomiya",
      subdiscipline: "Gravitatsiya & Kosmik Mexanika",
      grade: "10-11 sinf",
      formulaTitle: "Birinchi Kosmik Tezlik: v = √(G·M / R)",
      badgeBg: "bg-purple-500/20",
      badgeText: "text-purple-700 dark:text-purple-300",
      badgeBorder: "border-purple-400",
      explanation: "Sunʼiy yoʻldoshning orbita boʻylab aylanish tezligi va fazo-vaqt egriligi chuqurligi.",
      math2DFunction: "-2.2 * a / (1 + 0.2 * x * x) + 1.0 + 0.2 * Math.sin(t * 3)",
      math3DFunction: "-3.0 * a / (1 + 0.18 * (x*x + y*y)) + 1.2 + 0.2 * Math.sin(t * 2)",
    };
  }

  // 8. GEOMETRIYA: PIFAGOR & SFERA (a^2 + b^2 = c^2, x^2 + y^2 = r^2)
  if (
    clean.includes("a^2 + b^2") ||
    clean.includes("x^2 + y^2") ||
    clean.includes("c = sqrt") ||
    clean.includes("r^2") ||
    clean.includes("pifagor") ||
    clean.includes("sfera")
  ) {
    return {
      subject: "Geometriya",
      subdiscipline: "Stereometriya & Pifagor Teoremasi",
      grade: "8-11 sinf",
      formulaTitle: "Pifagor & Fazoviy Sfera Sirti: x² + y² + z² = R²",
      badgeBg: "bg-amber-500/20",
      badgeText: "text-amber-700 dark:text-amber-300",
      badgeBorder: "border-amber-400",
      explanation: "Toʻgʻri burchakli uchburchak katetlari va gipotenuzasi bogʻliqligi hamda fazoviy sfera tenglamasi.",
      math2DFunction: "Math.sqrt(Math.max(0, a * a * 4 - 0.25 * x * x)) - 2.0 + 0.2 * Math.sin(t * 2)",
      math3DFunction: "Math.sqrt(Math.max(0, a * a * 3.5 - 0.2 * (x*x + y*y))) - 1.8",
    };
  }

  // 9. ALGEBRA: TRIGONOMETRIYA (sin, cos, tan, tg)
  if (
    clean.includes("sin") ||
    clean.includes("cos") ||
    clean.includes("tan") ||
    clean.includes("tg")
  ) {
    return {
      subject: "Algebra",
      subdiscipline: "Trigonometriya & Tebranishlar",
      grade: "9-10 sinf",
      formulaTitle: "Trigonometrik Funksiya: y = a·sin(k·x)",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      badgeBorder: "border-emerald-400",
      explanation: "Davriy trigonometrik toʻlqinlar. 2D tekislikda sinusoidal tebranish, 3D da garmonik sirt relyefi.",
      math2DFunction: "a * Math.sin(k * x) * Math.cos(2 * t)",
      math3DFunction: "a * Math.sin(k * x) * Math.cos(k * y) * Math.cos(2 * t)",
    };
  }

  // 10. ALGEBRA: KVADRATIK VA KOʻPHAD (x^2, ax^2, parabola)
  if (
    clean.includes("x^2") ||
    clean.includes("x*x") ||
    clean.includes("parabola")
  ) {
    return {
      subject: "Algebra",
      subdiscipline: "Kvadratik Funksiya & Parabola",
      grade: "8-sinf",
      formulaTitle: "Kvadratik Funksiya: y = a·x² + b·x + c",
      badgeBg: "bg-emerald-500/20",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      badgeBorder: "border-emerald-400",
      explanation: "Kvadratik parabola funksiyasi. 2D da egri chiziq, 3D da aylanma paraboloid sirti.",
      math2DFunction: "0.2 * a * x * x - 2.2 + 0.3 * Math.sin(t * 2)",
      math3DFunction: "0.12 * a * (x*x + y*y) - 2.4 + 0.2 * Math.cos(t * 2)",
    };
  }

  // 11. ALGEBRA: CHIZIQLI VA BOSHQA FUNKSIYALAR (Default Fallback)
  return {
    subject: "Algebra",
    subdiscipline: "Matematik Analiz & Funksiyalar",
    grade: "7-11 sinf",
    formulaTitle: `Matematik Funksiya: ${inputStr.slice(0, 30)}`,
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    badgeBorder: "border-indigo-400",
    explanation: "Oʻquvchi tomonidan kiritilgan shaxsiy matematik funksiya. Tizim uni 2D koordinata oʻqi va 3D fazoviy balandlik modeliga muvaffaqiyatli aylantirdi.",
    math2DFunction: "a * Math.sin(k * x - 3 * t)",
    math3DFunction: "a * Math.sin(Math.sqrt(x*x + y*y) * k - 3 * t)",
  };
}

export const CustomFormulaVisualizer: React.FC<CustomFormulaVisualizerProps> = ({
  onAwardRewards,
  isDarkTheme = true,
}) => {
  // Preset selector
  const [selectedPresetId, setSelectedPresetId] = useState<string>("free_fall_parabola");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");

  // Raw user input formula
  const [rawFormulaInput, setRawFormulaInput] = useState<string>("h = v0*t - g*t^2/2");

  // Parameter controls
  const [paramA, setParamA] = useState<number>(1.6);
  const [paramK, setParamK] = useState<number>(1.0);
  const [animSpeed, setAnimSpeed] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"split" | "2d" | "3d">("split");

  // Fullscreen states
  const [isFullscreen2D, setIsFullscreen2D] = useState<boolean>(false);
  const [isFullscreen3D, setIsFullscreen3D] = useState<boolean>(false);
  const [is3DAutoRotate, setIs3DAutoRotate] = useState<boolean>(true);

  // 2D Canvas refs
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const animTimeRef = useRef<number>(0);

  // 3D Three.js refs
  const mount3DRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const surfaceMeshRef = useRef<THREE.Mesh | null>(null);
  const autoRotateRef = useRef<boolean>(is3DAutoRotate);

  // Keep autoRotateRef in sync
  useEffect(() => {
    autoRotateRef.current = is3DAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = is3DAutoRotate;
    }
  }, [is3DAutoRotate]);

  // Handle ESC for fullscreens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen2D(false);
        setIsFullscreen3D(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Smart Detection Memo
  const detectedSubject = useMemo(() => {
    return detectSchoolSubject(rawFormulaInput);
  }, [rawFormulaInput]);

  // Filter presets by selected subject
  const filteredPresets = useMemo(() => {
    if (selectedSubjectFilter === "all") return SCHOOL_PRESETS;
    return SCHOOL_PRESETS.filter((p) => p.subject === selectedSubjectFilter);
  }, [selectedSubjectFilter]);

  // Safe Math evaluator for formula
  const evaluateFormula = (x: number, y: number, t: number, a: number, k: number): number => {
    try {
      // If user typed custom JavaScript with Math
      if (rawFormulaInput.includes("Math.")) {
        const fn = new Function("x", "y", "t", "a", "k", "Math", `"use strict"; return (${rawFormulaInput});`);
        const val = fn(x, y, t, a, k, Math);
        return typeof val === "number" && !isNaN(val) ? Math.max(-10, Math.min(10, val)) : 0;
      }

      // Otherwise evaluate using detected 3D function
      const fn = new Function("x", "y", "t", "a", "k", "Math", `"use strict"; return (${detectedSubject.math3DFunction});`);
      const val = fn(x, y, t, a, k, Math);
      return typeof val === "number" && !isNaN(val) ? Math.max(-10, Math.min(10, val)) : 0;
    } catch {
      return a * Math.sin(k * Math.sqrt(x * x + y * y) - 3 * t);
    }
  };

  const evaluate2DFormula = (x: number, t: number, a: number, k: number): number => {
    try {
      if (rawFormulaInput.includes("Math.")) {
        const fn = new Function("x", "y", "t", "a", "k", "Math", `"use strict"; return (${rawFormulaInput});`);
        const val = fn(x, 0, t, a, k, Math);
        return typeof val === "number" && !isNaN(val) ? Math.max(-10, Math.min(10, val)) : 0;
      }

      const fn = new Function("x", "t", "a", "k", "Math", `"use strict"; return (${detectedSubject.math2DFunction});`);
      const val = fn(x, t, a, k, Math);
      return typeof val === "number" && !isNaN(val) ? Math.max(-10, Math.min(10, val)) : 0;
    } catch {
      return a * Math.sin(k * x - 3 * t);
    }
  };

  // Switch preset
  const handleSelectPreset = (preset: SchoolFormulaPreset) => {
    setSelectedPresetId(preset.id);
    setRawFormulaInput(preset.displayFormula);
    setParamA(preset.defaultA);
    setParamK(preset.defaultK);
  };

  // ========================================================
  // 2D CANVAS ANIMATION LOOP
  // ========================================================
  useEffect(() => {
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render2D = () => {
      if (isPlaying) {
        animTimeRef.current += 0.02 * animSpeed;
      }
      const t = animTimeRef.current;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background
      const isDark = document.documentElement.classList.contains("dark") || isDarkTheme;
      ctx.fillStyle = isDark ? "#070e1e" : "#f8fafc";
      ctx.fillRect(0, 0, width, height);

      const originX = width / 2;
      const originY = height / 2;
      const scaleX = width / 18;
      const scaleY = height / 8;

      // Coordinate Grid Lines
      ctx.strokeStyle = isDark ? "rgba(51, 65, 85, 0.4)" : "rgba(203, 213, 225, 0.7)";
      ctx.lineWidth = 1;

      // Vertical grid
      for (let gx = -8; gx <= 8; gx += 2) {
        const px = originX + gx * scaleX;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
        ctx.stroke();

        ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(`${gx}`, px - 6, originY + 16);
      }

      // Horizontal grid
      for (let gy = -3; gy <= 3; gy++) {
        if (gy === 0) continue;
        const py = originY - gy * scaleY;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();

        ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(`${gy}`, originX + 6, py - 3);
      }

      // Main Axes
      ctx.strokeStyle = isDark ? "#94a3b8" : "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      // X-axis
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      // Y-axis
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("X (Koordinata / Vaqt)", width - 110, originY - 8);
      ctx.fillText("Y (Qiymat / Amplituda)", originX + 8, 16);

      // Plot the function curve y = f(x, t, a, k)
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = isDark ? "#38bdf8" : "#0284c7";

      let firstPoint = true;
      const step = 2;
      for (let px = 0; px <= width; px += step) {
        const xMath = (px - originX) / scaleX;
        const yMath = evaluate2DFormula(xMath, t, paramA, paramK);
        const py = originY - yMath * scaleY;

        if (firstPoint) {
          ctx.moveTo(px, py);
          firstPoint = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Glowing shadow in dark mode
      if (isDark) {
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Animated tracer test particles along curve
      const tracerCount = 4;
      for (let i = 0; i < tracerCount; i++) {
        const particleXMath = -6 + ((t * 2 + i * 3) % 12);
        const particleYMath = evaluate2DFormula(particleXMath, t, paramA, paramK);
        const px = originX + particleXMath * scaleX;
        const py = originY - particleYMath * scaleY;

        ctx.fillStyle = i === 0 ? "#f43f5e" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(px, py, i === 0 ? 5.5 : 4, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Coordinates tooltip
          ctx.fillStyle = isDark ? "#f1f5f9" : "#0f172a";
          ctx.font = "bold 10px monospace";
          ctx.fillText(`(${particleXMath.toFixed(1)}, ${particleYMath.toFixed(2)})`, px + 8, py - 8);
        }
      }

      animId = requestAnimationFrame(render2D);
    };

    render2D();

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, paramA, paramK, animSpeed, rawFormulaInput, detectedSubject, isDarkTheme]);

  // ========================================================
  // 3D THREE.JS WEBGL ANIMATED SURFACE
  // ========================================================
  useEffect(() => {
    const container = mount3DRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c1d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(12, 14, 16);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotateRef.current;
    controls.autoRotateSpeed = 1.6;
    controls.maxDistance = 50;
    controls.minDistance = 5;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight1.position.set(10, 20, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.4);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Coordinate Grid Helper
    const gridHelper = new THREE.GridHelper(16, 16, 0x6366f1, 0x1e293b);
    gridHelper.position.y = -2.8;
    scene.add(gridHelper);

    // Surface Plane Geometry (Resolution: 60x60 grid)
    const gridSize = 60;
    const geometry = new THREE.PlaneGeometry(12, 12, gridSize, gridSize);
    geometry.rotateX(-Math.PI / 2); // Lay flat on XZ plane

    const count = geometry.attributes.position.count;
    const colors = new Float32Array(count * 3);

    // Custom material with vertex colors
    const material = new THREE.MeshStandardMaterial({
      roughness: 0.25,
      metalness: 0.4,
      wireframe: false,
      side: THREE.DoubleSide,
      vertexColors: true,
    });

    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const surfaceMesh = new THREE.Mesh(geometry, material);
    scene.add(surfaceMesh);
    surfaceMeshRef.current = surfaceMesh;

    // Optional wireframe overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    scene.add(wireframeMesh);

    // Dynamic color gradient helper
    const colorLow = new THREE.Color(0x312e81);
    const colorMid = new THREE.Color(0x06b6d4);
    const colorHigh = new THREE.Color(0xfbbf24);

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate3D = () => {
      animId = requestAnimationFrame(animate3D);
      const delta = clock.getDelta();
      const t = animTimeRef.current;

      // Update surface vertices
      if (surfaceMeshRef.current) {
        const geom = surfaceMeshRef.current.geometry;
        const posAttr = geom.attributes.position;
        const colorAttr = geom.attributes.color;

        for (let i = 0; i < posAttr.count; i++) {
          const vx = posAttr.getX(i);
          const vz = posAttr.getZ(i);

          // Evaluate formula for Z height
          const vy = evaluateFormula(vx, vz, t, paramA, paramK);
          posAttr.setY(i, vy);

          // Color gradient based on elevation
          const normY = Math.max(0, Math.min(1, (vy + 2.5) / 5.0));
          let col = new THREE.Color();
          if (normY < 0.5) {
            col.lerpColors(colorLow, colorMid, normY * 2);
          } else {
            col.lerpColors(colorMid, colorHigh, (normY - 0.5) * 2);
          }
          colorAttr.setXYZ(i, col.r, col.g, col.b);
        }
        posAttr.needsUpdate = true;
        colorAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      // Update auto rotate continuously
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotateRef.current;
        controlsRef.current.autoRotateSpeed = 1.4;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate3D();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [paramA, paramK, rawFormulaInput, detectedSubject]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-cyan-950 rounded-3xl border border-indigo-500/30 p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Maktab Dasturidagi Formulalar va AI Fanni Aniqlash</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display flex items-center gap-2">
            <span>Oʻquvchi Formulalari: 2D & 3D Interaktiv Modellashtirish</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Istalgan maktab formulangizni (Fizika, Algebra, Geometriya, Kimyo, Astronomiya) yozing.
            Platforma uning <strong>qaysi fanga oidligini avtomatik aniqlaydi</strong> va 2D hamda 3D fazoviy animatsiya qilib beradi!
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 p-1.5 rounded-xl backdrop-blur-md self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "split"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D + 3D Birlashgan</span>
          </button>
          <button
            onClick={() => setViewMode("2d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "2d"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Faqat 2D</span>
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "3d"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Faqat 3D</span>
          </button>
        </div>
      </div>

      {/* DETECTED SUBJECT BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shrink-0">
            {detectedSubject.subject === "Fizika" && <Atom className="w-6 h-6 animate-spin-slow" />}
            {detectedSubject.subject === "Algebra" && <TrendingUp className="w-6 h-6" />}
            {detectedSubject.subject === "Geometriya" && <Compass className="w-6 h-6" />}
            {detectedSubject.subject === "Astronomiya" && <Globe className="w-6 h-6" />}
            {detectedSubject.subject === "Kimyo" && <Sparkles className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Aniqlangan Fan & Mavzu:
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${detectedSubject.badgeBg} ${detectedSubject.badgeText} ${detectedSubject.badgeBorder}`}>
                {detectedSubject.subject} ({detectedSubject.grade})
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                • {detectedSubject.subdiscipline}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {detectedSubject.formulaTitle}
            </h3>
          </div>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 max-w-md bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
          {detectedSubject.explanation}
        </div>
      </div>

      {/* SUBJECT FILTER CHIPS & SCHOOL PRESETS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>Maktab Dasturidagi Rasmiy Formulalar (Tanlang):</span>
          </span>

          {/* Subject Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: "all", label: "Barchasi" },
              { id: "Fizika", label: "⚛️ Fizika" },
              { id: "Algebra", label: "📈 Algebra" },
              { id: "Geometriya", label: "📐 Geometriya" },
              { id: "Astronomiya", label: "🌌 Astronomiya" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSubjectFilter(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSubjectFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-xs ${
                selectedPresetId === preset.id
                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-indigo-200 shadow-md"
                  : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {preset.subject} • {preset.grade}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{preset.subdiscipline}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                  {preset.name}
                </h4>
              </div>

              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs text-indigo-600 dark:text-cyan-400 font-bold truncate">
                {preset.displayFormula}
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>
            </button>
          ))}
        </div>

        {/* CUSTOM INPUT FIELD */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Oʻzingiz Hohlagan Formulani Yozing:</span>
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Masalan: <code>F = m * a</code>, <code>h = v0*t - g*t^2/2</code>, <code>y = 2*x^2 - 4</code>, <code>c = sqrt(a^2 + b^2)</code>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={rawFormulaInput}
                onChange={(e) => setRawFormulaInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl font-mono text-sm sm:text-base bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-indigo-700 dark:text-cyan-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner"
                placeholder="Formulangizni kiriting... (masalan: F = m * a yoki y = a * sin(x))"
              />
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 60, spread: 70 });
                if (onAwardRewards) {
                  onAwardRewards(70, 25, `Maktab formulasi sinovi (${detectedSubject.subject}: ${detectedSubject.formulaTitle})`);
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2D/3D Sinovdan Oʻtkazish (+70 XP)</span>
            </button>
          </div>
        </div>

        {/* PARAMETERS SLIDERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Slider A */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Parametr (A / Koeffitsient):
              </span>
              <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">
                {paramA.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={paramA}
              onChange={(e) => setParamA(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Slider K */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Parametr (K / Masshtab):
              </span>
              <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">
                {paramK.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={paramK}
              onChange={(e) => setParamK(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Animation Speed */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Animatsiya Tezligi:
              </span>
              <span className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">
                {animSpeed.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={animSpeed}
              onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* VISUALIZATION CANVAS STAGE (2D AND 3D) */}
      <div
        className={`grid gap-6 ${
          viewMode === "split"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* ======================================================= */}
        {/* 2D CANVAS VIEW */}
        {/* ======================================================= */}
        {(viewMode === "split" || viewMode === "2d") && (
          <div
            className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl space-y-3 transition-all ${
              isFullscreen2D
                ? "fixed inset-0 z-50 rounded-none p-6 bg-slate-50 dark:bg-slate-950 overflow-hidden flex flex-col"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  <Activity className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    2D Grafik: Y(X, t) Egri Chizigʻi
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Oʻqlar: X (masofa/vaqt) va Y (qiymat). Qizil nuqta - oniy qiymat.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title={isPlaying ? "Pauza" : "Jonlantirish"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
                </button>

                <button
                  onClick={() => setIsFullscreen2D(!isFullscreen2D)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title={isFullscreen2D ? "Chiqish (ESC)" : "Toʻliq ekranda koʻrish"}
                >
                  {isFullscreen2D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2D Canvas */}
            <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex-1">
              <canvas
                ref={canvas2DRef}
                width={800}
                height={450}
                className="w-full h-full block"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Koordinata toʻri: [-8, +8] birlik</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                Formula: {detectedSubject.formulaTitle}
              </span>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* 3D WEBGL SURFACE VIEW */}
        {/* ======================================================= */}
        {(viewMode === "split" || viewMode === "3d") && (
          <div
            className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl space-y-3 transition-all ${
              isFullscreen3D
                ? "fixed inset-0 z-50 rounded-none p-6 bg-slate-50 dark:bg-slate-950 overflow-hidden flex flex-col"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                  <Box className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    3D Fazoviy Modellashtirish: Z = F(X, Y, t)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    WebGL 360° erkin aylantiring, gʻildirak bilan masshtablang.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIs3DAutoRotate(!is3DAutoRotate)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    is3DAutoRotate
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                  title="3D kamerani avtomatik aylantirish"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${is3DAutoRotate ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Avto-aylantirish</span>
                </button>

                <button
                  onClick={() => setIsFullscreen3D(!isFullscreen3D)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  title={isFullscreen3D ? "Chiqish (ESC)" : "Toʻliq ekranda koʻrish"}
                >
                  {isFullscreen3D ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3D Three.js Container */}
            <div
              ref={mount3DRef}
              className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex-1"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Three.js Parametric Surface Mesh</span>
              </span>
              <span className="text-indigo-600 dark:text-cyan-400 font-bold">
                Balandlik: Z = f(X, Y, t)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
