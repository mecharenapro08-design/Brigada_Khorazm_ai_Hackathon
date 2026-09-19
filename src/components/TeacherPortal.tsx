import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Plus,
  Check,
  BarChart3,
  Search,
  ClipboardList,
  Users,
  Building2,
  Phone,
  Award,
  AlertCircle,
  FlaskConical,
  FileText,
  UserPlus,
  Copy,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { UserProfile } from "../types";
import { VisualScheduleView } from "./VisualScheduleView";
import {
  INITIAL_CLASSROOMS,
  ClassroomData,
  ClassStudent,
  ClassHomework,
} from "../data/classroomsData";

interface TeacherPortalProps {
  userProfile: UserProfile;
  onOpenAITutorWithTopic?: (topic: string) => void;
  onOpenLabWithTopic?: (
    labType: "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d"
  ) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  userProfile,
  onOpenLabWithTopic,
}) => {
  // Classrooms state
  const [classrooms, setClassrooms] = useState<ClassroomData[]>(INITIAL_CLASSROOMS);
  const [selectedClassId, setSelectedClassId] = useState<string>("cls-10a");

  // Per-class active tab
  const [classTab, setClassTab] = useState<
    "journal" | "analytics" | "tasks" | "ai-plan" | "schedule"
  >("journal");

  // Search filter for students
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // New Student modal state
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>("");
  const [newStudentPhone, setNewStudentPhone] = useState<string>("+998 90 ");
  const [newStudentParent, setNewStudentParent] = useState<string>("");
  const [newStudentScore, setNewStudentScore] = useState<number>(85);

  // New Homework modal state
  const [isAddingHw, setIsAddingHw] = useState<boolean>(false);
  const [newHwTitle, setNewHwTitle] = useState<string>("");
  const [newHwSubject, setNewHwSubject] = useState<string>("Fizika");
  const [newHwDueDate, setNewHwDueDate] = useState<string>("24-Sentyabr, 2026");
  const [newHwLabType, setNewHwLabType] = useState<
    "none" | "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d"
  >("none");

  // New Class modal state
  const [isAddingClass, setIsAddingClass] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassDirection, setNewClassDirection] = useState<string>("Aniq fanlar & Fizika");
  const [newClassRoom, setNewClassRoom] = useState<string>("305-xona");
  const [newClassHours, setNewClassHours] = useState<number>(4);

  // AI Lesson Planner state
  const [aiTopicInput, setAiTopicInput] = useState<string>(
    "Kvant mexanikasiga kirish va fotoeffekt hodisasi"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedOutline, setGeneratedOutline] = useState<string | null>(null);

  // Active classroom object
  const activeClass =
    classrooms.find((c) => c.id === selectedClassId) || classrooms[0];

  // Helper calculations for active class
  const totalStudents = activeClass.students.length;
  const presentCount = activeClass.students.filter(
    (s) => s.attendance === "present" || s.attendance === "late"
  ).length;
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
  const avgScore =
    totalStudents > 0
      ? Math.round(
          activeClass.students.reduce((acc, s) => acc + s.score, 0) /
            totalStudents
        )
      : 0;

  // Toggle student attendance
  const cycleAttendance = (studentId: string) => {
    setClassrooms((prev) =>
      prev.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        const updatedStudents = cls.students.map((s) => {
          if (s.id !== studentId) return s;
          const map: Record<
            ClassStudent["attendance"],
            ClassStudent["attendance"]
          > = {
            present: "late",
            late: "excused",
            excused: "absent",
            absent: "present",
          };
          return { ...s, attendance: map[s.attendance] };
        });
        return { ...cls, students: updatedStudents };
      })
    );
  };

  // Update student score
  const updateStudentScore = (studentId: string, newScore: number) => {
    const clamped = Math.max(0, Math.min(100, newScore));
    setClassrooms((prev) =>
      prev.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        const updatedStudents = cls.students.map((s) =>
          s.id === studentId ? { ...s, score: clamped } : s
        );
        return { ...cls, students: updatedStudents };
      })
    );
  };

  // Update student teacher note
  const updateStudentNote = (studentId: string, noteText: string) => {
    setClassrooms((prev) =>
      prev.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        const updatedStudents = cls.students.map((s) =>
          s.id === studentId ? { ...s, note: noteText } : s
        );
        return { ...cls, students: updatedStudents };
      })
    );
  };

  // Delete student
  const handleDeleteStudent = (studentId: string) => {
    if (confirm("Haqiqatan ham bu oʻquvchini sinf roʻyxatidan oʻchirmoqchimisiz?")) {
      setClassrooms((prev) =>
        prev.map((cls) => {
          if (cls.id !== activeClass.id) return cls;
          return {
            ...cls,
            students: cls.students.filter((s) => s.id !== studentId),
          };
        })
      );
    }
  };

  // Add new student to active class
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: ClassStudent = {
      id: `st-${activeClass.id}-${Date.now()}`,
      name: newStudentName.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      attendance: "present",
      score: newStudentScore,
      parentName: newStudentParent.trim() || "Ota-onasi",
      parentPhone: newStudentPhone.trim() || "+998 90 000-00-00",
      note: "Yangi qoʻshilgan oʻquvchi",
      lastHomework: "Yangi",
      status: "active",
      strengths: ["Fan qiziqishi"],
    };

    setClassrooms((prev) =>
      prev.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return { ...cls, students: [...cls.students, newStudent] };
      })
    );

    setNewStudentName("");
    setNewStudentParent("");
    setNewStudentPhone("+998 90 ");
    setNewStudentScore(85);
    setIsAddingStudent(false);
  };

  // Add new homework to active class
  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle.trim()) return;

    const newHw: ClassHomework = {
      id: `hw-${activeClass.id}-${Date.now()}`,
      title: newHwTitle.trim(),
      subject: newHwSubject.trim(),
      dueDate: newHwDueDate,
      submittedCount: 0,
      totalCount: activeClass.students.length,
      status: "active",
      labSimulationType:
        newHwLabType !== "none" ? newHwLabType : undefined,
    };

    setClassrooms((prev) =>
      prev.map((cls) => {
        if (cls.id !== activeClass.id) return cls;
        return { ...cls, homeworks: [newHw, ...cls.homeworks] };
      })
    );

    setNewHwTitle("");
    setIsAddingHw(false);
  };

  // Add a brand new classroom
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass: ClassroomData = {
      id: `cls-${Date.now()}`,
      name: newClassName.trim(),
      direction: newClassDirection.trim(),
      headTeacher: `${userProfile.name} (Siz)`,
      room: newClassRoom.trim(),
      weeklyHours: newClassHours,
      targetExam: "DTM & Fan olimpiadasi",
      students: [
        {
          id: `st-new-1`,
          name: "Azamat Ergashev",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          attendance: "present",
          score: 90,
          parentName: "Qodir Ergashev (Otasi)",
          parentPhone: "+998 90 111-22-33",
          note: "Yangi guruh yetakchisi",
          lastHomework: "Topshirildi (5)",
          status: "active",
          strengths: ["Matematika", "Mantiq"],
        },
      ],
      topicsProgress: [
        { topic: "Boshlangʻich diagnostika va takrorlash", score: 85, status: "Yaxshi" },
      ],
      homeworks: [],
      aiNotes: {
        generalSummary: `${newClassName} uchun boshlangʻich tahlillar yuklanmoqda.`,
        focusArea: "Oʻquvchilar bilimi diagnostikasi oʻtkazilmoqda.",
        talentedStudents: ["Azamat Ergashev"],
        needsAttention: [],
        parentMeetingDraft: `Hurmatli ${newClassName} ota-onalari! Yangi oʻquv davrida darslarimiz boshlandi.`,
      },
    };

    setClassrooms([...classrooms, newClass]);
    setSelectedClassId(newClass.id);
    setNewClassName("");
    setIsAddingClass(false);
  };

  // Generate AI Lesson Plan
  const handleGenerateAiPlan = async () => {
    if (!aiTopicInput.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopicInput.trim(),
          grade: activeClass.name,
          subject: activeClass.direction,
          room: activeClass.room,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.outline) {
          setGeneratedOutline(data.outline);
          setIsGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.warn("AI lesson plan API call error, using local detailed template:", err);
    }

    // Local detailed template fallback
    setTimeout(() => {
      setGeneratedOutline(`Dars mavzusi: "${aiTopicInput}" (${activeClass.name})
Sinf yoʻnalishi: ${activeClass.direction} | Dars xonasi: ${activeClass.room}

1. Dars maqsadi va vazifalari:
   - ${activeClass.name} oʻquvchilariga mavzuning ilmiy mohiyati va tajribaviy asoslarini toʻliq tushuntirish.
   - Kundalik hayot va texnologiyalardagi qoʻllanilishi (quyosh panellari, optoelektronika, muhandislik).
   - ${activeClass.targetExam} talablari asosida test va masalalar yechish koʻnikmasini shakllantirish.

2. Kirish qismi (7 daqiqa):
   - Oʻtgan mavzu boʻyicha tezkor blitz savol-javob.
   - Muammoli vaziyat: Foton va toʻlqin dualizmi hamda tajribaviy xulosalar.

3. Asosiy tushuntirish (20 daqiqa):
   - Nazariy qoidalar va asosiy hisoblash formulalari.
   - Oʻlchov birliklari va doimiy kattaliklar qiymatlari.
   - AI Maktab interaktiv 2D/3D laboratoriyasini doskada namoyish qilish.

4. Mustahkamlash va amaliy mashq (13 daqiqa):
   - ${activeClass.students[0]?.name || "Iqtidorli oʻquvchi"} bilan birga doskada amaliy masala yechish.
   - Oʻquvchilar juftlikda 3D simulyatsiyani sinovdan oʻtkazadi.

5. Uyga vazifa (5 daqiqa):
   - Darslikdan mustaqil mashqlar va AI Maktab platformasida tajriba sinovi.`);
      setIsGenerating(false);
    }, 800);
  };

  // Save journal notification
  const handleSaveJournal = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Copy text to clipboard
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  // Filter students based on search
  const filteredStudents = activeClass.students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.parentPhone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
              Oʻqituvchi
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-xs border border-indigo-200 dark:border-indigo-800">
                Ustoz Portali
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {userProfile.school || "Prezident Maktabi"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
              {userProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {userProfile.grade || "Fizika va Matematika fani yetakchi oʻqituvchisi"} • {classrooms.length} ta faol sinf
            </p>
          </div>
        </div>

        {/* Global overview metrics */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-center flex-1 sm:flex-initial">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Barcha Sinflar</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">{classrooms.length} ta sinf</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-center flex-1 sm:flex-initial">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Jami Oʻquvchilar</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {classrooms.reduce((acc, c) => acc + c.students.length, 0)} nafar
            </span>
          </div>
          <button
            onClick={() => setIsAddingClass(true)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Sinf Qoʻshish</span>
          </button>
        </div>
      </div>

      {/* Class Selector Carousel / Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
              Sinflar Roʻyxati & Maʼlumotlar Joyi
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Tanlangan: <strong className="text-indigo-600 dark:text-indigo-400">{activeClass.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {classrooms.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            const clsPresent = cls.students.filter(
              (s) => s.attendance === "present" || s.attendance === "late"
            ).length;
            const clsAttRate =
              cls.students.length > 0
                ? Math.round((clsPresent / cls.students.length) * 100)
                : 0;
            const clsAvgScore =
              cls.students.length > 0
                ? Math.round(
                    cls.students.reduce((acc, s) => acc + s.score, 0) /
                      cls.students.length
                  )
                : 0;

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                    : "bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-bl-xl shadow-xs">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                      {cls.name}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {cls.room}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                    {cls.direction}
                  </p>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Rahbar: {cls.headTeacher}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{cls.students.length} oʻquvchi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {clsAttRate}% davomat
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-[11px]">
                      {clsAvgScore} ball
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Class Header Banner */}
      <div className="bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
                Tanlangan Sinf Maydoni
              </span>
              <span className="text-xs text-indigo-200">
                {activeClass.room} • Haftada {activeClass.weeklyHours} soat
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              {activeClass.name} — {activeClass.direction}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 flex items-center gap-2">
              <span>🎯 Maqsad: {activeClass.targetExam}</span>
              <span>• Sinf rahbari: {activeClass.headTeacher}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center flex-1 md:flex-initial">
              <span className="block text-[11px] text-indigo-200">Davomat</span>
              <span className="text-lg font-black text-emerald-400">{attendanceRate}%</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center flex-1 md:flex-initial">
              <span className="block text-[11px] text-indigo-200">Oʻrtacha Ball</span>
              <span className="text-lg font-black text-cyan-300">{avgScore} / 100</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center flex-1 md:flex-initial">
              <span className="block text-[11px] text-indigo-200">Oʻquvchilar</span>
              <span className="text-lg font-black text-white">{totalStudents} nafar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for the Selected Class */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setClassTab("journal")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            classTab === "journal"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Sinf Jurnali & Davomat</span>
        </button>

        <button
          onClick={() => setClassTab("analytics")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            classTab === "analytics"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Sinf Analitikasi & Iqtidorlilar</span>
        </button>

        <button
          onClick={() => setClassTab("tasks")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            classTab === "tasks"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vazifalar & 3D Lab ({activeClass.homeworks.length})</span>
        </button>

        <button
          onClick={() => setClassTab("ai-plan")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            classTab === "ai-plan"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Sinf Uchun AI Reja & Majlis Xati</span>
        </button>

        <button
          onClick={() => setClassTab("schedule")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            classTab === "schedule"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Haftalik Dars Jadvali</span>
        </button>
      </div>

      {/* TAB 1: JOURNAL & ATTENDANCE */}
      {classTab === "journal" && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs dark:shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`${activeClass.name} oʻquvchisi yoki telefon raqami...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={() => setIsAddingStudent(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>Oʻquvchi Qoʻshish</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveJournal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Jurnalni Saqlash</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                  <CheckCircle2 className="w-4 h-4" />
                  Saqlandi!
                </span>
              )}
            </div>
          </div>

          {/* Attendance Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span>Davomat holati (oʻzgartirish uchun bosing):</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold">
                ✓ Keldi
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold">
                ⏱ Kechikdi
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold">
                ✉ Sababli
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold">
                ✕ Sababsiz
              </span>
            </div>
            <span>Jami: {filteredStudents.length} ta yozuv</span>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Oʻquvchi (F.I.SH)</th>
                  <th className="p-3">Davomat</th>
                  <th className="p-3">Ball (0-100)</th>
                  <th className="p-3">Ota-onasi & Aloqa</th>
                  <th className="p-3">Oxirgi Vazifa</th>
                  <th className="p-3">Ustoz Izohi / Kuchli tomoni</th>
                  <th className="p-3 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {filteredStudents.map((student, idx) => {
                  const attendanceBadge = {
                    present: {
                      label: "Keldi",
                      bg: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
                    },
                    late: {
                      label: "Kechikdi",
                      bg: "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700",
                    },
                    excused: {
                      label: "Sababli",
                      bg: "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
                    },
                    absent: {
                      label: "Sababsiz",
                      bg: "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700",
                    },
                  }[student.attendance];

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {student.name}
                            </span>
                            <div className="flex gap-1 mt-0.5">
                              {student.strengths?.map((str, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold"
                                >
                                  {str}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => cycleAttendance(student.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all active:scale-95 ${attendanceBadge.bg}`}
                        >
                          {attendanceBadge.label}
                        </button>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={student.score}
                            onChange={(e) =>
                              updateStudentScore(student.id, Number(e.target.value))
                            }
                            className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-center font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                          />
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {student.score >= 86
                              ? "Aʼlo"
                              : student.score >= 71
                              ? "Yaxshi"
                              : "Qoniqarli"}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                            {student.parentName}
                          </span>
                          <a
                            href={`tel:${student.parentPhone}`}
                            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{student.parentPhone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="p-3 text-xs text-slate-600 dark:text-slate-300">
                        {student.lastHomework}
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={student.note}
                          onChange={(e) =>
                            updateStudentNote(student.id, e.target.value)
                          }
                          placeholder="Ustoz eslatmasi..."
                          className="w-full min-w-[140px] px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                        />
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          title="Oʻchirish"
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLASS ANALYTICS & TALENTED STUDENTS */}
      {classTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Progress */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
                    {activeClass.name} Mavzular Oʻzlashtirish Dinamikasi
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sinf oʻquvchilarining laboratoriya va nazariy testlardagi oʻrtacha natijalari
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  Oʻrtacha {avgScore}%
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {activeClass.topicsProgress.map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">
                        {item.topic}
                      </span>
                      <span className="text-indigo-600 dark:text-cyan-400 font-bold">
                        {item.score}% ({item.status})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score >= 85
                            ? "bg-emerald-500"
                            : item.score >= 75
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Talented vs Needs Attention breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>🌟 Sinfning Iqtidorli Oʻquvchilari</span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400">
                  Olimpiada va DTM grantiga tayyorlanayotgan yetakchilar:
                </p>
                <div className="space-y-1.5 pt-1">
                  {activeClass.aiNotes.talentedStudents.map((st, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/60 text-xs font-bold text-emerald-900 dark:text-emerald-200 border border-emerald-200/50"
                    >
                      ✓ {st}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>⚠️ Qoʻshimcha Eʼtibor Talab Oʻquvchilar</span>
                </div>
                <p className="text-xs text-amber-700/80 dark:text-amber-400">
                  Davomat yoki formulalarda individual yordam lozim:
                </p>
                <div className="space-y-1.5 pt-1">
                  {activeClass.aiNotes.needsAttention.map((st, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-900/60 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-200/50"
                    >
                      ! {st}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Advisor Panel for this Class */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                {activeClass.name} Boʻyicha AI Xulosasi
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 space-y-1">
                <strong className="block text-indigo-700 dark:text-indigo-300 font-bold">
                  Umumiy Taʼrif:
                </strong>
                <p>{activeClass.aiNotes.generalSummary}</p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/80 space-y-1">
                <strong className="block text-cyan-700 dark:text-cyan-300 font-bold">
                  Tavsiya Etilgan Asosiy Mavzu:
                </strong>
                <p>{activeClass.aiNotes.focusArea}</p>
              </div>

              <button
                onClick={() => setClassTab("ai-plan")}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ushbu Sinfga Dars Konspekti Tuzish</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEWORKS & 3D LAB TASKS */}
      {classTab === "tasks" && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {activeClass.name} Uy Vazifalari va 3D Laboratoriya Topshiriqlari
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Faqat {activeClass.name} uchun berilgan amaliy vazifalar, muddati va oʻquvchilar topshirganlik holati.
              </p>
            </div>

            <button
              onClick={() => setIsAddingHw(!isAddingHw)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Topshiriq Biriktirish</span>
            </button>
          </div>

          {isAddingHw && (
            <form
              onSubmit={handleAddHomework}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {activeClass.name} uchun yangi vazifa yaratish:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Vazifa mavzusi va topshiriq sharti..."
                  value={newHwTitle}
                  onChange={(e) => setNewHwTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Muddati (masalan: 24-Sentyabr, 2026)"
                  value={newHwDueDate}
                  onChange={(e) => setNewHwDueDate(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Fan nomi:
                  </label>
                  <input
                    type="text"
                    value={newHwSubject}
                    onChange={(e) => setNewHwSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Bogʻlangan 3D Laboratoriya (ixtiyoriy):
                  </label>
                  <select
                    value={newHwLabType}
                    onChange={(e) => setNewHwLabType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="none">Laboratoriya biriktirilmasin</option>
                    <option value="pythagoras">Pifagor va Fazoviy Shakllar 3D</option>
                    <option value="atom3d">Atom Tuzilishi va Elektron Orbitallari 3D</option>
                    <option value="optics3d">Optik Nurlar va Prizma 3D</option>
                    <option value="projectile">Snaryad Uchishi va Parabola 3D</option>
                    <option value="spring3d">Prujinali Mayatnik va Guk Qonuni 3D</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingHw(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Biriktirish
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeClass.homeworks.length === 0 ? (
              <div className="col-span-full p-8 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                Ushbu sinfga hali vazifa belgilanmagan. "Yangi Topshiriq Biriktirish" tugmasini bosing.
              </div>
            ) : (
              activeClass.homeworks.map((hw) => {
                const percent = Math.round(
                  (hw.submittedCount / (hw.totalCount || 1)) * 100
                );
                return (
                  <div
                    key={hw.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                          {hw.subject}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {hw.dueDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {hw.title}
                      </h4>

                      {hw.labSimulationType && (
                        <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>3D Simulyatsiya biriktirilgan</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Topshirganlar:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {hw.submittedCount} / {hw.totalCount} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-indigo-500 to-emerald-400 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-bold ${
                          hw.status === "graded"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {hw.status === "graded"
                          ? "✓ Baholandi"
                          : "⏳ Tekshirilmoqda"}
                      </span>

                      {hw.labSimulationType && onOpenLabWithTopic && (
                        <button
                          onClick={() =>
                            onOpenLabWithTopic(hw.labSimulationType!)
                          }
                          className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <FlaskConical className="w-3 h-3" />
                          <span>Labni ochish</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TAILORED AI LESSON PLAN & PARENT MEETING */}
      {classTab === "ai-plan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                {activeClass.name} Uchun Maxsus AI Dars Rejasi & Konspekti
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {activeClass.name} yoʻnalishi ({activeClass.direction}) va sinf oʻquvchilari darajasiga moslashtirilgan 45 daqiqalik professional dars rejasi.
            </p>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Dars mavzusi:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiTopicInput}
                  onChange={(e) => setAiTopicInput(e.target.value)}
                  placeholder="Masalan: Faradey qonuni va oʻzinduksiya..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={handleGenerateAiPlan}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? "Tuzilmoqda..." : "Konspekt Yaratish"}</span>
                </button>
              </div>
            </div>

            {generatedOutline ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 dark:text-cyan-400">
                    Tayyor Metodik Konspekt
                  </span>
                  <button
                    onClick={() =>
                      handleCopyText(generatedOutline, "outline")
                    }
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {copySuccess === "outline" ? "Nusxalandi!" : "Nusxa olish"}
                    </span>
                  </button>
                </div>
                <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedOutline}
                </pre>
              </div>
            ) : (
              <div className="mt-4 p-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                Mavzuni kiritib, "Konspekt Yaratish" tugmasini bosing. AI mazkur {activeClass.name} darajasiga moslashtirilgan mukammal reja tuzib beradi.
              </div>
            )}
          </div>

          {/* Parent Meeting Draft Card */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                  Ota-onalar Xabarnomasi
                </h3>
              </div>
              <button
                onClick={() =>
                  handleCopyText(
                    activeClass.aiNotes.parentMeetingDraft,
                    "parent"
                  )
                }
                className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>
                  {copySuccess === "parent" ? "Nusxalandi!" : "Nusxalash"}
                </span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Telegram guruh yoki majlis uchun tayyorlangan rasmiy xabar matni:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {activeClass.aiNotes.parentMeetingDraft}
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              💡 Ushbu matnni toʻgʻridan-toʻgʻri sinf Telegram guruhiga joʻnatishingiz mumkin.
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CLASS SCHEDULE */}
      {classTab === "schedule" && (
        <VisualScheduleView
          userProfile={{
            ...userProfile,
            grade: activeClass.name,
          }}
          isTeacherView={true}
          onOpenLabWithTopic={onOpenLabWithTopic}
        />
      )}

      {/* MODAL: ADD NEW STUDENT */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <UserPlus className="w-4 h-4 text-indigo-500" />
                <span>{activeClass.name} ga Oʻquvchi Qoʻshish</span>
              </h3>
              <button
                onClick={() => setIsAddingStudent(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Oʻquvchi F.I.SH:
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Sardor Alimov"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ota-onasi ismi:
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Alisher Alimov (Otasi)"
                  value={newStudentParent}
                  onChange={(e) => setNewStudentParent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Ota-onasi telefon raqami:
                </label>
                <input
                  type="text"
                  placeholder="+998 90 123-45-67"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Boshlangʻich bahosi (0-100):
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newStudentScore}
                  onChange={(e) => setNewStudentScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Qoʻshish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW CLASSROOM */}
      {isAddingClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Building2 className="w-4 h-4 text-indigo-500" />
                <span>Yangi Sinf Maydoni Yaratish</span>
              </h3>
              <button
                onClick={() => setIsAddingClass(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sinf Nomi:
                </label>
                <input
                  type="text"
                  placeholder="Masalan: 11-B sinf"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Yoʻnalishi va Fani:
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Aniq fanlar & Fizika-Informatika"
                  value={newClassDirection}
                  onChange={(e) => setNewClassDirection(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Xona:
                  </label>
                  <input
                    type="text"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Haftalik soat:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newClassHours}
                    onChange={(e) => setNewClassHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingClass(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                >
                  Sinfni Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
