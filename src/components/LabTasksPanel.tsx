import React from "react";
import {
  CheckCircle2,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  Trophy,
  HelpCircle,
  Clock,
  Zap,
} from "lucide-react";
import { LabTask } from "../types";

interface LabTasksPanelProps {
  tasks: LabTask[];
  activeTab: string;
  dimensionMode: "2d" | "3d";
  onToggleDimension: (dim: "2d" | "3d") => void;
  completedTaskIds: string[];
  onClaimTask: (task: LabTask) => void;
  canClaimTask: (task: LabTask) => boolean;
}

export const LabTasksPanel: React.FC<LabTasksPanelProps> = ({
  tasks,
  activeTab,
  dimensionMode,
  onToggleDimension,
  completedTaskIds,
  onClaimTask,
  canClaimTask,
}) => {
  const [filterMode, setFilterMode] = React.useState<"all" | "2d" | "3d">("all");

  const currentLabTasks = tasks.filter((t) => t.labType === activeTab);
  const displayedTasks = currentLabTasks.filter((t) => {
    if (filterMode === "all") return true;
    return t.dimension === filterMode;
  });

  const completedCount = currentLabTasks.filter((t) =>
    completedTaskIds.includes(t.id)
  ).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xl space-y-5 transition-colors">
      {/* HEADER WITH DEDICATED 2D/3D SWITCH BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display">
              Laboratoriya Zadaniyalari (Topshiriqlar)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
              {completedCount} / {currentLabTasks.length} bajarildi
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2D va 3D tajribalarni bajarib, qoʻshimcha XP va qimmatbaho olmoslar yutib oling.
          </p>
        </div>

        {/* ALOHIDA KICHKINA TUGMA: 2D va 3D REJIMINI ALMASHTIRUVCHI TUGMA */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 hidden md:inline">
            Zadaniya rejimi:
          </span>

          <button
            id="lab-task-toggle-2d"
            onClick={() => onToggleDimension("2d")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              dimensionMode === "2d"
                ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/30 font-extrabold scale-105"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Zadaniyani 2D tekislik rejimiga oʻtkazish"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D</span>
          </button>

          <button
            id="lab-task-toggle-3d"
            onClick={() => onToggleDimension("3d")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              dimensionMode === "3d"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-extrabold scale-105"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Zadaniyani 3D fazoviy rejimiga oʻtkazish"
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D</span>
          </button>
        </div>
      </div>

      {/* FILTER BUTTONS: Barchasi / 2D / 3D */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
          Filtrlash:
        </span>

        <button
          onClick={() => setFilterMode("all")}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
            filterMode === "all"
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Barcha topshiriqlar ({currentLabTasks.length})
        </button>

        <button
          onClick={() => setFilterMode("2d")}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
            filterMode === "2d"
              ? "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-cyan-600"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-500" />
          <span>2D Zadaniyalar ({currentLabTasks.filter((t) => t.dimension === "2d").length})</span>
        </button>

        <button
          onClick={() => setFilterMode("3d")}
          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 border ${
            filterMode === "3d"
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent hover:text-indigo-600"
          }`}
        >
          <Box className="w-3.5 h-3.5 text-indigo-500" />
          <span>3D Zadaniyalar ({currentLabTasks.filter((t) => t.dimension === "3d").length})</span>
        </button>
      </div>

      {/* TASKS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedTasks.map((task) => {
          const isCompleted = completedTaskIds.includes(task.id);
          const isReadyToClaim = !isCompleted && canClaimTask(task);
          const isMatchingDimension = dimensionMode === task.dimension;

          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 relative ${
                isCompleted
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                  : isReadyToClaim
                  ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-md animate-pulse"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {task.dimension === "2d" ? (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200 dark:border-cyan-800 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-cyan-500" />
                        <span>2D Tekislik</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                        <Box className="w-3 h-3 text-indigo-500" />
                        <span>3D Fazo</span>
                      </span>
                    )}

                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>+{task.xpReward} XP / +{task.coinsReward} 💎</span>
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Bajarildi</span>
                    </span>
                  ) : isReadyToClaim ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      <Zap className="w-3.5 h-3.5 animate-bounce" />
                      <span>Tayyor!</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Jarayonda</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {task.description}
                </p>

                <div className="mt-2.5 p-2 rounded-lg bg-white/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Shart:</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {task.targetCriteria}
                    </span>
                  </div>
                  <div className="flex items-start gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
                    <HelpCircle className="w-3 h-3 shrink-0 mt-0.5 text-amber-500" />
                    <span>{task.hint}</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON: CLAIM OR SWITCH REJIM KICHKINA TUGMASI */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {/* ALOHIDA KICHKINA TUGMA: Ushbu zadaniyani 2D yoki 3D qilish tugmasi */}
                {!isMatchingDimension && !isCompleted && (
                  <button
                    onClick={() => onToggleDimension(task.dimension)}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
                    title={`Ushbu topshiriq uchun ${task.dimension.toUpperCase()} rejimiga oʻtish`}
                  >
                    {task.dimension === "2d" ? (
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                    ) : (
                      <Box className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span>{task.dimension.toUpperCase()} ga oʻtish</span>
                  </button>
                )}

                {isMatchingDimension && !isCompleted && !isReadyToClaim && (
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping inline-block" />
                    <span>Joriy {task.dimension.toUpperCase()} maydonda bajaring</span>
                  </span>
                )}

                {isCompleted && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mukofot olindi (+{task.xpReward} XP)</span>
                  </span>
                )}

                {isReadyToClaim && (
                  <button
                    onClick={() => onClaimTask(task)}
                    className="ml-auto px-3.5 py-1.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mukofotni Olish (+{task.xpReward} XP)</span>
                  </button>
                )}

                {!isCompleted && !isReadyToClaim && isMatchingDimension && (
                  <button
                    onClick={() => onClaimTask(task)}
                    className="ml-auto px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Tekshirish</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
