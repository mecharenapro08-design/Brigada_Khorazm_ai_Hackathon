import React, { useState } from "react";
import {
  User,
  GraduationCap,
  School,
  Diamond,
  Flame,
  Award,
  Edit3,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Sparkles,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { UserProfile, UserRole } from "../types";

export interface AccountManagerProps {
  currentProfile: UserProfile;
  allAccounts: UserProfile[];
  onSwitchAccount: (account: UserProfile) => void;
  onCreateAccount: (newAccount: UserProfile) => void;
  onUpdateCurrentProfile: (updated: UserProfile) => void;
  onDeleteAccount: (accountId: string) => void;
  onBuyItem?: (cost: number, itemName: string) => void;
  onLogout?: () => void;
  onOpenLoginModal?: (initialRole?: UserRole, initialMode?: "login" | "register") => void;
  onOpenSubscriptionModal?: () => void;
}

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
];

export const getRoleMeta = (role?: UserRole) => {
  switch (role) {
    case "teacher":
      return {
        label: "Oʻqituvchi",
        icon: "👨‍🏫",
        badgeClass: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
        ringClass: "border-emerald-500",
        desc: "Jurnal, dars rejalari, uy vazifalarini tekshirish va sinf analitikasi",
      };
    case "professor":
      return {
        label: "Professor",
        icon: "🏛️",
        badgeClass: "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800",
        ringClass: "border-purple-500",
        desc: "Katta maʼruzalar, dissertatsiyalar taqrizi, ilmiy grantlar va nashrlar",
      };
    case "student":
    default:
      return {
        label: "Oʻquvchi",
        icon: "🎓",
        badgeClass: "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
        ringClass: "border-indigo-500",
        desc: "Interaktiv darslar, virtual laboratoriya, dars jadvali va testlar",
      };
  }
};

