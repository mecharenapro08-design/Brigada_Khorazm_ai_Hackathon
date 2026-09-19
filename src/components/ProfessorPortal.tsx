import React, { useState } from "react";
import {
  FileText,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  Calendar,
  Send,
  Building,
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfessorPortalProps {
  userProfile: UserProfile;
}

interface Dissertation {
  id: string;
  candidateName: string;
  topic: string;
  degree: "PhD" | "DSc" | "Magistratura";
  progress: number;
  defenseDate: string;
  status: "draft" | "review" | "approved";
}

interface ResearchPaper {
  id: string;
  title: string;
  journal: string;
  year: number;
  citations: number;
  impactFactor: number;
  status: "published" | "under_review";
}

const INITIAL_DISSERTATIONS: Dissertation[] = [
  {
    id: "dis-1",
    candidateName: "Jamshid Qodirov",
    topic: "Kvant nuqtalari asosidagi yangi avlod yarimoʻtkazgich materiallarning fotoelektr xususiyatlari",
    degree: "PhD",
    progress: 85,
    defenseDate: "Noyabr, 2026",
    status: "review",
  },
  {
    id: "dis-2",
    candidateName: "Shahnoza Ergasheva",
    topic: "Grafen asosidagi kompozit materiallarda oʻta oʻtkazuvchanlik fazasi oʻtishlarini modellashtirish",
    degree: "PhD",
    progress: 60,
    defenseDate: "Fevral, 2027",
    status: "draft",
  },
  {
    id: "dis-3",
    candidateName: "Bobur Mirzayev",
    topic: "Lazer nurlanishining biologik toʻqimalarga chiziqsiz optik taʼsiri",
    degree: "Magistratura",
    progress: 95,
    defenseDate: "Oktyabr, 2026",
    status: "approved",
  },
];

const INITIAL_PAPERS: ResearchPaper[] = [
  {
    id: "p-1",
    title: "Topological Insulators and Quantum Hall Effects in 2D Systems",
    journal: "Physical Review B (Scopus Q1)",
    year: 2025,
    citations: 42,
    impactFactor: 3.9,
    status: "published",
  },
  {
    id: "p-2",
    title: "Nonlinear Optical Properties of Perovskite Nanocrystals",
    journal: "Nature Nanotechnology Review",
    year: 2024,
    citations: 118,
    impactFactor: 38.3,
    status: "published",
  },
  {
    id: "p-3",
    title: "Coherent Control of Spin Qubits in Silicon Quantum Wells",
    journal: "Applied Physics Letters",
    year: 2026,
    citations: 7,
    impactFactor: 3.8,
    status: "under_review",
  },
];

export const ProfessorPortal: React.FC<ProfessorPortalProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<"lectures" | "dissertations" | "publications" | "grant">("lectures");
  const [dissertations, setDissertations] = useState<Dissertation[]>(INITIAL_DISSERTATIONS);
  const [papers] = useState<ResearchPaper[]>(INITIAL_PAPERS);

  const [aiReviewTopic, setAiReviewTopic] = useState<string>("Grafen asosidagi yangi superoʻtkazgich modellar");
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);
  const [isAiReviewing, setIsAiReviewing] = useState<boolean>(false);

  const handleGenerateAiReview = () => {
    setIsAiReviewing(true);
    setTimeout(() => {
      setAiReviewResult(`Ilmiy maqola/dissertatsiya ekspert xulosasi:
Mavzu: "${aiReviewTopic}"

1. Ilmiy yangiligi (Novelty):
   - Tadqiqot obyekti zamonaviy kvant materialshunosligining eng dolzarb yoʻnalishlariga mos keladi.
   - 2D panjara strukturasidagi elektron-fonon oʻzaro taʼsirlar tahlili yuqori nazariy aniqlikda bajarilgan.

2. Uslubiyot va hisob-kitoblar (Methodology):
   - DFT (Density Functional Theory) va tight-binding modellari xalqaro Scopus Q1 talablariga toʻliq javob beradi.

3. Tavsiyalar:
   - 3-bobdagi kritik harorat (Tc) hisoblarini eksperimental adabiyotlar (Nature Physics, 2024) bilan taqqoslashni kengaytirish maqsadga muvofiq.
   - Xulosa: Ish ilmiy himoyaga yoki Q1 jurnaliga topshirish uchun tavsiya etiladi.`);
      setIsAiReviewing(false);
    }, 1400);
  };

  const approveDissertation = (id: string) => {
    setDissertations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "approved", progress: 100 } : d))
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-xs">
              Professor
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200 dark:border-purple-800">
                Oliy Akademik Portal
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {userProfile.school || "Oʻzbekiston Milliy Universiteti"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
              {userProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Fizika-matematika fanlari doktori (DSc), Professor • Nazariy va Kvant Fizikasi Kafedrasi
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center flex-1 sm:flex-initial">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">H-indeks</span>
            <span className="text-base font-extrabold text-purple-600 dark:text-purple-400">18 (Scopus)</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center flex-1 sm:flex-initial">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Iqtiboslar</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">1,420+</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-center flex-1 sm:flex-initial">
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">PhD Shogirdlar</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">{dissertations.length} nafar</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("lectures")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "lectures"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Katta Maʼruzalar & Auditoriyalar</span>
        </button>

        <button
          onClick={() => setActiveTab("dissertations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "dissertations"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>PhD Dissertatsiyalar Rahbarligi</span>
        </button>

        <button
          onClick={() => setActiveTab("publications")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "publications"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Ilmiy Maqolalar (Scopus Q1/Q2)</span>
        </button>

        <button
          onClick={() => setActiveTab("grant")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            activeTab === "grant"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Davlat Granti & AI Taqriz</span>
        </button>
      </div>

      {activeTab === "lectures" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Haftalik Katta Akademik Maʼruzalar Jadvali
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "Kvant elektrodinamikasi va Feynman diagrammalari",
                  audience: "Magistr 2-kurs & Doktorantlar",
                  hall: "Bosh Bino, 1-katta amfiteatr",
                  time: "Dushanba, 10:00 - 11:30",
                  studentsCount: 65,
                },
                {
                  title: "Kondensirlangan holat fizikasi va topologik fazalar",
                  audience: "Bakalavr 4-kurs (Nazariy fizika)",
                  hall: "Fizika fakulteti, 204-auditoriya",
                  time: "Chorshanba, 14:00 - 15:30",
                  studentsCount: 110,
                },
                {
                  title: "Zamonaviy ilmiy tadqiqot metodologiyasi va xalqaro nashrlar",
                  audience: "Kafedra yosh tadqiqotchilari",
                  hall: "Ilmiy Kengash zali",
                  time: "Juma, 16:00 - 17:30",
                  studentsCount: 35,
                },
              ].map((lec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {lec.title}
                    </h3>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800 shrink-0">
                      {lec.studentsCount} tinglovchi
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      {lec.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {lec.hall}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Auditoriya: {lec.audience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs dark:shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              Ilmiy Kengash Tadbirlari
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 space-y-1">
                <div className="flex items-center justify-between font-bold text-purple-700 dark:text-purple-300">
                  <span>DSc Himoyasi (Kengash aʼzosi)</span>
                  <span>24-Sentyabr</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Nomzod: O. Nazarov • Mavzu: "Nano-oʻlchamli ferromagnitlarda magnit rezonans effektlari"
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Xalqaro Kvant Konferensiyasi</span>
                  <span>12-Oktyabr</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  Plenar maʼruzachi sifatida ishtirok (Toshkent - Samarqand).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "dissertations" && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Ilmiy Shogirdlar va Dissertatsiya Ishlari Nazorati
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tayyorlanayotgan dissertatsiyalarning boblar boʻyicha holati va himoyaga tavsiya etish.
              </p>
            </div>

            <button
              onClick={() => alert("Yangi doktorant/magistrant biriktirish arizasi OAK tizimiga yuborildi.")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Shogird Qoʻshish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dissertations.map((dis) => (
              <div
                key={dis.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {dis.degree} Ilmiy darajasi
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Himoya: {dis.defenseDate}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {dis.candidateName}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {dis.topic}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Tayyorgarlik:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {dis.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-purple-500 to-indigo-500 rounded-full"
                      style={{ width: `${dis.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[11px] font-bold ${
                        dis.status === "approved"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {dis.status === "approved" ? "✓ Himoyaga tasdiqlangan" : "⏳ Taqriz jarayonida"}
                    </span>

                    {dis.status !== "approved" && (
                      <button
                        onClick={() => approveDissertation(dis.id)}
                        className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                      >
                        Tasdiqlash
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "publications" && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Xalqaro Reytingdagi Ilmiy Nashrlar
            </h2>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Scopus va Web of Science bazalari
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {papers.map((paper) => (
              <div key={paper.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">[{paper.year}]</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {paper.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Jurnal: <strong className="text-slate-700 dark:text-slate-300">{paper.journal}</strong> • IF: {paper.impactFactor}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Iqtiboslar:</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {paper.citations} ta
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      paper.status === "published"
                        ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    {paper.status === "published" ? "Nashr etilgan" : "Taqrizda"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "grant" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs dark:shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                AI Ilmiy Ekspertiza va Taqriz Generatori
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Dissertatsiya avtoreferati yoki ilmiy maqola mavzusini kiriting. Tizim Scopus Q1 standartlari boʻyicha ekspert xulosasi va metodologik tavsiyalarni shakllantiradi.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={aiReviewTopic}
                  onChange={(e) => setAiReviewTopic(e.target.value)}
                  placeholder="Maqola yoki dissertatsiya mavzusini kiriting..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleGenerateAiReview}
                  disabled={isAiReviewing}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiReviewing ? "Tahlil qilinmoqda..." : "Ekspertiza Qilish"}</span>
                </button>
              </div>
            </div>

            {aiReviewResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Rasmiy Ekspert Xulosasi (Loyiha)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiReviewResult);
                      alert("Taqriz nusxalandi!");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
                  >
                    Nusxa olish
                  </button>
                </div>
                <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {aiReviewResult}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs dark:shadow-xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              Amaldagi Davlat Granti
            </h3>
            <div className="p-4 rounded-xl bg-linear-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30 space-y-3">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-600 text-white">
                FZ-2025-089 Fundamental Grant
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                "Kvant kompyuterlari uchun yarimoʻtkazgich kubitlar nazariyasini rivojlantirish"
              </h4>
              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Mablagʻ: <strong>1.4 mlrd soʻm / 3 yil</strong></p>
                <p>Ijrochilar: <strong>8 nafar professor va doktorantlar</strong></p>
                <p>Oraliq hisobot: <strong>Noyabr, 2026</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
