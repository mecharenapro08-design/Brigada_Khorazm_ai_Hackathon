import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  FlaskConical,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ChevronRight,
  Check,
} from "lucide-react";
import confetti from "canvas-confetti";
import { LessonChapter, SubjectModule } from "../types";

interface InteractiveReaderProps {
  chapter: LessonChapter;
  module: SubjectModule;
  onBack: () => void;
  onOpenLab: (simulationType?: string) => void;
  onOpenAITutorWithTopic: (topic: string) => void;
  onCompleteChapter: (chapterId: string, earnedXP: number, earnedCoins: number) => void;
  isAlreadyCompleted: boolean;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  chapter,
  module,
  onBack,
  onOpenLab,
  onOpenAITutorWithTopic,
  onCompleteChapter,
  isAlreadyCompleted,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const [formulaInputs, setFormulaInputs] = useState<Record<string, number>>({
    a: 3,
    b: 4,
    u: 12,
    r: 4,
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [earnedReward, setEarnedReward] = useState<boolean>(isAlreadyCompleted);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [chapter.id]);

  const toggleAudioNarration = () => {
    if (!("speechSynthesis" in window)) {
      alert("Kechirasiz, brauzeringiz ovozli oʻqishni qoʻllab-quvvatlamaydi.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${chapter.title}. ${chapter.summary}. ${chapter.contentSections
        .map((s) => `${s.title}. ${s.body}`)
        .join(". ")}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = "uz-UZ";

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);

    const totalQuestions = chapter.quiz.length;
    let correctCount = 0;
    chapter.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const isPassed = correctCount === totalQuestions;
    if (isPassed && !earnedReward) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setEarnedReward(true);
      onCompleteChapter(chapter.id, chapter.xpReward, chapter.coinsReward);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const pythA = formulaInputs.a || 3;
  const pythB = formulaInputs.b || 4;
  const pythC = Math.sqrt(pythA * pythA + pythB * pythB).toFixed(2);

  const ohmU = formulaInputs.u || 12;
  const ohmR = formulaInputs.r || 4;
  const ohmI = (ohmU / (ohmR || 1)).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button
          id="reader-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mavzular roʻyxatiga qaytish</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            id="reader-tts-btn"
            onClick={toggleAudioNarration}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all shadow-xs ${
              isPlayingAudio
                ? "bg-amber-950/80 text-amber-300 border border-amber-700 animate-pulse"
                : "bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800"
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">
              {isPlayingAudio ? "Ovozni toʻxtatish" : "Ovozli eshitish (TTS)"}
            </span>
          </button>

          <button
            id="reader-ask-ai-btn"
            onClick={() => onOpenAITutorWithTopic(chapter.title)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium shadow-md shadow-indigo-600/30 transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>AI Maktab bilan tahlil</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 font-semibold border border-indigo-800/80">
            {module.title}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {chapter.durationMinutes} daqiqa
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Award className="w-3.5 h-3.5" />+{chapter.xpReward} XP
          </span>
          {earnedReward && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/80">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Oʻzlashtirildi
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          {chapter.title}
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          {chapter.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Anʼanaviy qogʻoz darslik muammosi:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {chapter.traditionalVsDigital.traditional}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI Maktab raqamli innovatsiyasi:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {chapter.traditionalVsDigital.smartEdu}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {chapter.contentSections.map((section, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white font-display">
              {section.title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {section.body}
            </p>

            {section.analogy && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-slate-200 text-xs sm:text-sm space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Hayotiy oʻxshatish (Analogiya):</span>
                </div>
                <p className="leading-relaxed text-indigo-200 font-medium">
                  {section.analogy}
                </p>
              </div>
            )}

            {section.interactiveWidget === "formula_calculator" && (
              <div className="mt-4 p-5 rounded-xl bg-slate-900 text-white space-y-4 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Interaktiv Formula Hisoblagichi
                  </span>
                  <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-md text-slate-200">
                    {section.widgetData?.formulaName}
                  </span>
                </div>

                {chapter.id === "pythagoras" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">Katet a:</span>
                          <span className="font-bold text-cyan-400">{pythA} sm</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={15}
                          value={pythA}
                          onChange={(e) =>
                            setFormulaInputs((prev) => ({ ...prev, a: Number(e.target.value) }))
                          }
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">Katet b:</span>
                          <span className="font-bold text-cyan-400">{pythB} sm</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={15}
                          value={pythB}
                          onChange={(e) =>
                            setFormulaInputs((prev) => ({ ...prev, b: Number(e.target.value) }))
                          }
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <p className="text-xs text-slate-400">Natija (Gipotenuza c):</p>
                        <p className="text-xl font-extrabold text-amber-300 font-mono">
                          c = √({pythA}² + {pythB}²) = √({pythA * pythA + pythB * pythB}) = {pythC} sm
                        </p>
                      </div>
                      <div className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        c² = a² + b² ({pythA * pythA} + {pythB * pythB} = {pythA * pythA + pythB * pythB})
                      </div>
                    </div>
                  </div>
                )}

                {chapter.id === "ohm-law" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">Kuchlanish (U):</span>
                          <span className="font-bold text-amber-400">{ohmU} Volt</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={48}
                          value={ohmU}
                          onChange={(e) =>
                            setFormulaInputs((prev) => ({ ...prev, u: Number(e.target.value) }))
                          }
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">Qarshilik (R):</span>
                          <span className="font-bold text-indigo-400">{ohmR} Om</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={30}
                          value={ohmR}
                          onChange={(e) =>
                            setFormulaInputs((prev) => ({ ...prev, r: Number(e.target.value) }))
                          }
                          className="w-full accent-indigo-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <p className="text-xs text-slate-400">Tok kuchi (I = U / R):</p>
                        <p className="text-xl font-extrabold text-cyan-300 font-mono">
                          I = {ohmU} V / {ohmR} Ω = {ohmI} Amper
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-300">Lampa yorugʻligi:</span>
                        <div
                          className="w-6 h-6 rounded-full border border-amber-400/80 transition-all shadow-md"
                          style={{
                            backgroundColor: `rgba(251, 191, 36, ${Math.min(1, Math.max(0.1, Number(ohmI) / 5))})`,
                            boxShadow: `0 0 ${Math.min(30, Number(ohmI) * 8)}px rgba(251, 191, 36, 0.8)`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {chapter.simulation && (
        <div className="p-6 rounded-2xl bg-linear-to-r from-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-500/20 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <FlaskConical className="w-4 h-4" />
              <span>Interaktiv Laboratoriya Mavjud</span>
            </div>
            <h3 className="text-lg font-bold font-display">{chapter.simulation.title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {chapter.simulation.description}
            </p>
          </div>

          <button
            id="reader-open-simulation-btn"
            onClick={() => onOpenLab(chapter.simulation?.type)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all whitespace-nowrap active:scale-95"
          >
            Tajribani boshlash
          </button>
        </div>
      )}

      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Geymifikatsiyalangan Sinov
            </span>
            <h3 className="text-xl font-bold text-white font-display">
              Bilimingizni sinab, XP va Tangalarni yutib oling!
            </h3>
          </div>
          <div className="flex items-center gap-1 text-amber-300 font-bold text-sm bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-700/80">
            <Award className="w-4 h-4 text-amber-400" />
            <span>+{chapter.xpReward} XP</span>
          </div>
        </div>

        <div className="space-y-6">
          {chapter.quiz.map((q, qIndex) => {
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                id={`quiz-question-card-${q.id}`}
                className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm sm:text-base font-semibold text-white">
                    <span className="text-indigo-400 mr-2">{qIndex + 1}-savol.</span>
                    {q.question}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                    {q.xp} XP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((option, optIdx) => {
                    const isSelected = chosen === optIdx;
                    let optionStyle =
                      "bg-slate-900 border-slate-800 hover:border-indigo-500 text-slate-200";

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        optionStyle =
                          "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500";
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          "bg-rose-950/80 border-rose-500 text-rose-300 line-through ring-1 ring-rose-500";
                      } else {
                        optionStyle = "bg-slate-950 border-slate-850 text-slate-500 opacity-50";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "bg-indigo-950/90 border-indigo-500 text-white font-semibold ring-2 ring-indigo-500/30";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between gap-2 ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && optIdx === q.correctIndex && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div
                    className={`mt-2 p-3 rounded-xl text-xs flex items-start gap-2 ${
                      isCorrect
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800"
                        : "bg-amber-950/60 text-amber-300 border border-amber-800"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold">
                        {isCorrect ? "Barakalla! " : "Izoh: "}
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {!quizSubmitted ? (
              <span>
                Tanlangan javoblar: {Object.keys(selectedAnswers).length} / {chapter.quiz.length}
              </span>
            ) : (
              <span className="font-semibold text-indigo-400">
                Test tekshirildi! Barcha savollarni toʻgʻri yechsangiz, toʻliq mukofot beriladi.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {quizSubmitted ? (
              <button
                id="quiz-retry-btn"
                onClick={handleResetQuiz}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta urinish</span>
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                disabled={Object.keys(selectedAnswers).length < chapter.quiz.length}
                onClick={handleSubmitQuiz}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 w-full sm:w-auto active:scale-95 disabled:pointer-events-none"
              >
                <span>Javoblarni tekshirish</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
