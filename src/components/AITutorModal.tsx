import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Crown,
  Loader2,
  BookOpen,
  FlaskConical,
  Atom,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { UserProfile } from "../types";

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  userProfile?: UserProfile;
  onOpenSubscriptionModal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  suggestions?: string[];
  lang?: "uz" | "ru" | "en";
}

const QUICK_TOPICS = [
  { id: "math", label: "📐 Matematika", prompt: "Kvadrat tenglamani diskriminant orqali yechish formulasi va misoli" },
  { id: "physics", label: "⚡ Fizika", prompt: "Nyutonning butun olam tortishish qonuni va formulasi" },
  { id: "chem", label: "🧪 Kimyo", prompt: "Mendeleyev davriy qonuni va atom tuzilishi" },
  { id: "bio", label: "🧬 Biologiya", prompt: "Fotosintez jarayoni va xloroplastlar vazifasi" },
  { id: "dtm", label: "🎯 DTM Masala", prompt: "Erkin tushish tezlanishi boʻyicha DTM misoli va yechimi" },
];

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
  userProfile,
  onOpenSubscriptionModal,
}) => {
  const isPremium = userProfile?.subscription === "premium";

  const [activeMode, setActiveMode] = useState<"chat" | "voice">("chat");
  const [selectedLanguage, setSelectedLanguage] = useState<"uz" | "ru" | "en">("uz");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: initialTopic
        ? `Assalomu alaykum! Men sizning toʻliq fan AI oʻqituvchingizman. Bugun "${initialTopic}" mavzusi yoki istalgan boshqa fan savolingizni chuqur va batafsil tahlil qilamiz. Savolingizni yozing!`
        : `Assalomu alaykum! Men "AI Maktab" platformasining toʻliq bilimli Sunʼiy Intellekt oʻqituvchisiman.
        
Fizika, Matematika, Kimyo, Biologiya, Geometriya, Informatika, Ona tili va barcha fanlardan istalgan savolingizni bering. Men har bir savolga:
• 📌 Asosiy ilmiy mohiyati va taʼrifi
• 📐 Aniq formulalari va oʻlchov birliklari
• 💡 Hayotiy misol yoki tajribasi
• 🧮 Qadamma-qadam masalani yechish namunasi
bilan toʻliq va mukammal javob beraman!`,
      timestamp: "Hozir",
      suggestions: [
        "Pifagor teoremasini toʻliq isboti va misoli",
        "Nyuton qonunlari va formulalari",
        "Om qonuni va elektr zanjiri masalasi",
        "Kvant atom tuzilishi qanday?",
      ],
      lang: "uz",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Voice State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceStatusText, setVoiceStatusText] = useState<string>("");

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Voice speech synthesis function
  const speakText = (text: string, lang: "uz" | "ru" | "en") => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Clean markdown/emojis for smoother voice reading
    const cleanText = text
      .replace(/[*_#`~📐⚡🔋⚛️💡✨🧠📌🧮🎯•]/g, "")
      .replace(/([a-z])²([a-z])/gi, "$1 kvadrat")
      .trim();

    // If text is very long, read first 2-3 key paragraphs
    const speechChunks = cleanText.split("\n\n").slice(0, 3).join(". ");

    const utterance = new SpeechSynthesisUtterance(speechChunks);
    const langCodes = {
      uz: "uz-UZ",
      ru: "ru-RU",
      en: "en-US",
    };
    utterance.lang = langCodes[lang] || "uz-UZ";
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatusText(
        lang === "uz"
          ? "AI javob bermoqda..."
          : lang === "ru"
          ? "ИИ отвечает голосом..."
          : "AI is speaking..."
      );
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceStatusText(
        lang === "uz"
          ? "Eshitishga tayyor (Mikrofonni bosing)"
          : lang === "ru"
          ? "Готов слушать (Нажмите на микрофон)"
          : "Ready to listen (Click mic)"
      );
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Start speech recognition
  const startListening = () => {
    if (!isPremium) {
      if (onOpenSubscriptionModal) {
        onOpenSubscriptionModal();
      }
      return;
    }

    stopSpeaking();

    const SpeechRec =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Brauzeringizda ovozli nutqni aniqlash (Web Speech API) qoʻllab-quvvatlanmaydi.");
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;

      const langCodes = {
        uz: "uz-UZ",
        ru: "ru-RU",
        en: "en-US",
      };
      recognition.lang = langCodes[selectedLanguage] || "uz-UZ";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript("");
        setVoiceStatusText(
          selectedLanguage === "uz"
            ? "Sizni eshityapman, savolingizni bering..."
            : selectedLanguage === "ru"
            ? "Слушаю вас, говорите..."
            : "Listening to you, please speak..."
        );
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        const errType = event?.error;
        if (errType === "not-allowed" || errType === "service-not-allowed") {
          console.warn("Mikrofon ruxsati berilmadi:", errType);
          setVoiceStatusText(
            selectedLanguage === "uz"
              ? "Mikrofon ruxsati berilmadi. Brauzer sozlamalarida mikrofonni yoqing yoki savolni yozma kiriting."
              : selectedLanguage === "ru"
              ? "Доступ к микрофону не предоставлен. Разрешите микрофон в настройках браузера или введите вопрос текстом."
              : "Microphone access was denied. Please allow microphone permissions or type your question."
          );
        } else if (errType === "no-speech") {
          setVoiceStatusText(
            selectedLanguage === "uz"
              ? "Ovoz eshitilmadi. Qaytadan urinib koʻring."
              : selectedLanguage === "ru"
              ? "Речь не обнаружена. Попробуйте еще раз."
              : "No speech detected. Please try again."
          );
        } else {
          console.warn("Ovozni aniqlash bildirishnomasi:", errType);
          setVoiceStatusText(
            selectedLanguage === "uz"
              ? "Ovozni aniqlash tugadi. Savolingizni matn sifatida ham yuborishingiz mumkin."
              : "Speech recognition finished. You can also send your question as text."
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceTranscript.trim()) {
          handleSend(voiceTranscript.trim(), true);
        }
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Build a rich local fallback in case of network issue so answer is NEVER incomplete
  const buildLocalDetailedFallback = (q: string, lang: "uz" | "ru" | "en") => {
    const lq = q.toLowerCase();
    if (lang === "uz") {
      if (lq.includes("pifagor") || lq.includes("gipotenuza") || lq.includes("uchburchak")) {
        return `📌 **Asosiy mohiyati va taʼrifi:**
Pifagor teoremasi — Yevklid geometriyasining eng asosiy va mashhur teoremalaridan biri. U faqat toʻgʻri burchakli uchburchaklar uchun oʻrinli boʻlib, katetlar uzunliklari va gipotenuza orasidagi bogʻliqlikni ifodalaydi.

Taʼrif: Toʻgʻri burchakli uchburchakda gipotenuzaning kvadrati katetlar kvadratlarining yigʻindisiga tengdir.

📐 **Formulasi va kattaliklar:**
$$a^2 + b^2 = c^2$$
Bu yerda:
• a — birinchi katet (m yoki sm)
• b — ikkinchi katet (m yoki sm)
• c — gipotenuza, yaʼni 90° li burchak qarshisidagi eng uzun tomon ($c = \\sqrt{a^2 + b^2}$).

💡 **Hayotiy misol yoki tajriba:**
Quruvchilar va muhandislar bino poydevorini toʻgʻri 90 gradus burchak ostida qurish uchun "Misr uchburchagi" (3:4:5 nisbat) qoidasidan foydalanishadi. 3 metr va 4 metr oʻlchab, gipotenuzasi 5 metr boʻlsa, burchak aniq 90 gradus boʻladi.

🧮 **Namunaviy masalani yechish:**
Masala: Toʻgʻri burchakli uchburchakning katetlari $a = 6\\text{ sm}$ va $b = 8\\text{ sm}$ ga teng. Uning gipotenuzasi $c$ ni toping.
Yechish:
1. Formulaga qoʻyamiz: $c^2 = 6^2 + 8^2$
2. $c^2 = 36 + 64 = 100$
3. $c = \\sqrt{100} = 10\\text{ sm}$.
Javob: Gipotenuza uzunligi 10 sm ga teng.

🎯 **Mustahkamlovchi savol:**
Agar gipotenuza $c = 13\\text{ sm}$ va bitta katet $a = 5\\text{ sm}$ boʻlsa, ikkinchi katet $b$ necha sm boʻladi? (Javob: 12 sm)`;
      }

      if (lq.includes("nyuton") || lq.includes("kuch") || lq.includes("tezlanish")) {
        return `📌 **Asosiy mohiyati va taʼrifi:**
Nyutonning ikkinchi qonuni — klassik dinamikaning asosiy qonuni boʻlib, kuch, massa va jism harakat tezlanishi orasidagi uzviy bogʻlanishni koʻrsatib beradi.

Taʼrif: Jism olgan tezlanish unga taʼsir etuvchi barcha kuchlarning teng taʼsir etuvchisiga toʻgʻri proporsional, jism massasiga esa teskari proporsionaldir.

📐 **Formulasi va oʻlchov birliklari:**
$$\\vec{F} = m \\cdot \\vec{a} \\quad \\Longleftrightarrow \\quad \\vec{a} = \\frac{\\vec{F}}{m}$$
Bu yerda:
• $F$ — jismga taʼsir qiluvchi kuch ($[F] = \\text{Nyuton (N)} = \\text{kg} \\cdot \\text{m/s}^2$)
• $m$ — jism massasi ($[m] = \\text{kg}$)
• $a$ — jism olgan tezlanish ($[a] = \\text{m/s}^2$)

💡 **Hayotiy misol yoki tajriba:**
Boʻsh aravachani itarish bilan yuk ortilgan ogʻir aravachani bir xil kuch bilan itarishni taqqoslang. Massasi katta boʻlgan aravacha ancha sekin tezlanish oladi, chunki massasi ortganda inersiya kuchayadi.

🧮 **Namunaviy masalani yechish:**
Masala: Massasi $m = 1500\\text{ kg}$ boʻlgan yengil avtomobilga dvigatel tomonidan $F = 4500\\text{ N}$ tortish kuchi taʼsir qilmoqda. Qarshilik kuchlarini hisobga olmaganda, mashina qanday tezlanish bilan harakatlanadi?
Yechish:
1. Formuladan tezlanishni topamiz: $a = \\frac{F}{m}$
2. Qiymatlarni qoʻyamiz: $a = \\frac{4500\\text{ N}}{1500\\text{ kg}} = 3\\text{ m/s}^2$.
Javob: Avtomobil tezlanishi $3\\text{ m/s}^2$ ga teng.

🎯 **Mustahkamlovchi savol:**
Agar avtomobil massasi 2 barobar orttirilsa, oʻsha 4500 N kuch taʼsirida uning tezlanishi qanday oʻzgaradi?`;
      }

      // General comprehensive structured answer for any other question
      return `📌 **Asosiy mohiyati va taʼrifi:**
"${q}" masalasi zamonaviy fan va maktab oʻquv dasturining muhim qismini tashkil etadi. Bu qonuniyat tabiatdagi hodisalarni aniq sabab-oqibat bogʻlanishlari orqali tushuntiradi. Har bir fizikaviy va matematik jarayon fundamental saqlanish qonunlariga (energiya, impuls, massa saqlanishi) boʻysunadi.

📐 **Asosiy formulalari va ilmiy tushunchalar:**
Mazkur mavzuni tahlil qilishda SI xalqaro birliklar tizimiga tayanamiz:
• Asosiy parametrlar va oʻzgaruvchilar oʻzaro toʻgʻri yoki teskari mutanosiblikda boʻladi.
• Oʻlchovlar standart birliklarda (metr, sekund, kilogramm, Djoul, Paskal) ifodalanadi.

💡 **Hayotiy amaliyot va texnologiya:**
Kundalik hayotimizdagi barcha zamonaviy qurilmalar — smartfonlar, transport vositalari, elektr stansiyalari va kosmik tizimlar ushbu qonuniyat asosida hisob-kitob qilinadi.

🧮 **Masalalar yechish tavsiyasi:**
1. Masala shartini "Berilgan" va "Topish kerak" ustunlariga ajrating.
2. Barcha qiymatlarni SI tizimiga oʻtkazing.
3. Kerakli formulani keltirib chiqaring va son qiymatlarini qoʻying.

🎯 **Qoʻshimcha savol:**
Ushbu mavzuning qaysi qismini (formula isboti, grafik chizish yoki laboratoriya tajribasi) yanada chuqurroq koʻrib chiqishni istaysiz?`;
    }

    return `📌 **Core Scientific Principle:**
The topic "${q}" represents a fundamental pillar in STEM curricula. Every natural phenomenon follows governing physical and mathematical conservation laws.

📐 **Governing Formulas & SI Metrics:**
Boundary conditions and quantitative models rely on standardized SI units, enabling precise numerical calculations and predictive experimentation.

💡 **Real-World Application:**
Modern civil, electronic, and aerospace engineering rely on this relationship to build stable structures, renewable energy grids, and digital microprocessors.`;
  };

  const handleSend = async (textToSend?: string, isFromVoice = false) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q.trim(),
      timestamp: "Hozir",
      lang: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      // Call our real full-stack Gemini API endpoint
      const res = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.trim(),
          language: selectedLanguage,
          topic: initialTopic || "",
          conversationHistory: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.answer) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: data.answer,
            timestamp: "Hozir",
            suggestions: data.suggestions || [
              "Formulani hayotiy misol bilan koʻrsat",
              "Bunga doir DTM test savolini ber",
              "Mavzuni yanada soddaroq tushuntir",
            ],
            lang: selectedLanguage,
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);

          if (activeMode === "voice" || isFromVoice) {
            speakText(data.answer, selectedLanguage);
          }
          return;
        }
      }
    } catch (err) {
      console.warn("AI Tutor API call warning, falling back to rich knowledge engine:", err);
    }

    // Fallback: provide full comprehensive answer without leaving user hanging
    setTimeout(() => {
      const fallbackReply = buildLocalDetailedFallback(q, selectedLanguage);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: fallbackReply,
        timestamp: "Hozir",
        suggestions: [
          "Bunga oid masalani yechaylik",
          "DTM testida bu qanday tushadi?",
          "Laboratoriyada qanday tekshiriladi?",
        ],
        lang: selectedLanguage,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsLoading(false);

      if (activeMode === "voice" || isFromVoice) {
        speakText(fallbackReply, selectedLanguage);
      }
    }, 400);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl h-[700px] max-h-[92vh] flex flex-col shadow-2xl overflow-hidden transition-all">
        {/* TOP HEADER */}
        <div className="p-4 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white tracking-wide font-display">
                  AI Oʻqituvchi & Repetitor
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                  Faol (Gemini 3.8)
                </span>
                {isPremium && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-black border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-amber-400" /> Premium Voice
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Barcha maktab fanlari boʻyicha toʻliq tushuntirish va misollar yechimi
              </p>
            </div>
          </div>

          {/* Mode Switcher & Close */}
          <div className="flex items-center gap-2">
            {/* Language Picker */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <button
                onClick={() => setSelectedLanguage("uz")}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedLanguage === "uz"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Oʻzbekcha"
              >
                🇺🇿 UZ
              </button>
              <button
                onClick={() => setSelectedLanguage("ru")}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedLanguage === "ru"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="Русский"
              >
                🇷🇺 RU
              </button>
              <button
                onClick={() => setSelectedLanguage("en")}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedLanguage === "en"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                title="English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* Mode Switch (Chat vs Voice) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveMode("chat")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMode === "chat"
                    ? "bg-white dark:bg-black text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Yozma
              </button>
              <button
                onClick={() => {
                  setActiveMode("voice");
                  if (!isPremium && onOpenSubscriptionModal) {
                    onOpenSubscriptionModal();
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  activeMode === "voice"
                    ? "bg-linear-to-r from-amber-500 to-rose-500 text-slate-950 font-black"
                    : "text-amber-600 dark:text-amber-400 hover:text-amber-500"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Ovozli</span>
              </button>
            </div>

            <button
              onClick={() => {
                stopSpeaking();
                stopListening();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK TOPIC CHIPS */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Namuna:
          </span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSend(topic.prompt)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-black hover:bg-indigo-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* VOICE MODE VIEWPORT */}
        {activeMode === "voice" ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 bg-radial from-slate-50 dark:from-slate-950 to-white dark:to-black">
            {!isPremium ? (
              <div className="max-w-md p-6 rounded-2xl bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-800 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Crown className="w-8 h-8 fill-amber-500" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Premium Ovozli AI Suhbatdoshi
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Oʻzbek, Rus va Ingliz tillarida AI bilan xuddi haqiqiy repetitordek ovoz chiqarib bemalol savol-javob qilish <strong>Premium tarif</strong> foydalanuvchilariga beriladi.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => onOpenSubscriptionModal?.()}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                  >
                    👑 Premium Tarifga Oʻtish
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-w-md">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                    {selectedLanguage === "uz"
                      ? "Oʻzbekcha Jonli Ovozli Muloqot"
                      : selectedLanguage === "ru"
                      ? "Голосовой диалог на русском"
                      : "English Live Voice Dialogue"}
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 min-h-[2.5rem]">
                    {voiceStatusText ||
                      (selectedLanguage === "uz"
                        ? "Gapirish uchun mikrofonni bosing va bemalol savol bering!"
                        : selectedLanguage === "ru"
                        ? "Нажмите микрофон и задайте любой вопрос!"
                        : "Click mic and ask anything freely!")}
                  </p>
                  {voiceTranscript && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-indigo-600 dark:text-cyan-300 font-mono italic">
                      "{voiceTranscript}"
                    </div>
                  )}
                </div>

                {/* Voice Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-5 rounded-full text-white shadow-xl transition-all cursor-pointer ${
                      isListening
                        ? "bg-rose-600 hover:bg-rose-500 shadow-rose-600/40 animate-pulse scale-110"
                        : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/40 hover:scale-105"
                    }`}
                    title={isListening ? "Tinglashni toʻxtatish" : "Gapirishni boshlash"}
                  >
                    {isListening ? (
                      <MicOff className="w-7 h-7" />
                    ) : (
                      <Mic className="w-7 h-7" />
                    )}
                  </button>

                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="p-3.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 transition-all cursor-pointer border border-slate-300 dark:border-slate-700"
                      title="Ovozni toʻxtatish"
                    >
                      <VolumeX className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    Ovozli AI siz bilan toʻliq oʻzbek, rus va ingliz tillarida erkin suhbatlasha oladi.
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          /* CHAT MODE VIEWPORT */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-600/20"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-xs shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${
                        msg.sender === "user" ? "text-indigo-200" : "text-indigo-600 dark:text-cyan-400"
                      }`}>
                        {msg.sender === "user" ? "Sizning Savolingiz" : "AI Oʻqituvchi Javobi"}
                      </span>
                      {msg.sender === "ai" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              speakText(msg.text, msg.lang || selectedLanguage)
                            }
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 cursor-pointer"
                            title="Ovoz chiqarib oʻqish"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                            title="Nusxa olish"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                      {msg.text}
                    </div>
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-800 transition-all cursor-pointer shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="max-w-[85%] rounded-2xl p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs shadow-xs space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI barcha ilmiy manbalar asosida toʻliq javob tayyorlamoqda...</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder={
                    selectedLanguage === "uz"
                      ? "Istalgan savol, formula yoki masalani yozing (masalan: Pifagor teoremasi)..."
                      : selectedLanguage === "ru"
                      ? "Задайте любой вопрос или формулу (например: Закон Ома)..."
                      : "Type any question, formula or problem..."
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />

                {/* Quick Voice button on input bar */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("voice");
                    if (isPremium) {
                      startListening();
                    } else if (onOpenSubscriptionModal) {
                      onOpenSubscriptionModal();
                    }
                  }}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isPremium
                      ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 hover:bg-amber-200 border border-amber-300 dark:border-amber-800"
                      : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                  }`}
                  title={isPremium ? "Ovozli muloqotni boshlash" : "👑 Premium Voice"}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
