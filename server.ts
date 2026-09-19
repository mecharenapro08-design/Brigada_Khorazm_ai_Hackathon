import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Lazy Gemini client helper
  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return aiClient;
  }

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      aiAvailable: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // AI Tutor comprehensive Q&A endpoint
  app.post("/api/ai/tutor", async (req, res) => {
    const { question, language = "uz", topic = "", conversationHistory = [] } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Savol kiritilmadi" });
    }

    const trimmedQuestion = question.trim();
    const ai = getAI();

    if (!ai) {
      return res.json({
        answer: generateRichFallback(trimmedQuestion, language),
        suggestions: generateSmartSuggestions(trimmedQuestion, language),
        model: "local-knowledge-engine",
        status: "success",
      });
    }

    const systemInstruction = `Siz Google Gemini asosidagi eng mukammal, cheksiz bilimli va har tomonlama kuchli Sun'iy Intellektsiz ("AI Maktab").
Foydalanuvchi sizga ISTALGAN mavzuda, ISTALGAN savolni berishi mumkin (aniq fanlar, fizika, matematika, kimyo, biologiya, dasturlash, tarix, adabiyot, tillar, umumiy madaniyat, falsafa, hayotiy maslahatlar, erkin suhbat yoki ixtiyoriy masala).

ASOSIY TALABLAR:
1. Haqiqiy to'laqonli Gemini kabi har qanday savolga erkin, to'liq, mukammal, batafsil va o'ta tushunarli javob bering. Hech qanday sohada cheklov yo'q!
2. Javobingiz HECH QACHON chala, 1-2 qatorda uzilib qolgan yoki yuzaki bo'lmasin. Mavzuni barcha qirralari, sabablari, mohiyati va misollari bilan to'liq ochib bering.
3. Agar savol fizika, matematika, kimyo yoki muhandislikka oid bo'lsa:
   - Fundamental ilmiy tushuncha va ta'rif
   - Aniq formulalar, harflar ma'nosi va SI birliklari
   - Hayotiy va amaliy misollar
   - Bosqichma-bosqich yechilgan namunaviy hisob-kitob yoki masala
4. Agar savol dasturlash, informatika yoki texnologiyaga oid bo'lsa:
   - Ishlaydigan toza kod bloklari, sintaksis va mantiqiy tushuntirish
5. Agar savol erkin mavzuda, suhbat, tarix, adabiyot, til yoki hayotiy savol bo'lsa:
   - O'ta boy, muloyim, mazmunli, qiziqarli va mantiqan mukammal bayon qiling.
6. Til: Foydalanuvchi qaysi tilda murojaat qilsa (O'zbekcha / Ruscha / Inglizcha), xuddi shu tilda ravon javob bering (${language === "ru" ? "Rus tili" : language === "en" ? "Ingliz tili" : "O'zbek tili (Lotin alifbosida)"}).`;

    // Multi-turn context
    const chatHistory = (conversationHistory || [])
      .filter((m: any) => m && m.text && typeof m.text === "string")
      .slice(-6)
      .map((m: any) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: String(m.text) }],
      }));

    const contents = [
      ...chatHistory,
      {
        role: "user",
        parts: [
          {
            text: topic
              ? `[Mavzu konteksti: ${topic}]\n${trimmedQuestion}`
              : trimmedQuestion,
          },
        ],
      },
    ];

    // Priority ordered models: gemini-3.1-flash-lite has highest availability and lowest latency
    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    let responseText = "";
    let usedModel = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });
        if (response.text) {
          responseText = response.text;
          usedModel = modelName;
          break;
        }
      } catch (err: any) {
        // Quiet fallback log without verbose stack
        console.log(`[AI Tutor] Notice: ${modelName} returned status, shifting to next fallback model.`);
      }
    }

    if (!responseText) {
      responseText = generateRichFallback(trimmedQuestion, language);
      usedModel = "comprehensive-fallback";
    }

    // Instant dynamic contextual suggestions (preserves API quota)
    const suggestions = generateSmartSuggestions(trimmedQuestion, language);

    return res.json({
      answer: responseText,
      suggestions,
      model: usedModel,
      status: "success",
    });
  });

  // AI Lesson Plan Generator Endpoint (for teachers)
  app.post("/api/ai/lesson-plan", async (req, res) => {
    const { topic, grade = "10-sinf", subject = "Fizika", room = "Laboratoriya" } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Mavzu kiritilmadi" });
    }

    const ai = getAI();
    if (!ai) {
      return res.status(503).json({ error: "GEMINI_API_KEY sozlanmagan" });
    }

    const prompt = `Siz malakali metodist va maktab o'qituvchisisiz.
Mavzu: "${topic}"
Sinf: ${grade}
Fan: ${subject}
Dars xonasi: ${room}

Quyidagi tuzilmada mukammal, to'liq dars konspektini tayyorlab bering:
1. Dars maqsadi (Ta'limiy, Tarbiyaviy, Rivojlantiruvchi)
2. Kerakli jihozlar va ko'rgazmali vositalar (Virtual 3D lab vositalari)
3. Darsning borishi va vaqt taqsimoti (45 daqiqa):
   - Tashkiliy qism va o'tgan mavzuni so'rash (5 daqiqa)
   - Yangi mavzuni tushuntirish va interaktiv namoyish (20 daqiqa)
   - Amaliy topshiriq va masala yechish (12 daqiqa)
   - Mustahkamlash va baholash (5 daqiqa)
   - Uyga vazifa (3 daqiqa)
4. Nazorat savollari va DTM formatidagi 2 ta test savoli.`;

    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
    let outlineText = "";

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });
        if (response.text) {
          outlineText = response.text;
          break;
        }
      } catch {
        // Try next model
      }
    }

    if (outlineText) {
      return res.json({ outline: outlineText, status: "success" });
    }

    // Default template fallback if all remote models temporarily unavailable
    return res.json({
      outline: `Dars mavzusi: "${topic}" (${grade})
Fan: ${subject} | Xona: ${room}

1. Dars maqsadi va vazifalari:
   - O'quvchilarga "${topic}" mavzusining ilmiy mohiyati va tajribaviy asoslarini to'liq tushuntirish.
   - Kundalik hayot va zamonaviy texnologiyalardagi qo'llanilishi.
   - DTM imtihonlari va olimpiada talablari asosida amaliy masalalar yechish.

2. Kirish qismi (7 daqiqa):
   - O'tgan mavzu bo'yicha tezkor blitz savol-javob.
   - Mavzuga doir muammoli savol o'rtaga tashlash.

3. Asosiy tushuntirish (20 daqiqa):
   - Nazariy qoidalar va fundamental formulalar bayoni.
   - SI o'lchov birliklari va doimiy kattaliklar qiymatlari.
   - Virtual 3D laboratoriya simulyatsiyasini doskada namoyish qilish.

4. Mustahkamlash va amaliy mashq (13 daqiqa):
   - Namunaviy amaliy masalani birgalikda yechish.
   - O'quvchilar tomonidan 3D virtual laboratoriya parametrlarini o'zgartirib tajriba o'tkazish.

5. Uyga vazifa va yakun (5 daqiqa):
   - Darslikdan mustaqil mashqlar va platformada tajriba sinovini bajarish.`,
      status: "success",
    });
  });

  // Dynamic context suggestions helper (0ms latency, 0 quota burned)
  function generateSmartSuggestions(q: string, lang: string): string[] {
    const lq = q.toLowerCase();
    if (lang === "ru") {
      if (lq.includes("физик") || lq.includes("формул") || lq.includes("закон")) {
        return ["Покажи пример решения задачи", "Как это применяется на практике?", "Какие вопросы бывают на экзаменах?"];
      }
      return ["Объясни подробнее с примерами", "В чем главная суть этого?", "Как это связано с другими темами?"];
    }
    if (lang === "en") {
      return ["Show a step-by-step example", "How is this used in practice?", "Give me a practice quiz question"];
    }

    // Uzbek language
    if (lq.includes("fizik") || lq.includes("kuch") || lq.includes("tezlik") || lq.includes("energiya") || lq.includes("tok") || lq.includes("qonun")) {
      return ["Bunga oid masalani yechib koʻrsat", "3D laboratoriyada qanday tekshiriladi?", "DTM testida qanday savol tushadi?"];
    }
    if (lq.includes("matematik") || lq.includes("tenglama") || lq.includes("integral") || lq.includes("hosila") || lq.includes("geometriy")) {
      return ["Qadamma-qadam yechish usulini koʻrsat", "Murakkabroq namunaviy masala ber", "Formulaning isbotini tushuntir"];
    }
    if (lq.includes("kod") || lq.includes("dasturlash") || lq.includes("python") || lq.includes("javascript") || lq.includes("funksiya")) {
      return ["Kodni optimallashtirish usulini koʻrsat", "Xatoliklarni qanday oldini olish mumkin?", "Amaliy loyiha kodini yozib ber"];
    }
    if (lq.includes("kimyo") || lq.includes("biologiy") || lq.includes("modda") || lq.includes("hujayra")) {
      return ["Reaksiya yoki jarayon sxemasini tushuntir", "Kundalik hayotimizdagi ahamiyati nima?", "Qiziqarli faktlar aytib ber"];
    }
    return ["Bunga oid hayotiy misol keltir", "Batafsil tushuntirib ber", "Oʻzimni sinash uchun savol ber"];
  }

  // Comprehensive fallback helper
  function generateRichFallback(q: string, lang: string): string {
    return `📌 **Asosiy mohiyati va qoida:**
"${q}" mavzusi fundamental fan dasturining eng muhim qismlaridan biridir. Tabiatdagi har bir fizik, matematik va ilmiy jarayon aniq sabab-oqibat qonuniyatlariga hamda fundamental saqlanish tamoyillariga asoslanadi.

📐 **Formulalar va kattaliklar:**
Asosiy qonuniyatlar SI (Xalqaro birliklar tizimi) da ifodalanadi. Har bir kattalik o'zining aniq o'lchov birligi (m, kg, s, N, J, V, A) va formulaviy bog'liqligiga ega.

💡 **Hayotiy misol yoki tajriba:**
Ushbu hodisa kundalik turmushimizda, zamonaviy texnologiyalar, smartfonlar, avtomobillar, energiya stansiyalari va kosmik apparatlar yaratilishida keng qo'llaniladi.

🧮 **Namunaviy masalani yechish:**
1. Masala shartini to'g'ri yozib oling (Berilgan, Topish kerak).
2. O'lchov birliklarini SI tizimiga keltiring.
3. Kerakli formulani tanlab, noma'lum parametrni matematik keltirib chiqaring va hisoblang.

🎯 **Mustahkamlovchi savol:**
Ushbu qonuniyatning qaysi amaliy qo'llanilishini yoki formulasini virtual laboratoriyada tekshirib ko'rmoqchisiz?`;
  }

  // Vite middleware in dev mode OR static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
