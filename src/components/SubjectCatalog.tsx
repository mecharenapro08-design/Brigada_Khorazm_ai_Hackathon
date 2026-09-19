import React, { useState } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Code2,
  Atom,
  Binary,
  Compass,
  Languages,
  Microscope,
  Diamond,
} from "lucide-react";
import { SubjectModule, LessonChapter, UserProfile } from "../types";

interface SubjectCatalogProps {
  modules: SubjectModule[];
  userProfile: UserProfile;
  onSelectChapter: (chapter: LessonChapter, module: SubjectModule) => void;
  onOpenLab: (simulationType?: string) => void;
  onOpenCustomLessonModal: () => void;
}

interface ScheduleEntry {
  id: string;
  order: number;
  time: string;
  moduleId: string;
  chapterId: string;
  subjectName: string;
  subjectColor: string;
  topicTitle: string;
  durationMinutes: number;
  xpReward: number;
  coinsReward: number;
  hasSimulation?: boolean;
}

const WEEKLY_SCHEDULE: Record<string, { label: string; short: string; lessons: ScheduleEntry[] }> = {
  dushanba: {
    label: "Dushanba",
    short: "Dush",
    lessons: [
      {
        id: "dush-1",
        order: 1,
        time: "08:30 - 09:15",
        moduleId: "math-foundations",
        chapterId: "pythagoras",
        subjectName: "Matematika",
        subjectColor: "bg-blue-900/60 text-blue-300 border-blue-700/60",
        topicTitle: "Pifagor teoremasi va 3D Triangulyatsiya",
        durationMinutes: 12,
        xpReward: 150,
        coinsReward: 30,
        hasSimulation: true,
      },
      {
        id: "dush-2",
        order: 2,
        time: "09:25 - 10:10",
        moduleId: "physics-universe",
        chapterId: "ohm-law",
        subjectName: "Fizika",
        subjectColor: "bg-purple-900/60 text-purple-300 border-purple-700/60",
        topicTitle: "Ohm qonuni va Elektr Zanjiri",
        durationMinutes: 14,
        xpReward: 160,
        coinsReward: 35,
        hasSimulation: true,
      },
      {
        id: "dush-3",
        order: 3,
        time: "10:20 - 11:05",
        moduleId: "bio-chem",
        chapterId: "dna-structure",
        subjectName: "Biologiya",
        subjectColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700/60",
        topicTitle: "DNK siri va Genetik Kod",
        durationMinutes: 15,
        xpReward: 140,
        coinsReward: 25,
        hasSimulation: true,
      },
      {
        id: "dush-4",
        order: 4,
        time: "11:15 - 12:00",
        moduleId: "informatics-ai",
        chapterId: "sorting-algorithms",
        subjectName: "Informatika",
        subjectColor: "bg-cyan-900/60 text-cyan-300 border-cyan-700/60",
        topicTitle: "Algoritmlar: Saralash va Logika",
        durationMinutes: 16,
        xpReward: 180,
        coinsReward: 40,
        hasSimulation: true,
      },
    ],
  },
  seshanba: {
    label: "Seshanba",
    short: "Sesh",
    lessons: [
      {
        id: "sesh-1",
        order: 1,
        time: "08:30 - 09:15",
        moduleId: "math-foundations",
        chapterId: "quadratic-functions",
        subjectName: "Matematika",
        subjectColor: "bg-blue-900/60 text-blue-300 border-blue-700/60",
        topicTitle: "Kvadrat tenglama va Snayper trayektoriyasi",
        durationMinutes: 15,
        xpReward: 170,
        coinsReward: 35,
        hasSimulation: true,
      },
      {
        id: "sesh-2",
        order: 2,
        time: "09:25 - 10:10",
        moduleId: "history-culture",
        chapterId: "temurid-renaissance",
        subjectName: "Tarix",
        subjectColor: "bg-amber-900/60 text-amber-300 border-amber-700/60",
        topicTitle: "Temuriylar Renessansi va Ulugʻbek rasadxonasi",
        durationMinutes: 10,
        xpReward: 130,
        coinsReward: 25,
      },
      {
        id: "sesh-3",
        order: 3,
        time: "10:20 - 11:05",
        moduleId: "smart-languages",
        chapterId: "ai-conversation",
        subjectName: "Ingliz Tili",
        subjectColor: "bg-rose-900/60 text-rose-300 border-rose-700/60",
        topicTitle: "Ingliz tili: AI bilan jonli muloqot",
        durationMinutes: 12,
        xpReward: 120,
        coinsReward: 20,
      },
    ],
  },
  chorshanba: {
    label: "Chorshanba",
    short: "Chor",
    lessons: [
      {
        id: "chor-1",
        order: 1,
        time: "08:30 - 09:15",
        moduleId: "physics-universe",
        chapterId: "ohm-law",
        subjectName: "Fizika",
        subjectColor: "bg-purple-900/60 text-purple-300 border-purple-700/60",
        topicTitle: "Ohm qonuni va Elektr Zanjiri",
        durationMinutes: 14,
        xpReward: 160,
        coinsReward: 35,
        hasSimulation: true,
      },
      {
        id: "chor-2",
        order: 2,
        time: "09:25 - 10:10",
        moduleId: "informatics-ai",
        chapterId: "sorting-algorithms",
        subjectName: "Informatika",
        subjectColor: "bg-cyan-900/60 text-cyan-300 border-cyan-700/60",
        topicTitle: "Algoritmlar jangi: Bubble Sort vs Quick Sort",
        durationMinutes: 16,
        xpReward: 180,
        coinsReward: 40,
        hasSimulation: true,
      },
      {
        id: "chor-3",
        order: 3,
        time: "10:20 - 11:05",
        moduleId: "math-foundations",
        chapterId: "pythagoras",
        subjectName: "Matematika",
        subjectColor: "bg-blue-900/60 text-blue-300 border-blue-700/60",
        topicTitle: "Pifagor teoremasi va 3D Triangulyatsiya",
        durationMinutes: 12,
        xpReward: 150,
        coinsReward: 30,
        hasSimulation: true,
      },
    ],
  },
  payshanba: {
    label: "Payshanba",
    short: "Pay",
    lessons: [
      {
        id: "pay-1",
        order: 1,
        time: "08:30 - 09:15",
        moduleId: "math-foundations",
        chapterId: "quadratic-functions",
        subjectName: "Matematika",
        subjectColor: "bg-blue-900/60 text-blue-300 border-blue-700/60",
        topicTitle: "Kvadrat tenglama va Snayper trayektoriyasi",
        durationMinutes: 15,
        xpReward: 170,
        coinsReward: 35,
        hasSimulation: true,
      },
      {
        id: "pay-2",
        order: 2,
        time: "09:25 - 10:10",
        moduleId: "bio-chem",
        chapterId: "dna-structure",
        subjectName: "Biologiya",
        subjectColor: "bg-emerald-900/60 text-emerald-300 border-emerald-700/60",
        topicTitle: "DNK siri va Genetik Kod",
        durationMinutes: 15,
        xpReward: 140,
        coinsReward: 25,
        hasSimulation: true,
      },
      {
        id: "pay-3",
        order: 3,
        time: "10:20 - 11:05",
        moduleId: "history-culture",
        chapterId: "temurid-renaissance",
        subjectName: "Tarix",
        subjectColor: "bg-amber-900/60 text-amber-300 border-amber-700/60",
        topicTitle: "Temuriylar Renessansi va Ulugʻbek rasadxonasi",
        durationMinutes: 10,
        xpReward: 130,
        coinsReward: 25,
      },
    ],
  },
  juma: {
    label: "Juma",
    short: "Juma",
    lessons: [
      {
        id: "jum-1",
        order: 1,
        time: "08:30 - 09:15",
        moduleId: "informatics-ai",
        chapterId: "sorting-algorithms",
        subjectName: "Informatika",
        subjectColor: "bg-cyan-900/60 text-cyan-300 border-cyan-700/60",
        topicTitle: "Algoritmlar jangi: Bubble Sort vs Quick Sort",
        durationMinutes: 16,
        xpReward: 180,
        coinsReward: 40,
        hasSimulation: true,
      },
      {
        id: "jum-2",
        order: 2,
        time: "09:25 - 10:10",
        moduleId: "physics-universe",
        chapterId: "ohm-law",
        subjectName: "Fizika",
        subjectColor: "bg-purple-900/60 text-purple-300 border-purple-700/60",
        topicTitle: "Ohm qonuni va Elektr Zanjiri Laboratoriyasi",
        durationMinutes: 14,
        xpReward: 160,
        coinsReward: 35,
        hasSimulation: true,
      },
      {
        id: "jum-3",
        order: 3,
        time: "10:20 - 11:05",
        moduleId: "smart-languages",
        chapterId: "ai-conversation",
        subjectName: "Ingliz Tili",
        subjectColor: "bg-rose-900/60 text-rose-300 border-rose-700/60",
        topicTitle: "Ingliz tili: AI bilan muloqot",
        durationMinutes: 12,
        xpReward: 120,
        coinsReward: 20,
      },
    ],
  },
  shanba: {
    label: "Shanba",
    short: "Shan",
    lessons: [
      {
        id: "shan-1",
        order: 1,
        time: "09:00 - 09:45",
        moduleId: "math-foundations",
        chapterId: "pythagoras",
        subjectName: "Matematika",
        subjectColor: "bg-blue-900/60 text-blue-300 border-blue-700/60",
        topicTitle: "Haftalik mustahkamlash: Pifagor geometriyasi",
        durationMinutes: 12,
        xpReward: 150,
        coinsReward: 30,
        hasSimulation: true,
      },
      {
        id: "shan-2",
        order: 2,
        time: "10:00 - 10:45",
        moduleId: "physics-universe",
        chapterId: "ohm-law",
        subjectName: "Laboratoriya",
        subjectColor: "bg-indigo-900/60 text-indigo-300 border-indigo-700/60",
        topicTitle: "Amaliy Virtual Tajribalar",
        durationMinutes: 15,
        xpReward: 160,
        coinsReward: 35,
        hasSimulation: true,
      },
    ],
  },
};

