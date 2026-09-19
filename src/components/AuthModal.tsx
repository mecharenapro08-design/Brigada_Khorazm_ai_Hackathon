import React, { useState } from "react";
import {
  User,
  X,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  School,
  Compass,
  Calendar,
  Flame,
  Award,
  Maximize2,
  Check,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string, role?: UserRole) => { success: boolean; message?: string };
  onRegister: (newProfile: UserProfile) => void;
  allAccounts: UserProfile[];
  initialMode?: "login" | "register";
  initialRole?: UserRole;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  allAccounts,
  initialMode = "login",
  initialRole = "student",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [loginRole, setLoginRole] = useState<UserRole>(initialRole);

  // Login form state
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState<string>("");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);
  const [regRole, setRegRole] = useState<UserRole>(initialRole);
  const [regGrade, setRegGrade] = useState<string>("10-A sinf");
  const [regSchool, setRegSchool] = useState<string>("Prezident Maktabi (Toshkent)");
  const [regAvatar, setRegAvatar] = useState<string>(AVATAR_PRESETS[0]);
  const [regError, setRegError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      if (initialRole) {
        setLoginRole(initialRole);
        setRegRole(initialRole);
      }
      if (initialMode) {
        setMode(initialMode);
      }
      setLoginError(null);
      setRegError(null);
    }
  }, [isOpen, initialRole, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginUsername.trim()) {
      setLoginError("Iltimos, foydalanuvchi nomini (login) kiriting.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Iltimos, parolni kiriting.");
      return;
    }

    const res = onLogin(loginUsername.trim(), loginPassword, loginRole);
    if (!res.success) {
      setLoginError(res.message || "Login yoki parol notoʻgʻri.");
    } else {
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError("Iltimos, ism va familiyangizni kiriting.");
      return;
    }
    if (!regUsername.trim()) {
      setRegError("Iltimos, tizimga kirish uchun login (username) tanlang.");
      return;
    }
    if (regUsername.trim().length < 3) {
      setRegError("Login kamida 3 ta belgidan iborat boʻlishi kerak.");
      return;
    }
    if (regPassword.length < 4) {
      setRegError("Parol kamida 4 ta belgidan iborat boʻlishi kerak.");
      return;
    }

    // Check if username is already taken
    const exists = allAccounts.some(
      (acc) => acc.username?.toLowerCase() === regUsername.trim().toLowerCase()
    );
    if (exists) {
      setRegError("Bu login allaqachon band. Boshqa login tanlang.");
      return;
    }

    const newProfile: UserProfile = {
      id: `u-${Date.now()}`,
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword,
      role: regRole,
      grade: regRole === "student" ? regGrade : "Oʻqituvchi",
      school: regSchool.trim() || "AI Maktab",
      avatar: regAvatar,
      xp: 100,
      coins: 20,
      streak: 1,
      inventory: [],
      lastActiveDate: new Date().toISOString().split("T")[0],
      completedChapterIds: [],
      unlockedBadgeIds: [],
      dailyQuests: [
        {
          id: "q1",
          title: "Bugun 1 ta interaktiv darsni yakunlang",
          description: "Darslikdagi xohlagan mavzuni oʻqib, testini yeching.",
          progress: 0,
          target: 1,
          completed: false,
          rewardXP: 100,
          rewardCoins: 20,
        },
      ],
    };

    onRegister(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Dedicated Window Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative my-auto">
        
        {/* LEFT COLUMN: BRANDING & ROLE PRESENTATION (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-indigo-900/50">
          {/* Subtle glow background */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-bold tracking-wide text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AI MAKTAB • MILLIY TAʼLIM PORTALI</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                Raqamli Fanlar & 3D Virtual Laboratoriya
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-2 leading-relaxed">
                Yagona autentifikatsiya darchasi orqali shaxsiy dars jadvalingiz, 3D tajribalar va Katta Bilim Marafoniga kiring.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-indigo-300" />
                </div>
                <div>
                  <span className="font-bold block text-white">Shaxsiy Dars Jadvali</span>
                  <span className="text-[11px] text-indigo-200/70">Oʻquvchilar faqat oʻz sinfi darslarini xavfsiz koʻradi</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-rose-300" />
                </div>
                <div>
                  <span className="font-bold block text-white">WebGL 3D Simulyatsiyalar</span>
                  <span className="text-[11px] text-indigo-200/70">Pifagor kublari, prizma va toʻliq ekranli laboratoriya</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold block text-white">DTM & Katta Bilim Marafoni</span>
                  <span className="text-[11px] text-indigo-200/70">42 km ilmiy marafon va 100 ta DTM savollari</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Accounts Helper */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
              ⚡ Tezkor Kirish (Demo Akkauntlar):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLoginRole("student");
                  setLoginUsername("temur");
                  setLoginPassword("123456");
                  setLoginError(null);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="font-bold block text-white">🎓 Temur (Oʻquvchi)</span>
                <span className="text-[10px] text-indigo-300 font-mono">10-sinf • 123456</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLoginRole("teacher");
                  setLoginUsername("dilshod");
                  setLoginPassword("123456");
                  setLoginError(null);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-left transition-all cursor-pointer"
              >
                <span className="font-bold block text-white">👨‍🏫 Dilshod (Ustoz)</span>
                <span className="text-[10px] text-indigo-300 font-mono">Oʻqituvchi • 123456</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN & REGISTER FORMS (lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          {/* Top Bar with Mode Switcher & Close */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            {/* Tab switch */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLoginError(null);
                }}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Tizimga Kirish</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setRegError(null);
                }}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === "register"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Yangi Roʻyxatdan Oʻtish</span>
              </button>
            </div>

            {/* Close Window button */}
            <button
              id="close-auth-window-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Oynani Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================= */}
          {/* TAB 1: LOGIN FORM */}
          {/* ========================================================= */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  Akkauntingizga Kiring
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Avval rolingizni tanlang, soʻng login va parolni kiriting.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Role Selection for Login */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tizimdagi Rolingizni Belgilang:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="login-role-student-btn"
                    onClick={() => {
                      setLoginRole("student");
                      setLoginError(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      loginRole === "student"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        loginRole === "student"
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">🎓 Oʻquvchi</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Darslar & Jadval</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    id="login-role-teacher-btn"
                    onClick={() => {
                      setLoginRole("teacher");
                      setLoginError(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      loginRole === "teacher"
                        ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        loginRole === "teacher"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">👨‍🏫 Oʻqituvchi</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Jurnal & Boshqaruv</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {loginRole === "teacher" ? "Oʻqituvchi Logini (Username)" : "Oʻquvchi Logini (Username)"}
                  </label>
                  <div className="relative">
                    <input
                      id="login-username-input"
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder={loginRole === "teacher" ? "Masalan: dilshod" : "Masalan: temur"}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                      autoFocus
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parol
                  </label>
                  <div className="relative">
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Parolingizni kiriting"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="submit-login-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {loginRole === "teacher"
                      ? "Oʻqituvchi Profiliga Kirish"
                      : "Oʻquvchi Profiliga Kirish"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Hali akkauntingiz yoʻqmi?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setRegError(null);
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Yangi Roʻyxatdan Oʻting
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TAB 2: REGISTRATION FORM */}
          {/* ========================================================= */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  Yangi Akkaunt Yarating
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ismingiz, rolingiz va sinfingizni tanlang. Dars jadvali avtomatik moslashtiriladi.
                </p>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Picker (Student vs Teacher) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tizimdagi Rolingizni Tanlang:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole("student")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      regRole === "student"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">🎓 Oʻquvchi</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Shaxsiy sinf dars jadvali</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole("teacher")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      regRole === "teacher"
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block">👨‍🏫 Oʻqituvchi</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Dars jadvalini boshqarish</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Username Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ism va Familiyangiz
                  </label>
                  <input
                    id="reg-name-input"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Masalan: Sardor Aliyev"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Login (Username)
                  </label>
                  <input
                    id="reg-username-input"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Masalan: sardor_2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Password & Grade Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parol (kamida 4 belgi)
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password-input"
                      type={showRegPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Maxfiy parol"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {regRole === "student" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sinfingiz (Jadval bogʻlanadi)
                    </label>
                    <select
                      id="reg-grade-select"
                      value={regGrade}
                      onChange={(e) => setRegGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-bold"
                    >
                      <option value="10-A sinf">10-A sinf</option>
                      <option value="10-B sinf">10-B sinf</option>
                      <option value="9-V sinf">9-V sinf</option>
                      <option value="11-A sinf">11-A sinf</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Mutaxassislik Fani
                    </label>
                    <select
                      value={regGrade}
                      onChange={(e) => setRegGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer font-bold"
                    >
                      <option value="Fizika">Fizika fani ustozi</option>
                      <option value="Matematika">Matematika & Geometriya</option>
                      <option value="Informatika">Informatika & AI</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Profil Rasmi (Avatar):
                </label>
                <div className="flex items-center gap-2.5">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRegAvatar(url)}
                      className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer relative ${
                        regAvatar === url
                          ? "border-indigo-600 scale-110 shadow-md ring-2 ring-indigo-400"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={url} alt="avatar" className="w-full h-full object-cover" />
                      {regAvatar === url && (
                        <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="submit-register-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Roʻyxatdan Oʻtish & Tizimga Kirish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Akkauntingiz bormi?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setLoginError(null);
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Tizimga Kirish
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* Bottom Security Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Xavfsiz Oʻzbekiston Raqamli Taʼlim Tizimi (SSL)</span>
            </span>
            <span className="font-mono">v3.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};