export const AccountManager: React.FC<AccountManagerProps> = ({
  currentProfile,
  allAccounts,
  onSwitchAccount,
  onUpdateCurrentProfile,
  onLogout,
  onOpenLoginModal,
  onOpenSubscriptionModal,
}) => {
  const [isEditingCurrent, setIsEditingCurrent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Password confirmation state for switching to an existing profile
  const [switchTargetAccount, setSwitchTargetAccount] = useState<UserProfile | null>(null);
  const [switchPassword, setSwitchPassword] = useState<string>("");
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [showSwitchPassword, setShowSwitchPassword] = useState<boolean>(false);

  // Edit current profile form
  const [editName, setEditName] = useState<string>(currentProfile.name);
  const [editUsername, setEditUsername] = useState<string>(currentProfile.username || "");
  const [editPassword, setEditPassword] = useState<string>(currentProfile.password || "123456");
  const [editSchool, setEditSchool] = useState<string>(currentProfile.school || "Prezident Maktabi");
  const [editGrade, setEditGrade] = useState<string>(currentProfile.grade);
  const [editAvatar, setEditAvatar] = useState<string>(currentProfile.avatar);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    onUpdateCurrentProfile({
      ...currentProfile,
      name: editName.trim(),
      username: editUsername.trim() || currentProfile.username,
      password: editPassword.trim() || currentProfile.password || "123456",
      school: editSchool.trim(),
      grade: editGrade.trim(),
      avatar: editAvatar,
    });
    setIsEditingCurrent(false);
  };

  const handleSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchTargetAccount) return;
    setSwitchError(null);

    const expectedPassword = switchTargetAccount.password || "123456";
    if (switchPassword !== expectedPassword) {
      setSwitchError("Kiritilgan parol notoʻgʻri! Iltimos, qaytadan tekshirib koʻring.");
      return;
    }

    onSwitchAccount(switchTargetAccount);
    setSwitchTargetAccount(null);
    setSwitchPassword("");
    setSwitchError(null);
  };

  const currentLevel = Math.floor((currentProfile.xp || 0) / 500) + 1;
  const xpInCurrentLevel = (currentProfile.xp || 0) % 500;
  const currentRoleMeta = getRoleMeta(currentProfile.role);
  const isTeacher = currentProfile.role === "teacher" || currentProfile.role === "professor";

  // Other accounts on this device (excluding current active profile)
  const otherAccounts = allAccounts.filter(
    (acc) => acc.id !== currentProfile.id && acc.username !== currentProfile.username
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* ========================================================= */}
      {/* 1. ASOSIY FOYDALANUVCHI MA'LUMOTLARI KARTASI */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-xs dark:shadow-xl relative overflow-hidden transition-all">
        {/* Top bar with Header & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative group">
              <img
                src={currentProfile.avatar}
                alt={currentProfile.name}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-md ${currentRoleMeta.ringClass}`}
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
                Faol
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                  {currentProfile.name}
                </h1>

                {currentProfile.customTitle && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-black shadow-xs">
                    {currentProfile.customTitle}
                  </span>
                )}

                <button
                  id="edit-profile-trigger-btn"
                  onClick={() => {
                    setEditName(currentProfile.name);
                    setEditUsername(currentProfile.username || "");
                    setEditPassword(currentProfile.password || "123456");
                    setEditSchool(currentProfile.school || "");
                    setEditGrade(currentProfile.grade || "");
                    setEditAvatar(currentProfile.avatar);
                    setIsEditingCurrent(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Maʼlumotlarni tahrirlash"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="hidden sm:inline">Tahrirlash</span>
                </button>
              </div>

              {/* Badges & Institutions */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-md font-bold border ${currentRoleMeta.badgeClass}`}>
                  {currentRoleMeta.icon} {currentRoleMeta.label}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {currentProfile.grade}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <School className="w-3.5 h-3.5" />
                  {currentProfile.school || "Maktab koʻrsatilmagan"}
                </span>
              </div>

              {/* Login & Parol ma'lumotlari */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-slate-400">Login:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">
                    {currentProfile.username || currentProfile.name.toLowerCase().replace(/\s+/g, "")}
                  </strong>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-slate-400">Parol:</span>
                  <strong className="font-mono text-slate-900 dark:text-white">
                    {showPassword ? currentProfile.password || "123456" : "••••••"}
                  </strong>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showPassword ? "Parolni yashirish" : "Parolni koʻrish"}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific stats badge cards */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {!isTeacher ? (
              <>
                <div className="flex-1 sm:flex-initial p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-center sm:text-left min-w-[120px]">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
                    <Diamond className="w-4 h-4 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" />
                    <span>SmartCoin</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    {currentProfile.coins || 0} <span className="text-cyan-600 text-sm">💎</span>
                  </div>
                  <p className="text-[11px] text-cyan-700 dark:text-cyan-300/80 mt-0.5">Mavjud koinlar</p>
                </div>

                <div className="flex-1 sm:flex-initial p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center sm:text-left min-w-[120px]">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{currentLevel}-Daraja</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    {currentProfile.xp || 0} <span className="text-indigo-600 text-sm">XP</span>
                  </div>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300/80 mt-0.5">
                    Keyingisiga {500 - xpInCurrentLevel} XP
                  </p>
                </div>

                <div className="flex-1 sm:flex-initial p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center sm:text-left min-w-[110px]">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Dars Zanjiri</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    {currentProfile.streak || 1} <span className="text-amber-500 text-sm font-normal">kun</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80 mt-0.5">Ketma-ket faollik</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 sm:flex-initial p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center sm:text-left min-w-[120px]">
                  <div className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Oʻquvchilar</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    128 nafar
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">4 ta biriktirilgan sinf</p>
                </div>

                <div className="flex-1 sm:flex-initial p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center sm:text-left min-w-[120px]">
                  <div className="text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Dars Rejalari</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                    36 ta
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Oʻquv konspektlari</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TA'LIM OBUNASI MAQOMI */}
        {/* ========================================================= */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-xs ${
                  currentProfile.subscription === "premium"
                    ? "bg-purple-600"
                    : currentProfile.subscription === "classic"
                    ? "bg-indigo-600"
                    : "bg-slate-400 dark:bg-slate-700"
                }`}
              >
                {currentProfile.subscription === "premium"
                  ? "👑"
                  : currentProfile.subscription === "classic"
                  ? "⭐"
                  : "🔒"}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Taʼlim Obunasi
                  </span>
                  {currentProfile.subscription && currentProfile.subscription !== "free" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                      ✓ Faol
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                      Sinov Rejimi
                    </span>
                  )}
                </div>

                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Faol Tarif:</span>
                  <span
                    className={
                      currentProfile.subscription === "premium"
                        ? "text-purple-600 dark:text-purple-400"
                        : currentProfile.subscription === "classic"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-600 dark:text-slate-400"
                    }
                  >
                    {currentProfile.subscription === "premium"
                      ? "Premium Tarif (AI-repetitor + Kengaytirilgan 3D Lab)"
                      : currentProfile.subscription === "classic"
                      ? "Classic Tarif (Barcha darslar va laboratoriyalar)"
                      : "Standart Bepul Sinov"}
                  </span>
                </div>
              </div>
            </div>

            {onOpenSubscriptionModal && (
              <button
                type="button"
                id="profile-subscription-upgrade-btn"
                onClick={onOpenSubscriptionModal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 text-center"
              >
                {currentProfile.subscription && currentProfile.subscription !== "free"
                  ? "Tarifni Boshqarish"
                  : "⚡ Tarif Xarid Qilish"}
              </button>
            )}
          </div>
        </div>

        {/* Bottom logout and status bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Akkaunt xavfsiz holatda. Barcha dars natijalari saqlanmoqda.</span>
          </div>

          {onLogout && (
            <button
              type="button"
              id="logout-btn"
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Tizimdan Chiqish</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. PROFILGA O'TISH & AVTORIZATSIYA (FAQAT LOGIN-PAROL BILAN) */}
      {/* ========================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-black text-slate-900 dark:text-white font-display">
                Oʻqituvchi va Oʻquvchi Profiliga Kirish
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Xavfsizlik talabiga binoan, oʻqituvchi yoki oʻquvchi profiliga oʻtish faqat rolni belgilab, login va parol orqali amalga oshiriladi.
            </p>
          </div>
        </div>

        {/* Direct role entrance buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teacher Login Button */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                👨‍🏫
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Oʻqituvchi Profiliga Kirish
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Elektron jurnal, dars rejalari, sinf nazorati va oʻquvchilar monitoringi.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="switch-to-teacher-auth-btn"
              onClick={() => onOpenLoginModal?.("teacher", "login")}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Oʻqituvchi Logini va Paroli Bilan Kirish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Student Login Button */}
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/30 flex flex-col justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                🎓
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Oʻquvchi Profiliga Kirish
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Shaxsiy dars jadvali, 3D laboratoriyalar, interaktiv testlar va XP koʻrsatkichlari.
                </p>
              </div>
            </div>

            <button
              type="button"
              id="switch-to-student-auth-btn"
              onClick={() => onOpenLoginModal?.("student", "login")}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Oʻquvchi Logini va Paroli Bilan Kirish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Saved Profiles Quick Select (Requires Password Confirmation) */}
        {otherAccounts.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Ushbu Qurilmadagi Boshqa Saqlangan Akkauntlar (Kirish uchun parol talab etiladi):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherAccounts.map((acc) => {
                const meta = getRoleMeta(acc.role);
                return (
                  <div
                    key={acc.id || acc.username}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className={`w-9 h-9 rounded-lg object-cover border ${meta.ringClass}`}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {acc.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {meta.icon} {meta.label} • {acc.grade}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSwitchTargetAccount(acc);
                        setSwitchPassword("");
                        setSwitchError(null);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Lock className="w-3 h-3 text-indigo-500" />
                      <span>Parol Bilan Kirish</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Register New Account Link */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Yangi oʻqituvchi yoki oʻquvchi hisobini yaratmoqchimisiz?
          </span>
          <button
            type="button"
            onClick={() => onOpenLoginModal?.("student", "register")}
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Yangi Roʻyxatdan Oʻtish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. PASSWORD CONFIRMATION MODAL FOR SAVED PROFILE SWITCH */}
      {/* ========================================================= */}
      {switchTargetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">
                  Profilga Kirishni Tasdiqlang
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {switchTargetAccount.name} ({getRoleMeta(switchTargetAccount.role).label})
                </p>
              </div>
            </div>

            {switchError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{switchError}</span>
              </div>
            )}

            <form onSubmit={handleSwitchSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parolni Kiriting:
                </label>
                <div className="relative">
                  <input
                    type={showSwitchPassword ? "text" : "password"}
                    value={switchPassword}
                    onChange={(e) => setSwitchPassword(e.target.value)}
                    placeholder="Parol..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showSwitchPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSwitchTargetAccount(null);
                    setSwitchPassword("");
                    setSwitchError(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kirish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TAHRIRLASH MODALI */}
      {/* ========================================================= */}
      {isEditingCurrent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-500" />
              Profil Maʼlumotlarini Tahrirlash
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ism va Familiyangiz:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Login (Username):
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Parol:
                  </label>
                  <input
                    type="text"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sinf yoki Mutaxassislik:
                </label>
                <input
                  type="text"
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masalan: 10-A sinf yoki Fizika oʻqituvchisi"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Taʼlim Muassasasi:
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Avatar Tanlang:
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVATAR_OPTIONS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="avatar"
                      onClick={() => setEditAvatar(av)}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                        editAvatar === av
                          ? "border-indigo-600 scale-105 shadow-md"
                          : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingCurrent(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