export const SubjectCatalog: React.FC<SubjectCatalogProps> = ({
  modules,
  userProfile,
  onSelectChapter,
}) => {
  const [viewMode, setViewMode] = useState<"schedule" | "subjects">("subjects");
  const [selectedDay, setSelectedDay] = useState<string>("dushanba");
  const [selectedGrade, setSelectedGrade] = useState<string>("Barchasi");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [weekOffset, setWeekOffset] = useState<number>(0);

  const getWeekData = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday + offset * 7);

    const monthNamesUz = [
      "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
      "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const monthShortUz = [
      "yan", "fev", "mar", "apr", "may", "iyn",
      "iyl", "avg", "sen", "okt", "noy", "dek"
    ];

    const daysKeys = ["dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
    const dayLabelsUz = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

    const weekDays = daysKeys.map((key, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      return {
        key,
        name: dayLabelsUz[index],
        dayNum: d.getDate(),
        monthShort: monthShortUz[d.getMonth()],
        monthFull: monthNamesUz[d.getMonth()],
        year: d.getFullYear(),
        dateStr: `${d.getDate()}-${monthShortUz[d.getMonth()]}`,
        fullDateStr: `${d.getDate()}-${monthNamesUz[d.getMonth()]}, ${d.getFullYear()}`,
        isToday,
      };
    });

    const startDay = weekDays[0];
    const endDay = weekDays[weekDays.length - 1];
    const rangeStr =
      startDay.monthFull === endDay.monthFull
        ? `${startDay.dayNum} — ${endDay.dayNum} ${startDay.monthFull}, ${startDay.year}`
        : `${startDay.dayNum} ${startDay.monthShort} — ${endDay.dayNum} ${endDay.monthShort}, ${endDay.year}`;

    const firstDayOfYear = new Date(monday.getFullYear(), 0, 1);
    const pastDaysOfYear = (monday.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);

    return {
      monday,
      weekDays,
      rangeStr,
      isCurrentWeek: offset === 0,
      weekNumber,
    };
  };

  const weekData = getWeekData(weekOffset);
  const selectedDayData =
    weekData.weekDays.find((d) => d.key === selectedDay) || weekData.weekDays[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Atom":
        return <Atom className="w-5 h-5" />;
      case "Binary":
        return <Binary className="w-5 h-5" />;
      case "Compass":
        return <Compass className="w-5 h-5" />;
      case "Languages":
        return <Languages className="w-5 h-5" />;
      case "Microscope":
        return <Microscope className="w-5 h-5" />;
      case "Code2":
        return <Code2 className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const currentDaySchedule = WEEKLY_SCHEDULE[selectedDay] || WEEKLY_SCHEDULE.dushanba;

  const filteredModules = modules.filter((m) => {
    const matchesGrade =
      selectedGrade === "Barchasi" ||
      m.gradeLevel.toLowerCase().includes(selectedGrade.toLowerCase().replace(" sinf", ""));
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapters.some((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  const handleStartScheduleLesson = (entry: ScheduleEntry) => {
    const targetModule = modules.find((m) => m.id === entry.moduleId);
    if (!targetModule) return;
    const targetChapter = targetModule.chapters.find((c) => c.id === entry.chapterId);
    if (targetChapter) {
      onSelectChapter(targetChapter, targetModule);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
              Oʻquv Dasturi
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sinf: <span className="text-slate-900 dark:text-white font-bold">{userProfile.grade}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">
            Dars Jadvali & Mashgʻulotlar
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            Haftalik darslar jadvalini koʻring, sanalar boʻyicha oʻting yoki fanlar katalogidan istalgan mavzuni erkin tanlang.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 w-full sm:w-auto">
          <button
            id="view-mode-schedule-btn"
            onClick={() => setViewMode("schedule")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === "schedule"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-300" />
            <span>Dars Jadvali</span>
          </button>
          <button
            id="view-mode-subjects-btn"
            onClick={() => setViewMode("subjects")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              viewMode === "subjects"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-300" />
            <span>Barcha Fanlar</span>
          </button>
        </div>
      </div>

      {viewMode === "schedule" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs dark:shadow-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-2xs">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {weekData.isCurrentWeek
                      ? "Joriy Hafta"
                      : weekOffset > 0
                      ? `+${weekOffset} hafta keyin`
                      : `${Math.abs(weekOffset)} hafta oldin`}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-medium">
                    {weekData.weekNumber}-hafta
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                  Sana: {weekData.rangeStr}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-center justify-between sm:justify-end">
              <button
                id="prev-week-btn"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                title="Oldingi haftaga oʻtish"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Oldingi hafta</span>
              </button>

              {!weekData.isCurrentWeek && (
                <button
                  id="reset-week-btn"
                  onClick={() => setWeekOffset(0)}
                  title="Joriy haftaga qaytish"
                  className="px-2.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Joriy hafta
                </button>
              )}

              <button
                id="next-week-btn"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                title="Keyingi haftaga oʻtish"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer active:scale-95"
              >
                <span>Keyingi hafta</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {weekData.weekDays.map((dayItem) => {
              const isSelected = selectedDay === dayItem.key;
              const daySchedule = WEEKLY_SCHEDULE[dayItem.key] || WEEKLY_SCHEDULE.dushanba;
              return (
                <button
                  key={dayItem.key}
                  id={`day-tab-${dayItem.key}`}
                  onClick={() => setSelectedDay(dayItem.key)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500 ring-2 ring-indigo-400/40"
                      : "bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="text-xs uppercase tracking-wider font-extrabold opacity-95">
                      {dayItem.name}
                    </span>
                    {dayItem.isToday && (
                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-tight shrink-0 animate-pulse">
                        Bugun
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between w-full pt-0.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? "text-indigo-100" : "text-indigo-600 dark:text-cyan-400"
                      }`}
                    >
                      {dayItem.dateStr}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                        isSelected
                          ? "bg-indigo-800/90 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {daySchedule.lessons.length} ta dars
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-xs dark:shadow-xl transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                  {selectedDayData.name}, {selectedDayData.fullDateStr} kungi darslar
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {selectedDayData.isToday && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Bugungi dars jadvali
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Jami: <strong className="text-slate-800 dark:text-slate-200">{currentDaySchedule.lessons.length} ta dars</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {currentDaySchedule.lessons.map((lesson) => {
                const isCompleted = userProfile.completedChapterIds.includes(lesson.chapterId);

                return (
                  <div
                    key={lesson.id}
                    id={`schedule-lesson-${lesson.id}`}
                    onClick={() => handleStartScheduleLesson(lesson)}
                    className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCompleted
                        ? "bg-emerald-50/50 dark:bg-slate-900/90 border-emerald-200 dark:border-emerald-800/50 hover:border-emerald-400 dark:hover:border-emerald-500/80 shadow-xs"
                        : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:bg-slate-50/60 dark:hover:bg-slate-800 shadow-xs hover:shadow-md transition-shadow"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-display font-black text-indigo-600 dark:text-indigo-400 text-base shrink-0 group-hover:border-indigo-400 transition-colors">
                        {lesson.order}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${lesson.subjectColor}`}
                          >
                            {lesson.subjectName}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {lesson.time}
                          </span>
                          {lesson.hasSimulation && (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/80 text-[10px] font-bold">
                              Laboratoriya mavjud
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                          {lesson.topicTitle}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>{lesson.durationMinutes} daqiqa</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />+{lesson.xpReward} XP
                          </span>
                          <span>•</span>
                          <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                            <Diamond className="w-3.5 h-3.5 fill-cyan-500 dark:fill-cyan-400" />+{lesson.coinsReward} 💎
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-end pt-2 sm:pt-0">
                      {isCompleted ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                            <span>Oʻzlashtirildi</span>
                          </span>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold cursor-pointer"
                          >
                            Qayta koʻrish
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform cursor-pointer"
                        >
                          <span>Darsni boshlash</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === "subjects" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {["Barchasi", "5-9 sinf", "10-11 sinf", "Universitet / IT"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setSelectedGrade(grade)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    selectedGrade === grade
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Fan yoki mavzuni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((module) => {
              const completedInModule = module.chapters.filter((c) =>
                userProfile.completedChapterIds.includes(c.id)
              ).length;
              const isFullyCompleted = completedInModule === module.chapters.length;

              return (
                <div
                  key={module.id}
                  className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 shadow-xs dark:shadow-xl overflow-hidden flex flex-col justify-between transition-colors"
                >
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-linear-to-br ${module.accentColor} text-white flex items-center justify-center shadow-md`}
                        >
                          {getIcon(module.iconName)}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {module.gradeLevel}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                            {module.title}
                          </h3>
                        </div>
                      </div>
                      {isFullyCompleted && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{module.description}</p>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Oʻzlashtirish</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {completedInModule} / {module.chapters.length} dars
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                          style={{
                            width: `${(completedInModule / module.chapters.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950/40 space-y-2 flex-1">
                    {module.chapters.map((chapter) => {
                      const isCompleted = userProfile.completedChapterIds.includes(chapter.id);
                      return (
                        <div
                          key={chapter.id}
                          onClick={() => onSelectChapter(chapter, module)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isCompleted
                              ? "bg-emerald-50/70 dark:bg-slate-900/90 border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-400"
                              : "bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/80 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-2xs"
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
                            )}
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {chapter.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold shrink-0">
                            +{chapter.xpReward} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {module.chapters.length} ta dars
                    </span>
                    <button
                      onClick={() => onSelectChapter(module.chapters[0], module)}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Boshlash</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
