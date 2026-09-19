import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  FlaskConical,
  BookOpen,
  HelpCircle,
  FileText,
  Filter,
  BarChart2,
  Printer,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Lock,
  CalendarDays,
  ListOrdered,
  RotateCcw,
} from "lucide-react";
import { ScheduleLesson, UserProfile } from "../types";
import {
  PERIOD_TIMES,
  INITIAL_ANNUAL_SCHEDULE,
  SCHOOL_QUARTERS,
  MONTH_NAMES_UZ,
} from "../data/scheduleData";
import confetti from "canvas-confetti";

interface VisualScheduleViewProps {
  userProfile?: UserProfile;
  isTeacherView?: boolean;
  onOpenLabWithTopic?: (labType: "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d") => void;
}

export const VisualScheduleView: React.FC<VisualScheduleViewProps> = ({
  userProfile,
  isTeacherView = true,
  onOpenLabWithTopic,
}) => {
  // Load schedule from localStorage or initial annual schedule
  const [schedule, setSchedule] = useState<ScheduleLesson[]>(() => {
    const saved = localStorage.getItem("aimaktab_annual_schedule_v6");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 50 && parsed[0].date) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved annual schedule", e);
      }
    }
    return INITIAL_ANNUAL_SCHEDULE;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("aimaktab_annual_schedule_v6", JSON.stringify(schedule));
  }, [schedule]);

  // View modes:
  // "timeline" = Tanlangan sana boʻyicha kunlik xronologik darslar
  // "annualList" = 1 yillik choraklar va sanalar boʻyicha toʻliq taqvim roʻyxati
  // "labOnly" = Faqat 1 yillik 3D laboratoriyalar
  // "analytics" = Yillik yuklama va fanlar tahlili
  const [viewMode, setViewMode] = useState<"timeline" | "annualList" | "labOnly" | "analytics">("timeline");

  // Tanlangan sana (Default: 2026-09-19 - bugun)
  const [selectedDate, setSelectedDate] = useState<string>("2026-09-19");
  const [selectedQuarter, setSelectedQuarter] = useState<number | "all">("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [activeLiveLessonId, setActiveLiveLessonId] = useState<string>("sch-annual-07");

  // Modal for Add / Edit Lesson
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Form states (Date-based, not day of week)
  const [formDate, setFormDate] = useState<string>("2026-09-19");
  const [formPeriod, setFormPeriod] = useState<number>(1);
  const [formSubject, setFormSubject] = useState<string>("Fizika");
  const [formClass, setFormClass] = useState<string>("10-A");
  const [formRoom, setFormRoom] = useState<string>("304-Fizika Lab");
  const [formTopic, setFormTopic] = useState<string>("");
  const [formLessonType, setFormLessonType] = useState<ScheduleLesson["lessonType"]>("theory");
  const [formLabType, setFormLabType] = useState<ScheduleLesson["labSimulationType"]>("pythagoras");

  const isStudent = userProfile?.role === "student";
  const canEdit = true;

  // Determine student's assigned class strictly
  const getStudentClass = (): string => {
    const g = (userProfile?.grade || "").toUpperCase();
    if (g.includes("10-A") || g.includes("10A")) return "10-A";
    if (g.includes("10-B") || g.includes("10B")) return "10-B";
    if (g.includes("9-V") || g.includes("9V")) return "9-V";
    if (g.includes("11-A") || g.includes("11A")) return "11-A";
    return "10-A";
  };
  const studentAssignedClass = isStudent ? getStudentClass() : null;

  // Classes and subjects
  const classesList = Array.from(new Set(schedule.map((s) => s.className)));
  const subjectsList = Array.from(new Set(schedule.map((s) => s.subject)));

  // Barcha mavjud sanalar ro'yxati (tartiblangan)
  const allUniqueDates = Array.from(new Set(schedule.map((s) => s.date))).sort();

  // Yordamchi: Sanani o'zbekcha formatlash ("2026-09-19" -> "19-Sentabr, 2026")
  const formatDateToUzbek = (dateStr: string): string => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parts[1];
    const day = parseInt(parts[2], 10);
    const monthName = MONTH_NAMES_UZ[month] || month;
    return `${day}-${monthName}, ${year}`;
  };

  // Yordamchi: Sanadan chorakni aniqlash
  const getQuarterFromDate = (dateStr: string): 1 | 2 | 3 | 4 => {
    const month = dateStr.split("-")[1];
    if (month === "09" || month === "10" || (month === "11" && parseInt(dateStr.split("-")[2], 10) <= 10)) {
      return 1;
    }
    if (month === "11" || month === "12") {
      return 2;
    }
    if (month === "01" || month === "02" || (month === "03" && parseInt(dateStr.split("-")[2], 10) <= 20)) {
      return 3;
    }
    return 4;
  };

  // Filtered schedule: for students, ONLY show their assigned class!
  const filteredSchedule = schedule.filter((item) => {
    if (isStudent && studentAssignedClass) {
      if (item.className !== studentAssignedClass) return false;
    } else if (filterClass !== "all" && item.className !== filterClass) {
      return false;
    }
    if (filterSubject !== "all" && item.subject !== filterSubject) return false;
    if (selectedQuarter !== "all" && item.quarter !== selectedQuarter) return false;
    if (viewMode === "labOnly" && item.lessonType !== "lab") return false;
    return true;
  });

  // Tanlangan sana darslari
  const selectedDateLessons = filteredSchedule
    .filter((s) => s.date === selectedDate)
    .sort((a, b) => a.periodIndex - b.periodIndex);

  // Open modal for new lesson (teacher only)
  const handleOpenAddModal = (defaultDate?: string, defaultPeriod?: number) => {
    if (!canEdit) return;
    setEditingLessonId(null);
    setFormDate(defaultDate || selectedDate);
    setFormPeriod(defaultPeriod || 1);
    setFormSubject("Fizika");
    setFormClass("10-A");
    setFormRoom("304-Fizika Lab");
    setFormTopic("");
    setFormLessonType("theory");
    setFormLabType("pythagoras");
    setIsModalOpen(true);
  };

  // Open modal for editing (teacher only)
  const handleOpenEditModal = (lesson: ScheduleLesson) => {
    if (!canEdit) return;
    setEditingLessonId(lesson.id);
    setFormDate(lesson.date);
    setFormPeriod(lesson.periodIndex);
    setFormSubject(lesson.subject);
    setFormClass(lesson.className);
    setFormRoom(lesson.room);
    setFormTopic(lesson.topic);
    setFormLessonType(lesson.lessonType);
    setFormLabType(lesson.labSimulationType || "pythagoras");
    setIsModalOpen(true);
  };

  // Save lesson (Add or Update)
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTopic.trim()) {
      alert("Iltimos, dars mavzusini kiriting!");
      return;
    }

    const periodConfig = PERIOD_TIMES.find((p) => p.periodIndex === formPeriod) || PERIOD_TIMES[0];
    const formatted = formatDateToUzbek(formDate);
    const quarter = getQuarterFromDate(formDate);

    if (editingLessonId) {
      // Update
      setSchedule((prev) =>
        prev.map((item) =>
          item.id === editingLessonId
            ? {
                ...item,
                date: formDate,
                formattedDate: formatted,
                quarter,
                periodIndex: formPeriod,
                startTime: periodConfig.startTime,
                endTime: periodConfig.endTime,
                subject: formSubject,
                className: formClass,
                room: formRoom,
                topic: formTopic.trim(),
                lessonType: formLessonType,
                labSimulationType: formLessonType === "lab" ? formLabType : undefined,
              }
            : item
        )
      );
    } else {
      // Add
      const newLesson: ScheduleLesson = {
        id: `sch-annual-${Date.now()}`,
        date: formDate,
        formattedDate: formatted,
        quarter,
        periodIndex: formPeriod,
        startTime: periodConfig.startTime,
        endTime: periodConfig.endTime,
        subject: formSubject,
        className: formClass,
        room: formRoom,
        topic: formTopic.trim(),
        lessonType: formLessonType,
        teacherName: userProfile?.name || "Rustam Karimov",
        labSimulationType: formLessonType === "lab" ? formLabType : undefined,
        isCompleted: false,
      };
      setSchedule((prev) => [...prev, newLesson]);
      confetti({ particleCount: 40, spread: 60 });
    }

    // Modalni yopish va tanlangan sanani yangilash
    setSelectedDate(formDate);
    setIsModalOpen(false);
  };

  // Delete lesson
  const handleDeleteLesson = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm("Ushbu darsni yillik jadvaldan oʻchirishni tasdiqlaysizmi?")) {
      setSchedule((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Toggle completed status
  const handleToggleComplete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  // Jadvalni asl yillik holatiga qaytarish
  const handleResetToDefault = () => {
    if (confirm("1 yillik namunaviy dars jadvalini qayta tiklashni xohlaysizmi?")) {
      setSchedule(INITIAL_ANNUAL_SCHEDULE);
      localStorage.removeItem("aimaktab_annual_schedule_v2");
      confetti({ particleCount: 50 });
    }
  };

  // Subject color helper
  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "fizika":
      case "fizika lab":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-950/70",
          border: "border-indigo-200 dark:border-indigo-800",
          text: "text-indigo-700 dark:text-indigo-300",
          badge: "bg-indigo-600 text-white",
        };
      case "geometriya":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/70",
          border: "border-emerald-200 dark:border-emerald-800",
          text: "text-emerald-700 dark:text-emerald-300",
          badge: "bg-emerald-600 text-white",
        };
      case "algebra":
        return {
          bg: "bg-cyan-50 dark:bg-cyan-950/70",
          border: "border-cyan-200 dark:border-cyan-800",
          text: "text-cyan-700 dark:text-cyan-300",
          badge: "bg-cyan-600 text-white",
        };
      case "kvant fizikasi":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/70",
          border: "border-purple-200 dark:border-purple-800",
          text: "text-purple-700 dark:text-purple-300",
          badge: "bg-purple-600 text-white",
        };
      case "astronomiya":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/70",
          border: "border-amber-200 dark:border-amber-800",
          text: "text-amber-700 dark:text-amber-300",
          badge: "bg-amber-600 text-white",
        };
      default:
        return {
          bg: "bg-slate-50 dark:bg-slate-900/80",
          border: "border-slate-200 dark:border-slate-800",
          text: "text-slate-700 dark:text-slate-300",
          badge: "bg-slate-700 text-white",
        };
    }
  };

  // Lesson type badge helper
  const getLessonTypeBadge = (type: ScheduleLesson["lessonType"]) => {
    switch (type) {
      case "lab":
        return {
          label: "3D Laboratoriya",
          icon: FlaskConical,
          color: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
        };
      case "quiz":
        return {
          label: "Amaliy Test",
          icon: HelpCircle,
          color: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
        };
      case "exam":
        return {
          label: "Nazorat Imtihoni",
          icon: FileText,
          color: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
        };
      default:
        return {
          label: "Nazariy Dars",
          icon: BookOpen,
          color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
        };
    }
  };

  // Statistics calculation
  const totalLessons = filteredSchedule.length;
  const labLessonsCount = filteredSchedule.filter((s) => s.lessonType === "lab").length;
  const completedLessonsCount = filteredSchedule.filter((s) => s.isCompleted).length;
  const totalAcademicHours = totalLessons;

  // Subject breakdown
  const subjectCounts: Record<string, number> = {};
  filteredSchedule.forEach((s) => {
    subjectCounts[s.subject] = (subjectCounts[s.subject] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS & HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              {isStudent ? (
                <>
                  <Lock className="w-4 h-4 text-indigo-500" />
                  <span>Oʻquvchi Shaxsiy Yillik Dars Jadvali ({studentAssignedClass} sinf)</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>2026–2027 Oʻquv Yili Boshqaruv Dars Jadvali (Sana Asosida)</span>
                </>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 font-display flex items-center gap-2">
              <span>1 Yillik Dars Jadvali & Taqvim Xaritasi</span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                2026–2027
              </span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hafta kunlari emas, aniq sanalar va choraklar boʻyicha barcha nazariy, 3D laboratoriya va nazorat darslari taqvimi.
            </p>
          </div>

          {/* Quick Stats Pill and Teacher Add Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold">1 Yillik Darslar</span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                {totalLessons} ta dars
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold">3D Laboratoriya</span>
              <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                {labLessonsCount} ta dars
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-bold">Oʻtilgan</span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {completedLessonsCount} / {totalLessons}
              </span>
            </div>

            {canEdit && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAddModal()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yangi Dars Qoʻshish</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
                  title="1 yillik standart namunani qayta yuklash"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Switcher and Filters Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Sana Boʻyicha Darslar</span>
            </button>

            <button
              onClick={() => setViewMode("annualList")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === "annualList"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>1 Yillik Yaxlit Jadval</span>
            </button>

            <button
              onClick={() => setViewMode("labOnly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === "labOnly"
                  ? "bg-rose-500 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Yillik 3D Laboratoriyalar</span>
            </button>

            <button
              onClick={() => setViewMode("analytics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                viewMode === "analytics"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Yillik Yuklama Tahlili</span>
            </button>
          </div>

          {/* Filters (Quarter, Class, Subject) + Print */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quarter filter */}
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Barcha Choraklar (1-4)</option>
              {SCHOOL_QUARTERS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.period})
                </option>
              ))}
            </select>

            {isStudent ? (
              <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sinf: {studentAssignedClass} (🔒 Qulflangan)</span>
              </div>
            ) : (
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">Barcha sinflar</option>
                {classesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Barcha fanlar</option>
              {subjectsList.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              title="Jadvalni chop etish yoki PDF saqlash"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CHORAKLAR TEZKOR KARTALARI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          {SCHOOL_QUARTERS.map((q) => {
            const isSelected = selectedQuarter === q.id;
            const qLessons = schedule.filter((s) => s.quarter === q.id);
            return (
              <div
                key={q.id}
                onClick={() => setSelectedQuarter(isSelected ? "all" : q.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-black">
                  <span>{q.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {qLessons.length} dars
                  </span>
                </div>
                <div
                  className={`text-[10px] truncate mt-1 ${
                    isSelected ? "text-indigo-100" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {q.period}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: SANA BO'YICHA KUNLIK XRONOLOGIYA */}
      {viewMode === "timeline" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
          {/* SANA TANLASH TUGMALARI VA KALENDAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Sanani Tanlang:</span>
              </span>

              {/* Bugun tezkor tugmasi */}
              <button
                onClick={() => setSelectedDate("2026-09-19")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  selectedDate === "2026-09-19"
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bugun: 19-Sentabr, 2026</span>
              </button>

              {/* Kalendar sana tanlagich */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-xs font-mono font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Tanlangan sana: <strong className="text-indigo-600 dark:text-indigo-400">{formatDateToUzbek(selectedDate)}</strong> ({selectedDateLessons.length} ta dars)
            </div>
          </div>

          {/* O'quv yili sanalari gorizontal lentasi */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {allUniqueDates.map((dateStr) => {
              const isSelected = selectedDate === dateStr;
              const dLessons = schedule.filter((s) => s.date === dateStr);
              const formatted = formatDateToUzbek(dateStr);
              const hasLab = dLessons.some((l) => l.lessonType === "lab");

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 shrink-0 border cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 scale-105"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                  }`}
                >
                  <span className="font-mono text-[11px] whitespace-nowrap">{formatted}</span>
                  <div className="flex items-center gap-1 text-[9px] opacity-80">
                    <span>{dLessons.length} dars</span>
                    {hasLab && <span className="text-rose-400 font-bold">● 3D Lab</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tanlangan sanadagi darslar xronologiyasi */}
          <div className="space-y-4">
            {selectedDateLessons.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {formatDateToUzbek(selectedDate)} sanasiga hozircha dars rejalashtirilmagan
                </p>
                {canEdit && (
                  <button
                    onClick={() => handleOpenAddModal(selectedDate)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ushbu sanaga dars qoʻshish</span>
                  </button>
                )}
              </div>
            ) : (
              selectedDateLessons.map((lesson) => {
                const colors = getSubjectColor(lesson.subject);
                const typeBadge = getLessonTypeBadge(lesson.lessonType);
                const isLive = activeLiveLessonId === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm hover:shadow-md ${
                      colors.bg
                    } ${colors.border} ${isLive ? "ring-2 ring-emerald-500" : ""}`}
                  >
                    {/* Time and Index */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                          {lesson.periodIndex}-dars
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          {lesson.startTime}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${colors.badge}`}>
                            {lesson.subject}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                            Sinf: {lesson.className}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-400">
                            Xona: {lesson.room}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${typeBadge.color}`}>
                            {typeBadge.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold">
                            {lesson.quarter}-Chorak
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                          {lesson.topic}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Sana: {lesson.formattedDate || formatDateToUzbek(lesson.date)} • Oʻqituvchi: {lesson.teacherName} • Davomiyligi: 45 daqiqa
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {lesson.lessonType === "lab" && (
                        <button
                          onClick={() => {
                            if (onOpenLabWithTopic && lesson.labSimulationType) {
                              onOpenLabWithTopic(lesson.labSimulationType);
                            }
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <FlaskConical className="w-4 h-4" />
                          <span>3D Tajribani Boshlash</span>
                        </button>
                      )}

                      {canEdit && (
                        <>
                          <button
                            onClick={() => setActiveLiveLessonId(isLive ? "" : lesson.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                              isLive
                                ? "bg-emerald-500 text-white border-emerald-600"
                                : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                            }`}
                          >
                            {isLive ? "Dars Ketmoqda" : "Hozirgi dars"}
                          </button>

                          <button
                            onClick={() => handleToggleComplete(lesson.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              lesson.isCompleted
                                ? "bg-emerald-600 text-white border-emerald-700"
                                : "bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500"
                            }`}
                            title={lesson.isCompleted ? "Oʻtilgan dars" : "Oʻtildi deb belgilash"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(lesson)}
                            className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: 1 YILLIK YAXLIT JADVAL (CHORAKLAR VA SANALAR BO'YICHA) */}
      {viewMode === "annualList" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-indigo-500" />
                <span>1 Yillik Toʻliq Oʻquv Dasturi Jadvali (2026–2027)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Barcha choraklar va sanalar boʻyicha ketma-ketlikda tuzilgan toʻliq oʻquv rejasi
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
              Jami: {filteredSchedule.length} ta dars
            </span>
          </div>

          <div className="space-y-3">
            {filteredSchedule
              .sort((a, b) => a.date.localeCompare(b.date) || a.periodIndex - b.periodIndex)
              .map((lesson) => {
                const colors = getSubjectColor(lesson.subject);
                const typeBadge = getLessonTypeBadge(lesson.lessonType);

                return (
                  <div
                    key={lesson.id}
                    className={`p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      colors.bg
                    } ${colors.border} hover:shadow-sm`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Date Badge */}
                      <div className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center shrink-0 min-w-[100px]">
                        <span className="block text-[11px] font-black text-slate-900 dark:text-white font-mono">
                          {lesson.formattedDate || formatDateToUzbek(lesson.date)}
                        </span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                          {lesson.periodIndex}-dars ({lesson.startTime})
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.2 rounded text-[11px] font-bold ${colors.badge}`}>
                            {lesson.subject}
                          </span>
                          <span className="px-2 py-0.2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                            {lesson.className}
                          </span>
                          <span className="px-2 py-0.2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500">
                            {lesson.room}
                          </span>
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${typeBadge.color}`}>
                            {typeBadge.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {lesson.quarter}-Chorak
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lesson.topic}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {lesson.lessonType === "lab" && (
                        <button
                          onClick={() => {
                            if (onOpenLabWithTopic && lesson.labSimulationType) {
                              onOpenLabWithTopic(lesson.labSimulationType);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>3D Lab</span>
                        </button>
                      )}

                      {canEdit && (
                        <button
                          onClick={() => handleOpenEditModal(lesson)}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-all cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* VIEW 3: FAQAT 1 YILLIK 3D LABORATORIYALAR */}
      {viewMode === "labOnly" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <FlaskConical className="w-4 h-4" />
                <span>1 Yillik 3D Virtual Laboratoriyalar Rejasi</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                Barcha Rejalashtirilgan 3D Eksperimental Mashgʻulotlar
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900">
              {filteredSchedule.filter((s) => s.lessonType === "lab").length} ta laboratoriya
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchedule
              .filter((s) => s.lessonType === "lab")
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-linear-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-900 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                        {lesson.formattedDate || formatDateToUzbek(lesson.date)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold">
                        {lesson.periodIndex}-dars • {lesson.startTime}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 dark:text-white text-base leading-snug">
                      {lesson.topic}
                    </h4>

                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 dark:text-slate-400">
                      <span>Sinf: <strong>{lesson.className}</strong></span>
                      <span>•</span>
                      <span>Fan: <strong>{lesson.subject}</strong></span>
                      <span>•</span>
                      <span>Xona: <strong>{lesson.room}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {lesson.quarter}-Chorak Rejasi
                    </span>

                    <button
                      onClick={() => {
                        if (onOpenLabWithTopic && lesson.labSimulationType) {
                          onOpenLabWithTopic(lesson.labSimulationType);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <FlaskConical className="w-4 h-4" />
                      <span>3D Simulyatsiyani Ochish</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW 4: YILLIK YUKLAMA VA FANLAR TAHLILI */}
      {viewMode === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-500" />
              <span>Yillik Oʻquv Rejasi Yuklamasi</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Jami Yillik Darslar:</span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-base">
                  {totalAcademicHours} ta mashgʻulot
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">3D Laboratoriya Salmogʻi:</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-base">
                  {Math.round((labLessonsCount / (totalLessons || 1)) * 100)}% ({labLessonsCount} ta dars)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">Oʻzlashtirilgan darslar:</span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                  {completedLessonsCount} ta ({Math.round((completedLessonsCount / (totalLessons || 1)) * 100)}%)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300">
              💡 <strong>Tavsiya:</strong> 1 yillik dars jadvali toʻliq sanalarga bogʻlangan boʻlib, davlat taʼlim standartlari (DTS) boʻyicha oʻquv yili yuklamasini optimal taqsimlaydi.
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              <span>Fanlar Kesimidagi Yillik Taqsimot</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(subjectCounts).map(([subj, count]) => {
                const percent = Math.round((count / (totalLessons || 1)) * 100);
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{subj}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono">
                        {count} dars ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT LESSON MODAL (SANA BILAN) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>{editingLessonId ? "Darsni Tahrirlash" : "Yillik Jadvalga Yangi Dars Qoʻshish"}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-3.5 text-xs">
              {/* SANA VA DARS SOATI */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Dars Sanasi:</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono font-medium"
                    required
                  />
                  <span className="text-[10px] text-slate-500 block">
                    {formatDateToUzbek(formDate)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Dars Soati (Slot):</label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    {PERIOD_TIMES.map((p) => (
                      <option key={p.periodIndex} value={p.periodIndex}>
                        {p.label} ({p.startTime} - {p.endTime})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* FAN VA SINF */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Fan Nomi:</label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Masalan: Fizika"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Sinf:</label>
                  <input
                    type="text"
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="Masalan: 10-A"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              {/* DARS MAVZUSI */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Dars Mavzusi:</label>
                <input
                  type="text"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="Masalan: Pifagor teoremasi va 3D fazoviy shakllar"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              {/* AUDITORIYA VA DARS TURI */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Auditoriya / Xona:</label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="304-Fizika Lab"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Dars Turi:</label>
                  <select
                    value={formLessonType}
                    onChange={(e) => setFormLessonType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="theory">Nazariy Dars</option>
                    <option value="lab">3D Laboratoriya Mashgʻuloti</option>
                    <option value="quiz">Amaliy Test / Savol-javob</option>
                    <option value="exam">Nazorat Imtihoni</option>
                  </select>
                </div>
              </div>

              {formLessonType === "lab" && (
                <div className="space-y-1 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                  <label className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Bogʻlanadigan 3D Virtual Simulyator:</span>
                  </label>
                  <select
                    value={formLabType}
                    onChange={(e) => setFormLabType(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                  >
                    <option value="pythagoras">3D Pifagor Kublari & Prizma isboti</option>
                    <option value="atom3d">3D Bohr Kvant Atom Modeli</option>
                    <option value="optics3d">3D Prizma Dispersiyasi & Spektr</option>
                    <option value="projectile">3D Ballistika & Parabola Snayperi</option>
                    <option value="spring3d">3D Guk Qonuni & Prujinali Mayatnik</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30 cursor-pointer transition-all active:scale-95"
                >
                  {editingLessonId ? "Oʻzgarishlarni Saqlash" : "Darsni Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
