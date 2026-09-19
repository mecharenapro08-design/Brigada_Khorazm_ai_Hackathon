import React from "react";
import {
  Sparkles,
  Diamond,
  Award,
  BookOpen,
  FlaskConical,
  Gamepad2,
  Trophy,
  Sun,
  Moon,
  ClipboardList,
  GraduationCap,
  Lock,
  LogOut,
  Calendar,
  Crown,
  Star,
  Zap,
} from "lucide-react";
import { UserProfile } from "../types";
import { calculateLevel } from "../utils/levelUtils";

export type NavTabType = "curriculum" | "lab" | "blitz" | "leaderboard" | "account" | "schedule";

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  userProfile: UserProfile;
  onOpenAITutor: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenAuthModal?: () => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  onOpenSubscriptionModal?: (defaultPlan?: "classic" | "premium") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenAITutor,
  theme,
  onToggleTheme,
  onOpenAuthModal,
  isLoggedIn = true,
  onOpenLogin,
  onLogout,
  onOpenSubscriptionModal,
}) => {
  const userLevel = calculateLevel(userProfile.xp);
  const role = userProfile.role || "student";

  const getNavLinks = () => {
    if (role === "teacher") {
      return [
        { id: "curriculum", label: "Sinflar & Jurnal", icon: ClipboardList },
        { id: "lab", label: "Laboratoriya (3D)", icon: FlaskConical },
        { id: "leaderboard", label: "Sinflar Reytingi", icon: Trophy },
      ] as const;
    }
    if (role === "professor") {
      return [
        { id: "curriculum", label: "Professor Portali", icon: GraduationCap },
        { id: "lab", label: "Laboratoriya (3D)", icon: FlaskConical },
        { id: "leaderboard", label: "Akademik Reyting", icon: Trophy },
      ] as const;
    }
    return [
      { id: "curriculum", label: "Darslar & Mavzular", icon: BookOpen },
      { id: "lab", label: "2D & 3D Laboratoriya", icon: FlaskConical },
      { id: "blitz", label: "DTM & Marafon", icon: Gamepad2 },
      { id: "leaderboard", label: "Yutuqlar & Reyting", icon: Trophy },
    ] as const;
  };

  const navLinks = getNavLinks();

  const roleBadgeInfo = {
    teacher: { label: "Oʻqituvchi", icon: "👨‍🏫", bg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700" },
    professor: { label: "Professor", icon: "🏛️", bg: "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700" },
    student: { label: "Oʻquvchi", icon: "🎓", bg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700" },
  }[role] || { label: "Oʻquvchi", icon: "🎓", bg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700" };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#071026]/90 backdrop-blur-md border-b border-slate-200/90 dark:border-blue-900/40 shadow-xs dark:shadow-lg dark:shadow-black/30 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab("curriculum")}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-500 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                AI <span className="text-indigo-600 dark:text-indigo-400">Maktab</span>
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab("account");
                }}
                title="Akkaunt va rolni almashtirish"
                className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer hover:opacity-90 transition-opacity ${roleBadgeInfo.bg}`}
              >
                <span>{roleBadgeInfo.icon}</span>
                <span>{roleBadgeInfo.label}</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats, Actions, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Teacher info badge */}
            {role === "teacher" && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <span>👨‍🏫 Ustoz Xonasi</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                  4 ta sinf
                </span>
              </div>
            )}

            {/* Student XP & Coins & Subscription */}
            {role === "student" && (
              <div className="hidden sm:flex items-center gap-2">
                <div
                  title="Toʻplangan SmartCoinlar"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/80 text-cyan-700 dark:text-cyan-300 text-xs font-bold shadow-2xs"
                >
                  <Diamond className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" />
                  <span className="font-mono">{userProfile.coins}</span>
                </div>

                <div
                  title={`${userLevel.title} (${userLevel.xpInCurrentLevel}/${userLevel.xpNeededForNext} XP)`}
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-2xs"
                >
                  <span className="text-sm">{userLevel.badgeIcon}</span>
                  <span className="font-mono">{userLevel.level}-Daraja</span>
                  <span className="text-[10px] text-indigo-500/80 font-mono">({userProfile.xp} XP)</span>
                </div>

                {/* Subscription Status Tag */}
                {userProfile.subscription === "premium" ? (
                  <span
                    onClick={() => onOpenSubscriptionModal?.("premium")}
                    title="Faol Premium Tarif"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs font-extrabold cursor-pointer hover:opacity-90"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Premium</span>
                  </span>
                ) : userProfile.subscription === "classic" ? (
                  <span
                    onClick={() => onOpenSubscriptionModal?.("classic")}
                    title="Faol Classic Tarif"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold cursor-pointer hover:opacity-90"
                  >
                    <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                    <span>Classic</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenSubscriptionModal?.()}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 text-xs font-black shadow-xs cursor-pointer active:scale-95"
                  >
                    <Zap className="w-3 h-3 fill-slate-950" />
                    <span>Tariflar</span>
                  </button>
                )}
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={theme === "light" ? "Qorongʻi (Dark) mavzuga oʻtish" : "Yorugʻ (Light) mavzuga oʻtish"}
              aria-label="Mavzuni almashtirish"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-slate-700 hover:text-indigo-600 transition-colors" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-colors" />
              )}
            </button>

            {/* Authentication state */}
            {!isLoggedIn ? (
              <button
                id="navbar-login-btn"
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Kirish</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="navbar-account-btn"
                  onClick={() => setActiveTab("account")}
                  title="Akkaunt boshqaruvi va profil"
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                    activeTab === "account"
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400/50"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/60 shadow-2xs"
                  }`}
                >
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-7 h-7 rounded-lg object-cover border border-indigo-400/60 shrink-0"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight max-w-[85px] sm:max-w-[120px] truncate">
                      {userProfile.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-bold hidden sm:block leading-none">
                      {roleBadgeInfo.label}
                    </span>
                  </div>
                </button>

                {onLogout && (
                  <button
                    id="navbar-quick-logout-btn"
                    onClick={onLogout}
                    title="Tizimdan chiqish"
                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-start gap-1 py-1.5 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
