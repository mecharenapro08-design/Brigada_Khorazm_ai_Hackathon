import React, { useState } from "react";
import {
  Trophy,
  Users,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { UserProfile } from "../types";

interface TeacherLeaderboardProps {
  userProfile: UserProfile;
}

const CLASS_RANKINGS = [
  {
    id: "cls-11a",
    name: "11-A sinf",
    stream: "Aniq fanlar (Fizika-Matematika)",
    teacher: "Dilshod Karimov",
    studentsCount: 28,
    avgScore: 91.4,
    attendanceRate: 98,
    olympiadWinners: 6,
    dtmPrediction: "168 / 189 ball",
    rank: 1,
    badge: "Oltin Sinf",
    color: "amber",
  },
  {
    id: "cls-10a",
    name: "10-A sinf",
    stream: "Muhandislik & Kiber-texnologiyalar",
    teacher: "Dilshod Karimov",
    studentsCount: 30,
    avgScore: 88.6,
    attendanceRate: 96,
    olympiadWinners: 4,
    dtmPrediction: "154 / 189 ball",
    rank: 2,
    badge: "Kumush Sinf",
    color: "slate",
  },
  {
    id: "cls-9v",
    name: "9-V sinf",
    stream: "Tabiiy fanlar & IT",
    teacher: "Dilshod Karimov",
    studentsCount: 26,
    avgScore: 85.2,
    attendanceRate: 94,
    olympiadWinners: 3,
    dtmPrediction: "142 / 189 ball",
    rank: 3,
    badge: "Bronza Sinf",
    color: "orange",
  },
  {
    id: "cls-10b",
    name: "10-B sinf",
    stream: "Iqtisod & Aniq fanlar",
    teacher: "Dilshod Karimov",
    studentsCount: 29,
    avgScore: 82.4,
    attendanceRate: 91,
    olympiadWinners: 2,
    dtmPrediction: "136 / 189 ball",
    rank: 4,
    badge: "Faol Sinf",
    color: "indigo",
  },
];

const TOP_STUDENTS_ACROSS_CLASSES = [
  { rank: 1, name: "Jasur Aliyev", class: "11-A", score: 98.5, awards: "Respublika Fizika Olimpiadasi 1-oʻrin", dtm: "182 ball" },
  { rank: 2, name: "Madina Karimova", class: "10-A", score: 96.8, awards: "Al-Xorazmiy Matematika Tanlovi Gʻolibi", dtm: "176 ball" },
  { rank: 3, name: "Sardorbek Rahimov", class: "11-A", score: 95.4, awards: "Mirzo Ulugʻbek Vorislari Tanlovi", dtm: "171 ball" },
  { rank: 4, name: "Diyora Rustamova", class: "10-A", score: 94.0, awards: "Kvant Fizikasi Tadqiqotchi Sovrini", dtm: "168 ball" },
  { rank: 5, name: "Azizbek Yusupov", class: "9-V", score: 93.2, awards: "Yosh Muhandislar Hakaton Gʻolibi", dtm: "162 ball" },
];

export const TeacherLeaderboard: React.FC<TeacherLeaderboardProps> = ({ userProfile }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs dark:shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Oʻqituvchi Monitoringi & Sinflar Reytingi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            Akademik Oʻzlashtirish va Sinflar Reytingi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sizga biriktirilgan sinflarning oʻrtacha oʻzlashtirish ballari, davomat foizlari hamda fan olimpiadasi va DTM koʻrsatkichlari dinamikasi.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Jami Oʻquvchilar</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
            113 <span className="text-sm font-normal text-slate-400">nafar</span>
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">4 ta sinfda roʻyxatda</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Oʻrtacha Oʻzlashtirish</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            86.9%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">+3.4% oʻtgan oyga nisbatan</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Umumiy Davomat</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">
            94.8%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Yuqori intizom darajasi</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Olimpiadachilar</span>
          <div className="text-3xl font-black text-amber-500 font-mono mt-1">
            15 <span className="text-sm font-normal text-slate-400">sovrindor</span>
          </div>
          <span className="text-xs text-amber-600 font-semibold mt-1 block">Viloyat va Respublika</span>
        </div>
      </div>

      {/* Class Rankings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Sinflar Boʻyicha Akademik Reyting</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Oxirgi choraklik nazorat ishlari va jurnallar asosida
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CLASS_RANKINGS.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                      cls.rank === 1
                        ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                        : cls.rank === 2
                        ? "bg-slate-300 text-slate-900"
                        : cls.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    #{cls.rank}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {cls.name}
                    </h4>
                    <p className="text-xs text-slate-500">{cls.stream}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold border border-indigo-200 dark:border-indigo-800">
                  {cls.badge}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Oʻzlashtirish</span>
                  <strong className="text-slate-900 dark:text-white font-mono font-bold text-sm">
                    {cls.avgScore}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Davomat</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-sm">
                    {cls.attendanceRate}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">DTM Prognoz</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-sm">
                    {cls.dtmPrediction}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Talented Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Eng Iqtidorli Oʻquvchilar (Top 5)</span>
          </h3>
          <span className="text-xs text-slate-500">
            DTM va fan olimpiadalariga tayyorlanayotgan yetakchilar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Oʻrin</th>
                <th className="py-3 px-3">Oʻquvchi</th>
                <th className="py-3 px-3">Sinf</th>
                <th className="py-3 px-3">Oʻrtacha Ball</th>
                <th className="py-3 px-3">Yutuq / Mukofot</th>
                <th className="py-3 px-3">DTM Natija</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {TOP_STUDENTS_ACROSS_CLASSES.map((stu) => (
                <tr key={stu.rank} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold font-mono text-slate-700 dark:text-slate-300">
                      #{stu.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {stu.name}
                  </td>
                  <td className="py-3 px-3 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {stu.class}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {stu.score}%
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {stu.awards}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {stu.dtm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
