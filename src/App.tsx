import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Bot,
  X,
  BookOpen,
  Calendar,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  UserProfile,
  UserRole,
  SubjectModule,
  LessonChapter,
} from "./types";
import { SUBJECT_MODULES } from "./data/curriculum";
import { Navbar, NavTabType } from "./components/Navbar";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { SubjectCatalog } from "./components/SubjectCatalog";
import { InteractiveReader } from "./components/InteractiveReader";
import { InteractiveLab } from "./components/InteractiveLab";
import { BlitzQuizGame } from "./components/BlitzQuizGame";
import { GamificationHub } from "./components/GamificationHub";
import { AccountManager } from "./components/AccountManager";
import { TeacherPortal } from "./components/TeacherPortal";
import { ProfessorPortal } from "./components/ProfessorPortal";
import { VisualScheduleView } from "./components/VisualScheduleView";
import { AITutorModal } from "./components/AITutorModal";
import { AuthModal } from "./components/AuthModal";
import { ComparisonBanner } from "./components/ComparisonBanner";
import { SubscriptionModal } from "./components/SubscriptionModal";
import { SubscriptionBanner } from "./components/SubscriptionBanner";
import { TeacherLeaderboard } from "./components/TeacherLeaderboard";
import { calculateLevel } from "./utils/levelUtils";

