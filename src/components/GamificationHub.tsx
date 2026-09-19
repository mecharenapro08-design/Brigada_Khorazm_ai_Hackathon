import React, { useState } from "react";
import {
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  Diamond,
  ShoppingBag,
  Target,
  Lock,
  Sparkles,
  Shuffle,
  ChevronRight,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { UserProfile, DailyQuest, LeaderboardUser } from "../types";
import { INITIAL_BADGES, LEADERBOARD_DATA } from "../data/curriculum";
import { calculateLevel } from "../utils/levelUtils";
import { SHOP_ITEMS, ShopItem } from "../data/shopItems";

interface GamificationHubProps {
  userProfile: UserProfile;
  onClaimQuest: (questId: string, xp: number, coins: number) => void;
  onBuyShopItem: (cost: number, itemName: string, itemCategory?: string, itemValue?: string) => void;
}

export const GamificationHub: React.FC<GamificationHubProps> = ({
  userProfile,
  onClaimQuest,
  onBuyShopItem,
}) => {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "quests" | "badges" | "shop">("quests");
  const [shopCategory, setShopCategory] = useState<string>("all");
  const [badgeFilter, setBadgeFilter] = useState<"all" | "unlocked" | "locked">("all");

  // Dynamic / randomized leaderboard state
  const [leaderboardList, setLeaderboardList] = useState<LeaderboardUser[]>(LEADERBOARD_DATA);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  // Calculate current user level
  const userLevel = calculateLevel(userProfile.xp);

  const handleClaim = (quest: DailyQuest) => {
    if (!quest.completed && quest.progress >= quest.target) {
      confetti({ particleCount: 60, spread: 70 });
      onClaimQuest(quest.id, quest.rewardXP, quest.rewardCoins);
    }
  };

  // Randomize / shuffle leaderboard with realistic variations
  const handleRandomizeLeaderboard = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const randomized = [...leaderboardList].map((user) => {
        const deltaXP = Math.floor(Math.random() * 90) - 40;
        const deltaStreak = Math.random() > 0.6 ? 1 : 0;
        return {
          ...user,
          xp: Math.max(900, user.xp + deltaXP),
          streak: Math.max(1, user.streak + deltaStreak),
        };
      });

      // Re-sort by XP descending
      randomized.sort((a, b) => b.xp - a.xp);
      setLeaderboardList(randomized);
      setIsShuffling(false);
      confetti({ particleCount: 35, spread: 50 });
    }, 400);
  };

  const handlePurchase = (item: ShopItem) => {
    onBuyShopItem(item.cost, item.name, item.category, item.value);
  };

  const filteredShopItems = shopCategory === "all"
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter((item) => item.category === shopCategory);

  const filteredBadges = INITIAL_BADGES.filter((badge) => {
    const isUnlocked = badge.isUnlocked || userProfile.unlockedBadgeIds.includes(badge.id);
    if (badgeFilter === "unlocked") return isUnlocked;
    if (badgeFilter === "locked") return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* LEVEL & PROGRESS HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Geymifikatsiya, Darajalar & Motivatsiya Tizimi</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl">{userLevel.badgeIcon}</span>
              <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
                {userLevel.title}
              </h1>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                {userLevel.level}-Daraja
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Darslarni oʻqish, 2D/3D laboratoriya tajribalari va DTM testlarini bajarish orqali XP toʻplang va yangi ilmiy darajalarga koʻtariling!
            </p>

            {/* LEVEL PROGRESS BAR */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Joriy daraja: <span className="text-white font-bold">{userLevel.xpInCurrentLevel} XP</span> / {userLevel.xpNeededForNext} XP
                </span>
                <span className="text-amber-400 font-bold">
                  {userLevel.progressPercent}% • Keyingi darajaga {userLevel.xpNeededForNext - userLevel.xpInCurrentLevel} XP qoldi
                </span>
              </div>
              <div className="w-full h-3.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 rounded-full transition-all duration-700 shadow-lg shadow-amber-500/30"
                  style={{ width: `${userLevel.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* User Stat Cards */}
          <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block">SmartCoin</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-cyan-400 font-black text-lg">
                <Diamond className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>{userProfile.coins}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block">Umumiy XP</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-indigo-300 font-black text-lg font-mono">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>{userProfile.xp}</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-center">
              <span className="text-[11px] text-slate-400 font-semibold block">Ketma-ketlik</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-amber-400 font-black text-lg">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{userProfile.streak} kun</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("quests")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "quests"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Kunlik Vazifalar</span>
        </button>

        <button
          onClick={() => setActiveTab("shop")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "shop"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛍️ SmartCoin Doʻkoni</span>
          <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 text-[10px] font-mono font-bold">
            {SHOP_ITEMS.length} tavar
          </span>
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "leaderboard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Peshqadamlar Reytingi</span>
        </button>

        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === "badges"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Yutuqlar & Nishonlar</span>
        </button>
      </div>

      {/* TAB 1: KUNLIK VAZIFALAR (QUESTS) */}
      {activeTab === "quests" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userProfile.dailyQuests.map((quest) => {
              const isReady = quest.progress >= quest.target;
              const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

              return (
                <div
                  key={quest.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    quest.completed
                      ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70"
                      : isReady
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-500/60 shadow-lg shadow-indigo-900/10"
                      : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{quest.title}</h4>
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-lg border border-amber-300 dark:border-amber-700/60 shrink-0">
                        +{quest.rewardXP} XP / +{quest.rewardCoins} 💎
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-mono">
                        <span>Bajarilishi</span>
                        <span>
                          {quest.progress} / {quest.target}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            quest.completed
                              ? "bg-emerald-500"
                              : isReady
                              ? "bg-indigo-600"
                              : "bg-indigo-400"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {quest.completed ? "Yutuq qabul qilingan" : isReady ? "Tayyor!" : "Jarayonda"}
                    </span>

                    {quest.completed ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Bajarildi
                      </span>
                    ) : (
                      <button
                        disabled={!isReady}
                        onClick={() => handleClaim(quest)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isReady
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md active:scale-95 cursor-pointer"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Qabul qilish
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SMARTCOIN MARKET / DOʻKONI */}
      {activeTab === "shop" && (
        <div className="space-y-6">
          {/* Shop Header & Category Filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Profil Customization Doʻkoni
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  SmartCoinlaringiz evaziga unvonlar, avatarlar, nurli ramkalar va bannerlar xarid qiling!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 font-bold text-sm">
              <Diamond className="w-4 h-4 fill-cyan-500 text-cyan-500" />
              <span>Sizda: {userProfile.coins} 💎</span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "Barchasi" },
              { id: "frame", label: "💫 Ramkalar & Auralar" },
              { id: "title", label: "👑 Maxsus Unvonlar" },
              { id: "avatar", label: "🧑‍🚀 Eksklyuziv Avatarlar" },
              { id: "theme", label: "🌌 Profil Temalari" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setShopCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  shopCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Shop Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredShopItems.map((item) => {
              const isOwned = (userProfile.inventory || []).includes(item.name);
              const canAfford = userProfile.coins >= item.cost;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-3xl p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {item.categoryLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Visual Preview */}
                    {item.category === "frame" && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${item.value} bg-slate-300 dark:bg-slate-800 flex items-center justify-center text-xs font-bold`}>
                          👤
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Ramka koʻrinishi</span>
                      </div>
                    )}

                    {item.category === "title" && (
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 text-xs font-bold text-indigo-600 dark:text-indigo-300 font-mono">
                        {userProfile.name} • <span className="text-amber-500 font-black">[{item.value}]</span>
                      </div>
                    )}

                    {item.category === "theme" && (
                      <div className={`h-8 rounded-xl bg-gradient-to-r ${item.value} border border-slate-700/50 flex items-center px-3 text-[10px] text-white font-mono`}>
                        Gradient preview
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                    <div className="flex items-center gap-1.5 font-bold text-cyan-600 dark:text-cyan-400 text-sm">
                      <Diamond className="w-4 h-4 fill-cyan-500 text-cyan-500" />
                      <span>{item.cost} 💎</span>
                    </div>

                    {isOwned ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" />
                        Xarid qilingan
                      </span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => handlePurchase(item)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 font-bold text-xs transition-all shadow-md active:scale-95 disabled:pointer-events-none cursor-pointer"
                      >
                        {canAfford ? "Xarid qilish" : "Tangalar yetmaydi"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PESHQADAMLAR REYTINGI (LEADERBOARD) */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Respublika Boʻyicha Jonli Reyting
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Oʻzbekistonning barcha maktab va litseylari oʻquvchilari oʻrtasida haftalik saralash.
              </p>
            </div>

            <button
              onClick={handleRandomizeLeaderboard}
              disabled={isShuffling}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
              <span>{isShuffling ? "Yangilanmoqda..." : "Jonli Yangilash"}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
            {leaderboardList.map((user, index) => {
              const isCurrentUser = user.name.toLowerCase().includes(userProfile.name.toLowerCase().split(" ")[0]);
              const userCalcLvl = calculateLevel(isCurrentUser ? userProfile.xp : user.xp);

              return (
                <div
                  key={user.id}
                  className={`p-4 flex items-center justify-between gap-3 transition-colors ${
                    isCurrentUser
                      ? "bg-indigo-50/80 dark:bg-indigo-950/50 font-bold border-l-4 border-indigo-600"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        index === 0
                          ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30 ring-2 ring-amber-300"
                          : index === 1
                          ? "bg-slate-300 text-slate-900 ring-2 ring-slate-200"
                          : index === 2
                          ? "bg-amber-700 text-white ring-2 ring-amber-600"
                          : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </div>

                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.name} {isCurrentUser && "(Siz)"}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                          {userCalcLvl.badgeIcon} {userCalcLvl.level}-Daraja
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.schoolOrCity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{user.streak} kun</span>
                    </div>

                    <div className="font-mono font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-950 px-3 py-1 rounded-xl border border-indigo-200 dark:border-slate-800">
                      {isCurrentUser ? userProfile.xp : user.xp} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: NISHONLAR VA DOSTIjeniya (ACHIEVEMENTS) */}
      {activeTab === "badges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Maxsus Yutuqlar va Nishonlar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Har bir fizik, matematik va ilmiy marrani zabt etganingizda nishonlar ochiladi.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(["all", "unlocked", "locked"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBadgeFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    badgeFilter === filter
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {filter === "all" ? "Barchasi" : filter === "unlocked" ? "Ochilganlar" : "Qulflangan"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked =
                badge.isUnlocked || userProfile.unlockedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isUnlocked
                      ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      isUnlocked
                        ? "bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{badge.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {badge.description}
                    </p>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
                        ✓ Ochilgan ({badge.unlockedAt || "Yaqinda"})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