const PRESET_ACCOUNTS: UserProfile[] = [
  {
    id: "acc-student-1",
    name: "Temur Malik",
    username: "temur",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    school: "Prezident Maktabi (Toshkent)",
    grade: "10-sinf",
    role: "student",
    xp: 2185,
    coins: 140,
    streak: 7,
    completedChapterIds: ["pythagoras"],
    unlockedBadgeIds: ["b1", "b2"],
    inventory: ["item-neon-frame"],
    lastActiveDate: new Date().toISOString().split("T")[0],
    dailyQuests: [
      {
        id: "q1",
        title: "Bugun 1 ta interaktiv darsni yakunlang",
        description: "Darslikdagi xohlagan mavzuni oʻqib, testini yeching.",
        progress: 1,
        target: 1,
        completed: true,
        rewardXP: 100,
        rewardCoins: 20,
      },
      {
        id: "q2",
        title: "Virtual Laboratoriyada tajriba bajaring",
        description: "3D Pifagor, Atom yoki Nyuton simulyatsiyasida parametrlarni oʻzgartiring.",
        progress: 1,
        target: 1,
        completed: false,
        rewardXP: 150,
        rewardCoins: 30,
      },
      {
        id: "q3",
        title: "45-soniyali Blitz DTM jangida 5 ta toʻgʻri javob bering",
        description: "DTM test bazasidan tezkor savollarga toʻgʻri javob toping.",
        progress: 3,
        target: 5,
        completed: false,
        rewardXP: 200,
        rewardCoins: 40,
      },
    ],
  },
  {
    id: "acc-teacher-1",
    name: "Dilshod Karimov",
    username: "dilshod",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    school: "Prezident Maktabi (Toshkent)",
    grade: "Fizika & Astronomiya oʻqituvchisi",
    role: "teacher",
    xp: 0,
    coins: 0,
    streak: 0,
    completedChapterIds: [],
    unlockedBadgeIds: [],
    inventory: [],
    lastActiveDate: new Date().toISOString().split("T")[0],
    dailyQuests: [],
  },
  {
    id: "acc-professor-1",
    name: "Prof. Anvar Joʻrayev",
    username: "anvar",
    password: "123456",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    school: "Oʻzbekiston Milliy Universiteti",
    grade: "Fizika-matematika fanlari doktori (DSc)",
    role: "professor",
    xp: 0,
    coins: 0,
    streak: 0,
    completedChapterIds: [],
    unlockedBadgeIds: [],
    inventory: [],
    lastActiveDate: new Date().toISOString().split("T")[0],
    dailyQuests: [],
  },
];

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("aimaktab_theme") as "light" | "dark") || "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("aimaktab_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [accounts, setAccounts] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("aimaktab_accounts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ensure no legacy manager role accounts and passwords exist
          return parsed
            .filter((a) => (a.role as string) !== "manager")
            .map((a) => ({
              ...a,
              username: a.username || a.name?.toLowerCase().replace(/\s+/g, "") || "user",
              password: a.password || "123456",
            }));
        }
      } catch (e) {
        console.error("Error reading accounts", e);
      }
    }
    return PRESET_ACCOUNTS;
  });

  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => {
    const savedId = localStorage.getItem("aimaktab_current_acc_id");
    if (savedId) {
      const found = accounts.find((a) => a.id === savedId);
      if (found && (found.role as string) !== "manager") return found;
    }
    return accounts[0] || PRESET_ACCOUNTS[0];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem("aimaktab_accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (currentProfile?.id) {
      localStorage.setItem("aimaktab_current_acc_id", currentProfile.id);
    }
  }, [currentProfile]);

  const [activeTab, setActiveTab] = useState<NavTabType>("curriculum");

  const [modules, setModules] = useState<SubjectModule[]>(SUBJECT_MODULES);

  const [selectedChapter, setSelectedChapter] = useState<{
    chapter: LessonChapter;
    module: SubjectModule;
  } | null>(null);

  const [initialLabType, setInitialLabType] = useState<string>("pythagoras");

  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [aiTutorInitialTopic, setAiTutorInitialTopic] = useState<string>("");

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>("student");
  const [authModalInitialMode, setAuthModalInitialMode] = useState<"login" | "register">("login");

  const [isCustomLessonModalOpen, setIsCustomLessonModalOpen] = useState<boolean>(false);
  const [customLessonTopic, setCustomLessonTopic] = useState<string>("");
  const [isGeneratingCustomLesson, setIsGeneratingCustomLesson] = useState<boolean>(false);
  const [studentCurriculumView, setStudentCurriculumView] = useState<"catalog" | "schedule">("catalog");
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [subscriptionDefaultPlan, setSubscriptionDefaultPlan] = useState<"classic" | "premium">("premium");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectSubscriptionPlan = (plan: "classic" | "premium", period: "month" | "year") => {
    const expires = new Date();
    if (period === "month") {
      expires.setMonth(expires.getMonth() + 1);
    } else {
      expires.setFullYear(expires.getFullYear() + 1);
    }
    const updated: UserProfile = {
      ...currentProfile,
      subscription: plan,
      subscriptionPeriod: period,
      subscriptionExpiresAt: expires.toISOString().split("T")[0],
    };
    setCurrentProfile(updated);
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    showToast(
      `🎉 Tabriklaymiz! Sizning profilingizga "${plan === "premium" ? "Premium" : "Classic"}" tarifi muvaffaqiyatli biriktirildi.`
    );
  };

  const handleLogin = (
    username: string,
    pass: string,
    selectedRole?: UserRole
  ): { success: boolean; message?: string } => {
    const cleanUsername = username.trim().toLowerCase();
    const found = accounts.find(
      (a) =>
        (a.username && a.username.toLowerCase() === cleanUsername) ||
        a.name.toLowerCase() === cleanUsername ||
        a.name.toLowerCase().replace(/\s+/g, "") === cleanUsername
    );

    if (!found) {
      return {
        success: false,
        message:
          selectedRole === "teacher"
            ? "Bunday oʻqituvchi logini topilmadi! Oʻqituvchi demo logini: dilshod (parol: 123456) yoki Roʻyxatdan oʻting."
            : "Bunday oʻquvchi logini topilmadi! Oʻquvchi demo logini: temur (parol: 123456) yoki Roʻyxatdan oʻting.",
      };
    }

    const expectedPassword = found.password || "123456";
    if (pass !== expectedPassword) {
      return {
        success: false,
        message: "Parol notoʻgʻri! Qaytadan urinib koʻring.",
      };
    }

    // Role verification:
    // O'qituvchi profiliga kirish uchun o'qituvchi, o'quvchi profiliga kirish uchun o'quvchi ekanini belgilashi shart
    if (selectedRole) {
      const accRole = found.role || "student";
      const isTeacherAcc = accRole === "teacher" || accRole === "professor";
      if (selectedRole === "teacher" && !isTeacherAcc) {
        return {
          success: false,
          message:
            "Xatolik: Ushbu hisob OʻQUVCHI roliga tegishli! Oʻqituvchi profiliga kirish uchun oʻqituvchi hisobini kiriting yoki yuqorida rolni 'Oʻquvchi' deb belgilang.",
        };
      }
      if (selectedRole === "student" && isTeacherAcc) {
        return {
          success: false,
          message:
            "Xatolik: Ushbu hisob OʻQITUVCHI roliga tegishli! Oʻquvchi profiliga kirish uchun oʻquvchi hisobini kiriting yoki yuqorida rolni 'Oʻqituvchi' deb belgilang.",
        };
      }
    }

    setIsLoggedIn(true);
    setCurrentProfile(found);
    showToast(
      `Xush kelibsiz, ${found.name}! (${
        (found.role || "student") === "teacher"
          ? "Oʻqituvchi"
          : found.role === "professor"
          ? "Professor"
          : "Oʻquvchi"
      } portali)`
    );
    return { success: true };
  };

  const handleRegister = (newProfile: UserProfile) => {
    setAccounts((prev) => [newProfile, ...prev]);
    setCurrentProfile(newProfile);
    setIsLoggedIn(true);
    showToast(`Xush kelibsiz, ${newProfile.name}! Akkaunt muvaffaqiyatli yaratildi.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast("Tizimdan chiqildi. Qayta kirish uchun login va parolingizni kiriting.");
    setIsAuthModalOpen(true);
  };

  const handleSwitchAccount = (newAcc: UserProfile) => {
    setCurrentProfile(newAcc);
    showToast(`"${newAcc.name}" profiliga oʻtildi (${newAcc.role || "student"})`);
  };

  const handleCreateAccount = (newAcc: UserProfile) => {
    setAccounts((prev) => [newAcc, ...prev]);
    setCurrentProfile(newAcc);
    showToast(`Yangi akkaunt "${newAcc.name}" yaratildi!`);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentProfile(updated);
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updated.id ? updated : acc))
    );
    showToast("Profil maʼlumotlari va parol yangilandi!");
  };

  const handleDeleteAccount = (accId: string) => {
    if (accounts.length <= 1) {
      alert("Kamida bitta akkaunt qolishi shart!");
      return;
    }
    const filtered = accounts.filter((a) => a.id !== accId);
    setAccounts(filtered);
    if (currentProfile.id === accId) {
      setCurrentProfile(filtered[0]);
    }
    showToast("Akkaunt oʻchirildi.");
  };

  const handleAwardRewards = (earnedXP: number, earnedCoins: number, reason?: string) => {
    setCurrentProfile((prev) => {
      const prevLevel = calculateLevel(prev.xp);
      const newXP = prev.xp + earnedXP;
      const newCoins = prev.coins + earnedCoins;
      const newLevel = calculateLevel(newXP);

      const updated: UserProfile = {
        ...prev,
        xp: newXP,
        coins: newCoins,
      };
      setAccounts((all) =>
        all.map((a) => (a.id === updated.id ? updated : a))
      );

      if (newLevel.level > prevLevel.level) {
        setTimeout(() => {
          confetti({ particleCount: 140, spread: 90 });
          showToast(`TABRIKLAYMIZ! 🎉 Siz yangi darajaga koʻtarildingiz: ${newLevel.title}!`);
        }, 300);
      }

      return updated;
    });

    if (reason) {
      showToast(`+${earnedXP} XP va +${earnedCoins} 💎 qoʻshildi! (${reason})`);
    } else {
      showToast(`+${earnedXP} XP va +${earnedCoins} 💎 mukofot olindi!`);
    }
  };

  const handleCompleteChapter = (
    chapterId: string,
    earnedXP: number,
    earnedCoins: number
  ) => {
    setCurrentProfile((prev) => {
      const already = prev.completedChapterIds.includes(chapterId);
      const newIds = already ? prev.completedChapterIds : [...prev.completedChapterIds, chapterId];
      const updated: UserProfile = {
        ...prev,
        completedChapterIds: newIds,
        xp: prev.xp + (already ? 0 : earnedXP),
        coins: prev.coins + (already ? 0 : earnedCoins),
      };
      setAccounts((all) =>
        all.map((a) => (a.id === updated.id ? updated : a))
      );
      return updated;
    });

    confetti({ particleCount: 70, spread: 80 });
    showToast(`Dars muvaffaqiyatli yakunlandi! +${earnedXP} XP va +${earnedCoins} 💎 berildi!`);
  };

  const handleClaimQuest = (questId: string, xp: number, coins: number) => {
    setCurrentProfile((prev) => {
      const updatedQuests = prev.dailyQuests.map((q) =>
        q.id === questId ? { ...q, completed: true } : q
      );
      const updated: UserProfile = {
        ...prev,
        xp: prev.xp + xp,
        coins: prev.coins + coins,
        dailyQuests: updatedQuests,
      };
      setAccounts((all) =>
        all.map((a) => (a.id === updated.id ? updated : a))
      );
      return updated;
    });
    showToast(`Topshiriq bajarildi! +${xp} XP va +${coins} 💎 olindi!`);
  };

  const handleBuyShopItem = (
    cost: number,
    itemName: string,
    itemCategory?: string,
    itemValue?: string
  ) => {
    if (currentProfile.coins < cost) {
      alert("Koinlaringiz yetarli emas! Darslarni oʻqib koin toʻplang.");
      return;
    }

    setCurrentProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        coins: prev.coins - cost,
        inventory: [...(prev.inventory || []), itemName],
        avatar: itemCategory === "avatar" && itemValue ? itemValue : prev.avatar,
        avatarFrame: itemCategory === "frame" && itemValue ? itemValue : prev.avatarFrame,
        customTitle: itemCategory === "title" && itemValue ? itemValue : prev.customTitle,
        bannerTheme: itemCategory === "theme" && itemValue ? itemValue : prev.bannerTheme,
      };
      setAccounts((all) =>
        all.map((a) => (a.id === updated.id ? updated : a))
      );
      return updated;
    });

    confetti({ particleCount: 50, spread: 60 });
    showToast(`"${itemName}" xarid qilindi va profilingizga biriktirildi!`);
  };

  const handleOpenLab = (simulationType?: string) => {
    if (simulationType) {
      setInitialLabType(simulationType);
    }
    setSelectedChapter(null);
    setActiveTab("lab");
  };

  const handleOpenAITutorWithTopic = (topic: string) => {
    setAiTutorInitialTopic(topic);
    setIsAITutorOpen(true);
  };

  const handleCreateCustomLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLessonTopic.trim()) return;

    setIsGeneratingCustomLesson(true);
    setTimeout(() => {
      const newChapterId = `custom-${Date.now()}`;
      const newChapter: LessonChapter = {
        id: newChapterId,
        title: customLessonTopic.trim(),
        durationMinutes: 15,
        xpReward: 160,
        coinsReward: 35,
        summary: `AI tomonidan maxsus generatsiya qilingan interaktiv dars: "${customLessonTopic}". Unda asosiy fizik va matematik qonuniyatlar, hayotiy misollar va DTM testlari jamlangan.`,
        traditionalVsDigital: {
          traditional: "Qogʻoz kitobda uzun va zerikarli matn keltirilgan boʻlib, oʻquvchi uni yodlashga majbur boʻladi.",
          smartEdu: "AI Maktabda mavzu hayotiy oʻxshatishlar, interaktiv formulalar va jonli 3D tajribalar orqali oʻrgatiladi.",
        },
        contentSections: [
          {
            title: `1. ${customLessonTopic} - Nazariy Asoslar`,
            body: `Ushbu mavzu zamonaviy fanning fundamental qonuniyatlariga tayanadi. Har qanday murakkab formulaning tagida oddiy tabiiy muvozanat yotadi.`,
            analogy: `Tasavvur qiling, har bir tizim minimal energiyaga intiladi — xuddi tepalikdan pastga qarab dumalayotgan koptok kabi.`,
            interactiveWidget: "formula_calculator",
            widgetData: { formulaName: "E = mc² / F = ma" },
          },
          {
            title: `2. Amaliyot va Texnologiyalarda Qoʻllanilishi`,
            body: `Mavzuni tushunish kompyuter dasturlash, aerokosmik texnologiyalar va sunʼiy intellekt modellarini ishlab chiqishda qoʻl keladi.`,
            analogy: `Telefoningizdagi har bir sensor (akselerometr, giroskop, GPS) ushbu tamoyil asosida ishlaydi.`,
          },
        ],
        quiz: [
          {
            id: "cq-1",
            question: `Ushbu "${customLessonTopic}" mavzusining asosiy maqsadi nima?`,
            options: [
              "Fizik/tabiiy jarayonning qonuniyatini tushunish va formulani qoʻllash",
              "Faqat nazariyani yodlab olish",
              "Matematik hisob-kitobni inkor etish",
              "Tajriba oʻtkazmasdan xulosa qilish",
            ],
            correctIndex: 0,
            explanation: `Tabiat qonunlarini amaliyotda tekshirish va anglash fanning asl mohiyatidir.`,
            xp: 50,
          },
        ],
        simulation: {
          type: "pythagoras",
          title: "Virtual Interaktiv Tajriba",
          description: "Mavzu yuzasidan 3D simulyatsiyani sinab koʻring.",
        },
      };

      const targetModule = modules[0] || SUBJECT_MODULES[0];
      const updatedModule = {
        ...targetModule,
        chapters: [newChapter, ...targetModule.chapters],
      };

      setModules((prev) =>
        prev.map((m) => (m.id === targetModule.id ? updatedModule : m))
      );

      setIsGeneratingCustomLesson(false);
      setIsCustomLessonModalOpen(false);
      setCustomLessonTopic("");

      setSelectedChapter({
        chapter: newChapter,
        module: updatedModule,
      });

      showToast(`"${newChapter.title}" darsi muvaffaqiyatli tuzildi va ochildi!`);
    }, 1200);
  };

  const userRole = currentProfile.role || "student";

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden transition-colors duration-200">
      <AnimatedBackground theme={theme} />

      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-2xl bg-indigo-900 text-indigo-100 border border-indigo-400/50 shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedChapter(null);
          setActiveTab(tab);
        }}
        userProfile={currentProfile}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAITutor={() => {
          setAiTutorInitialTopic("");
          setIsAITutorOpen(true);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSubscriptionModal={(plan) => {
          setSubscriptionDefaultPlan(plan || "premium");
          setIsSubscriptionModalOpen(true);
        }}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 relative z-10">
        {selectedChapter ? (
          <InteractiveReader
            chapter={selectedChapter.chapter}
            module={selectedChapter.module}
            onBack={() => setSelectedChapter(null)}
            onOpenLab={handleOpenLab}
            onOpenAITutorWithTopic={handleOpenAITutorWithTopic}
            onCompleteChapter={handleCompleteChapter}
            isAlreadyCompleted={currentProfile.completedChapterIds.includes(
              selectedChapter.chapter.id
            )}
          />
        ) : (
          <>
            {/* 1. TEACHER VIEW */}
            {userRole === "teacher" && (
              <>
                {activeTab === "curriculum" && (
                  <TeacherPortal
                    userProfile={currentProfile}
                    onOpenAITutorWithTopic={handleOpenAITutorWithTopic}
                    onOpenLabWithTopic={handleOpenLab}
                  />
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium flex items-center justify-between">
                      <span>👨‍🏫 <strong>Ustoz Dars Jadvali Boshqaruvi:</strong> Darslarni tahrirlash, qoʻshish va sinflar xaritasini boshqarish imkoniyati faol.</span>
                    </div>
                    <VisualScheduleView
                      userProfile={currentProfile}
                      isTeacherView={true}
                      onOpenLabWithTopic={handleOpenLab}
                    />
                  </div>
                )}

                {activeTab === "leaderboard" && (
                  <TeacherLeaderboard userProfile={currentProfile} />
                )}
              </>
            )}

            {/* 2. PROFESSOR VIEW */}
            {userRole === "professor" && (
              <>
                {activeTab === "curriculum" && (
                  <ProfessorPortal userProfile={currentProfile} />
                )}

                {activeTab === "leaderboard" && (
                  <TeacherLeaderboard userProfile={currentProfile} />
                )}
              </>
            )}

            {/* 3. STUDENT VIEW */}
            {userRole === "student" && (
              <>
                {activeTab === "curriculum" && (
                  <div className="space-y-6">
                    {/* Subscription Paywall / Banner on Main Page */}
                    <SubscriptionBanner
                      userProfile={currentProfile}
                      onOpenSubscriptionModal={(plan) => {
                        setSubscriptionDefaultPlan(plan || "premium");
                        setIsSubscriptionModalOpen(true);
                      }}
                    />

                    {/* Switcher between Modules Catalog and Schedule */}
                    <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                          id="curriculum-catalog-tab-btn"
                          onClick={() => setStudentCurriculumView("catalog")}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            studentCurriculumView === "catalog"
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Darslar & Mavzular</span>
                        </button>
                        <button
                          id="curriculum-schedule-tab-btn"
                          onClick={() => setStudentCurriculumView("schedule")}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                            studentCurriculumView === "schedule"
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Darslar Jadvali</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                          🎓 {currentProfile.grade || "10-sinf"}
                        </span>
                      </div>
                    </div>

                    {studentCurriculumView === "schedule" ? (
                      <VisualScheduleView
                        userProfile={currentProfile}
                        isTeacherView={false}
                        onOpenLabWithTopic={handleOpenLab}
                      />
                    ) : (
                      <>
                        <SubjectCatalog
                          modules={modules}
                          userProfile={currentProfile}
                          onSelectChapter={(chapter, module) => {
                            setSelectedChapter({ chapter, module });
                          }}
                          onOpenLab={handleOpenLab}
                          onOpenCustomLessonModal={() => setIsCustomLessonModalOpen(true)}
                        />
                        <ComparisonBanner />
                      </>
                    )}
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-4">
                    <VisualScheduleView
                      userProfile={currentProfile}
                      isTeacherView={false}
                      onOpenLabWithTopic={handleOpenLab}
                    />
                  </div>
                )}

                {activeTab === "blitz" && (
                  <BlitzQuizGame
                    onAwardRewards={(xp, coins) => {
                      handleAwardRewards(xp, coins, "Blitz DTM Gʻalabasi");
                    }}
                  />
                )}

                {activeTab === "leaderboard" && (
                  <GamificationHub
                    userProfile={currentProfile}
                    onClaimQuest={handleClaimQuest}
                    onBuyShopItem={handleBuyShopItem}
                  />
                )}
              </>
            )}

            {/* Common Tabs for Appropriate Roles */}
            {activeTab === "lab" && (
              <div className="space-y-6">
                <InteractiveLab
                  initialType={initialLabType}
                  userProfile={currentProfile}
                  onAwardXP={(amount, reason) => {
                    handleAwardRewards(amount, Math.floor(amount / 5), reason);
                  }}
                  onAwardRewards={(xp, coins, reason) => {
                    handleAwardRewards(xp, coins, reason);
                  }}
                />
              </div>
            )}

            {activeTab === "account" && (
              <AccountManager
                currentProfile={currentProfile}
                allAccounts={accounts}
                onSwitchAccount={handleSwitchAccount}
                onCreateAccount={handleCreateAccount}
                onUpdateCurrentProfile={handleUpdateProfile}
                onDeleteAccount={handleDeleteAccount}
                onBuyItem={handleBuyShopItem}
                onLogout={handleLogout}
                onOpenLoginModal={(role, mode) => {
                  if (role) setAuthModalInitialRole(role);
                  if (mode) setAuthModalInitialMode(mode);
                  setIsAuthModalOpen(true);
                }}
                onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      <button
        id="floating-ai-tutor-btn"
        onClick={() => {
          setAiTutorInitialTopic("");
          setIsAITutorOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-full bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer group"
        title="AI"
      >
        <Bot className="w-5 h-5 animate-bounce" />
        <span className="font-extrabold tracking-wider">AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:block" />
      </button>

      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialTopic={aiTutorInitialTopic}
        userProfile={currentProfile}
        onOpenSubscriptionModal={() => {
          setSubscriptionDefaultPlan("premium");
          setIsSubscriptionModalOpen(true);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        allAccounts={accounts}
        initialRole={authModalInitialRole}
        initialMode={authModalInitialMode}
      />

      {isCustomLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  AI Dars Konspekti Tuzuvchi
                </h3>
              </div>
              <button
                onClick={() => setIsCustomLessonModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Istalgan mavzuni yozing (masalan: <em>Termodinamika qonunlari</em>, <em>Logarifmlar</em>, <em>Kvant nuqtalari</em>). AI darhol oʻzbek tilidagi interaktiv dars, hayotiy misollar va test savollarini shakllantiradi!
            </p>

            <form onSubmit={handleCreateCustomLesson} className="space-y-4">
              <input
                type="text"
                value={customLessonTopic}
                onChange={(e) => setCustomLessonTopic(e.target.value)}
                placeholder="Mavzu nomi..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingCustomLesson || !customLessonTopic.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingCustomLesson ? "Tuzilmoqda..." : "Darsni Yaratish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TARIFF / SUBSCRIPTION PURCHASE MODAL */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        userProfile={currentProfile}
        initialPlan={subscriptionDefaultPlan}
        onSelectPlan={handleSelectSubscriptionPlan}
      />
    </div>
  );
}
