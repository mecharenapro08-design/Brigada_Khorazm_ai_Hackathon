import { ScheduleLesson } from "../types";

export const PERIOD_TIMES = [
  { periodIndex: 1, startTime: "08:30", endTime: "09:15", label: "1-dars" },
  { periodIndex: 2, startTime: "09:25", endTime: "10:10", label: "2-dars" },
  { periodIndex: 3, startTime: "10:20", endTime: "11:05", label: "3-dars" },
  { periodIndex: 4, startTime: "11:25", endTime: "12:10", label: "4-dars" },
  { periodIndex: 5, startTime: "12:20", endTime: "13:05", label: "5-dars" },
  { periodIndex: 6, startTime: "13:15", endTime: "14:00", label: "6-dars" },
];

export const SCHOOL_QUARTERS = [
  { id: 1, title: "1-Chorak", period: "Sentabr — Noyabr (2026)", months: ["09", "10", "11"] },
  { id: 2, title: "2-Chorak", period: "Noyabr — Dekabr (2026)", months: ["11", "12"] },
  { id: 3, title: "3-Chorak", period: "Yanvar — Mart (2027)", months: ["01", "02", "03"] },
  { id: 4, title: "4-Chorak", period: "Mart — May (2027)", months: ["03", "04", "05"] },
];

export const MONTH_NAMES_UZ: Record<string, string> = {
  "01": "Yanvar",
  "02": "Fevral",
  "03": "Mart",
  "04": "Aprel",
  "05": "May",
  "06": "Iyun",
  "07": "Iyul",
  "08": "Avgust",
  "09": "Sentabr",
  "10": "Oktyabr",
  "11": "Noyabr",
  "12": "Dekabr",
};

// Curriculum topic pools by quarter
const PHYSICS_TOPICS_Q1 = [
  { topic: "Kirish: Fizikaviy oʻlchovlar va SI xalqaro birliklar tizimi", type: "theory" },
  { topic: "Toʻgʻri chiziqli tekis va tekis tezlanuvchan harakat", type: "theory" },
  { topic: "Nyutonning 1 va 2-harakat qonunlari amaliy tahlili", type: "theory" },
  { topic: "Gorizontal va burchak ostida otilgan jism harakati (Ballistika)", type: "lab", lab: "projectile" },
  { topic: "Prujina bikrligi va elastiklik kuchi (Guk qonuni tebranishlari)", type: "lab", lab: "spring3d" },
  { topic: "Gravitatsion maydon va erkin tushish tezlanishi g", type: "practice" },
  { topic: "Pifagor geometriyasi va fazoviy vektorlar qoʻshilishi", type: "lab", lab: "pythagoras" },
  { topic: "Choraklik oraliq DTM nazorati: Kinematika va Dinamika", type: "exam" },
];

const PHYSICS_TOPICS_Q2 = [
  { topic: "Impuls va Impulsning saqlanish qonuni", type: "theory" },
  { topic: "Mexanik ish, quvvat va kinetik/potensial energiya", type: "theory" },
  { topic: "Gorizontal uloqtirilgan jism trayektoriyasi va masofasi", type: "lab", lab: "projectile" },
  { topic: "Kosmik tezliklar va sunʼiy yoʻldoshlar orbital harakati", type: "theory" },
  { topic: "Prujinali va matematik mayatnik tebranishlari davri", type: "lab", lab: "spring3d" },
  { topic: "Yorugʻlikning toʻlqin tabiati va sinish qonunlari", type: "theory" },
  { topic: "Prizmada yorugʻlik dispersiyasi va spektral tahlil", type: "lab", lab: "optics3d" },
  { topic: "2-Chorak yakuniy davlat nazorat ishi", type: "exam" },
];

const PHYSICS_TOPICS_Q3 = [
  { topic: "Molekulyar-kinetik nazariya asoslari va ideal gaz", type: "theory" },
  { topic: "Termodinamikaning 1-qonuni va izojarayonlar", type: "theory" },
  { topic: "Issiqlik dvigatellari va FIK (Karno sikli)", type: "practice" },
  { topic: "Elektrostatika: Kulon qonuni va kuch chiziqlari", type: "theory" },
  { topic: "Kondensatorlar sigʻimi va elektr maydon energiyasi", type: "practice" },
  { topic: "Atom tuzilishi: Rezerford tajribasi va Bor postulatlari", type: "lab", lab: "atom3d" },
  { topic: "Optik linzalar va tasvir hosil qilish qonuniyatlari", type: "lab", lab: "optics3d" },
  { topic: "3-Chorak nazorat ishi va DTM simulyatsiyasi", type: "exam" },
];

const PHYSICS_TOPICS_Q4 = [
  { topic: "Magnit maydoni va Lorents kuchi", type: "theory" },
  { topic: "Elektromagnit induksiya va Faradey qonuni", type: "theory" },
  { topic: "Oʻzgaruvchan tok va transformatorlar", type: "practice" },
  { topic: "Kvant fizikasi: Fotoeffekt qonunlari va Eynshteyn tenglamasi", type: "theory" },
  { topic: "Atom yadrosi tuzilishi va radioaktiv yemirilish", type: "lab", lab: "atom3d" },
  { topic: "Yorugʻlik interferensiyasi va difraksiyasi", type: "lab", lab: "optics3d" },
  { topic: "Yillik umumlashtiruvchi amaliy 3D laboratoriyalar", type: "lab", lab: "projectile" },
  { topic: "Yakuniy Yillik Davlat Imtihoni (DTM & Milliy Sertifikat)", type: "exam" },
];

const ALGEBRA_TOPICS = [
  "Ratsional tenglamalar va tengsizliklar tizimi",
  "Trigonometrik funksiyalar va ularning davriyligi",
  "Trigonometrik ayniyatlar va qisqa koʻpaytirish",
  "Koʻrsatkichli tenglamalar va xossalari",
  "Logarifmik ifodalar va ularni soddalashtirish",
  "Hosilaning geometrik va fizik maʼnosi",
  "Funksiyani hosila yordamida tekshirish va ekstremumlar",
  "Boshlangʻich funksiya va aniqmas integral",
  "Ehtimollar nazariyasi va kombinatorika elementlari",
  "DTM darajasidagi algebraik parametrli tenglamalar",
];

const GEOMETRY_TOPICS = [
  "Pifagor teoremasi va metrik munosabatlar",
  "Uchburchaklar oʻxshashligi alomatlari",
  "Aylanaga ichki va tashqi chizilgan koʻpburchaklar",
  "Stereometriya aksiomalari va toʻgʻri chiziqlarning parallelligi",
  "Fazoda tekisliklarning perpendikulyarligi",
  "Prizma va piramidaning sirtlari va hajmi",
  "Aylanma jismlar: Silindr va Konus",
  "Shar va sferaning geometrik xossalari",
  "Fazoda koordinatalar usuli va vektorlar",
  "Geometriya boʻyicha DTM murakkab masalalari",
];

const CHEMISTRY_TOPICS = [
  "Kimyoviy elementlar davriy qonuni va atom tuzilishi",
  "Kovalent, ion va metall bogʻlanishlar tabiati",
  "Oksidlanish-qaytarilish reaksiyalari tenglamalari",
  "Eritmalar konsentratsiyasi va elektrolitik dissotsiatsiya",
  "Metallar va ularning qotishmalari elektrokimyosi",
  "Uglevodorodlar: Alkanlar, alkenlar va alkinlar",
  "Kislorodli organik moddalar: Spirtlar va aldegidlar",
  "Polimerlar va zamonaviy nanomateriallar",
];

const FIFTH_SUBJECTS = [
  {
    subject: "Informatika",
    room: "102-IT Lab",
    teacher: "Bobur Rahimov",
    topics: [
      "Algoritmik murakkablik va Big O tahlili",
      "Python maʼlumotlar tuzilmalari: Roʻyxatlar va lugʻatlar",
      "Relyatsion maʼlumotlar bazasi va SQL soʻrovlari",
      "Web dasturlash asoslari va API integratsiyasi",
      "Sunʼiy intellekt va neyron tarmoqlari kirish",
    ],
  },
  {
    subject: "Biologiya",
    room: "214-Biologiya",
    teacher: "Gulnora Oripova",
    topics: [
      "Hujayra nazariyasi va organoidlar funksiyasi",
      "Genetika qonunlari: Mendel tajribalari",
      "Evolyutsiya nazariyasi va populyatsiya genetikasi",
      "Ekologik tizimlar va biosferaning barqarorligi",
      "Biotexnologiya va gen muhandisligi",
    ],
  },
  {
    subject: "Ingliz tili (CEFR / IELTS)",
    room: "201-Xorijiy Tillar",
    teacher: "Malika Karimova",
    topics: [
      "Academic Reading & Scientific Vocabulary in Physics",
      "Grammar Mastery: Complex conditionals & passive voice",
      "IELTS Writing Task 1: Describing Lab graphs and charts",
      "Listening comprehension: MIT OpenCourseWare lectures",
      "Speaking fluency: Scientific debate and presentation",
    ],
  },
  {
    subject: "Oʻzbekiston tarixi & Huquq",
    room: "108-Tarix",
    teacher: "Sherzod Alimov",
    topics: [
      "Amir Temur davlati va Temuriylar renessansi ilmiy yutuqlari",
      "Mirzo Ulugʻbek rasadxonasi va Ziji Jadidi Koʻragoniy",
      "Jadidchilik harakati va maʼrifatparvarlar merosi",
      "Oʻzbekiston Respublikasi Konstitutsiyasi va Inson huquqlari",
      "Mustaqil Oʻzbekistonning ijtimoiy-iqtisodiy taraqqiyoti",
    ],
  },
  {
    subject: "DTM Maxsus Test Soati",
    room: "301-DTM Imtihon Zali",
    teacher: "Rustam Karimov & Dilorom Yusupova",
    topics: [
      "DTM 1-Blok: Matematika va Fizika intensiv test sinovi (Kuponli)",
      "DTM Milliy Sertifikat darajasidagi masalalar yechimi",
      "Vaqt boshqaruvi: 45 soniyalik blitz savollar bilan mashgʻulot",
      "DTM Majburiy fanlar: Ona tili va Oʻzbekiston tarixi tahlili",
      "Yakuniy DTM Sinov Imtihoni: Katta Marafonga tayyorgarlik",
    ],
  },
];

// Helper to determine quarter from ISO date
function getQuarterFromDateStr(dateStr: string): 1 | 2 | 3 | 4 {
  const parts = dateStr.split("-");
  const month = parts[1];
  const day = parseInt(parts[2], 10);
  if (month === "09" || month === "10" || (month === "11" && day <= 4)) return 1;
  if (month === "11" || (month === "12" && day <= 28)) return 2;
  if (month === "01" || month === "02" || (month === "03" && day <= 20)) return 3;
  return 4;
}

// Generate the 1-year annual schedule with lessons for 10-A, 10-B, 11-A, 9-V
export function generateAnnualSchedule(): ScheduleLesson[] {
  const lessons: ScheduleLesson[] = [];
  let lessonCounter = 1;

  // School year: 2026-09-02 to 2027-05-25
  const startDate = new Date(2026, 8, 2); // Sep 2, 2026
  const endDate = new Date(2027, 4, 25); // May 25, 2027

  // Holiday ranges (vacations)
  const isHoliday = (d: Date): boolean => {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();

    // Autumn break: Nov 5 - Nov 10, 2026
    if (y === 2026 && m === 11 && day >= 5 && day <= 10) return true;
    // Winter break: Dec 29, 2026 - Jan 10, 2027
    if ((y === 2026 && m === 12 && day >= 29) || (y === 2027 && m === 1 && day <= 10)) return true;
    // Spring break: Mar 21 - Mar 27, 2027
    if (y === 2027 && m === 3 && day >= 21 && day <= 27) return true;
    // New Year / Flag / Const / Navruz
    if (y === 2026 && m === 12 && day === 8) return true; // Konstitutsiya kuni
    return false;
  };

  const currentDate = new Date(startDate);
  let dayIndex = 0;

  const targetClasses = ["10-A", "10-B", "11-A", "9-V"];

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sun
    if (dayOfWeek !== 0 && !isHoliday(currentDate)) {
      // It's a school day! (Mon through Sat)
      const year = currentDate.getFullYear();
      const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
      const dayStr = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const formattedDate = `${parseInt(dayStr, 10)}-${MONTH_NAMES_UZ[monthStr]}, ${year}`;
      const quarter = getQuarterFromDateStr(dateStr);
      const isPastOrToday = dateStr <= "2026-09-19";

      // 4 to 6 lessons per day
      const lessonCountForDay = dayOfWeek === 6 ? 4 : (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4 ? 6 : 5);

      // Generate for each class
      targetClasses.forEach((cls) => {
        // 1. Period 1: Fizika
        let physicsPool = PHYSICS_TOPICS_Q1;
        if (quarter === 2) physicsPool = PHYSICS_TOPICS_Q2;
        else if (quarter === 3) physicsPool = PHYSICS_TOPICS_Q3;
        else if (quarter === 4) physicsPool = PHYSICS_TOPICS_Q4;

        const pTopicObj = physicsPool[(dayIndex + (cls === "10-B" ? 2 : cls === "11-A" ? 4 : 1)) % physicsPool.length];

        lessons.push({
          id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
          date: dateStr,
          formattedDate,
          quarter,
          periodIndex: 1,
          startTime: PERIOD_TIMES[0].startTime,
          endTime: PERIOD_TIMES[0].endTime,
          subject: cls === "9-V" ? "Fizika asoslari" : "Fizika",
          className: cls,
          room: "304-Fizika Lab",
          topic: pTopicObj.topic,
          lessonType: pTopicObj.type as any,
          teacherName: "Rustam Karimov",
          labSimulationType: pTopicObj.lab as any,
          isCompleted: isPastOrToday,
        });

        // 2. Period 2: Algebra
        const aTopic = ALGEBRA_TOPICS[(dayIndex + (cls === "11-A" ? 3 : 0)) % ALGEBRA_TOPICS.length];
        lessons.push({
          id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
          date: dateStr,
          formattedDate,
          quarter,
          periodIndex: 2,
          startTime: PERIOD_TIMES[1].startTime,
          endTime: PERIOD_TIMES[1].endTime,
          subject: cls === "11-A" ? "Oliy Algebra & DTM" : "Algebra",
          className: cls,
          room: cls === "10-B" ? "204-Matematika" : "205-Matematika",
          topic: aTopic,
          lessonType: dayIndex % 4 === 0 ? "quiz" : "theory",
          teacherName: cls === "10-B" ? "Azizbek Olimov" : "Dilorom Yusupova",
          isCompleted: isPastOrToday,
        });

        // 3. Period 3: Geometriya
        const gTopic = GEOMETRY_TOPICS[(dayIndex + (cls === "9-V" ? 1 : 0)) % GEOMETRY_TOPICS.length];
        lessons.push({
          id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
          date: dateStr,
          formattedDate,
          quarter,
          periodIndex: 3,
          startTime: PERIOD_TIMES[2].startTime,
          endTime: PERIOD_TIMES[2].endTime,
          subject: "Geometriya",
          className: cls,
          room: "208-Geometriya",
          topic: gTopic,
          lessonType: gTopic.includes("Pifagor") ? "lab" : (dayIndex % 3 === 0 ? "quiz" : "theory"),
          teacherName: cls === "10-B" ? "Azizbek Olimov" : "Dilorom Yusupova",
          labSimulationType: gTopic.includes("Pifagor") ? "pythagoras" : undefined,
          isCompleted: isPastOrToday,
        });

        // 4. Period 4: Kimyo
        const cTopic = CHEMISTRY_TOPICS[(dayIndex + (cls === "10-B" ? 3 : 0)) % CHEMISTRY_TOPICS.length];
        lessons.push({
          id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
          date: dateStr,
          formattedDate,
          quarter,
          periodIndex: 4,
          startTime: PERIOD_TIMES[3].startTime,
          endTime: PERIOD_TIMES[3].endTime,
          subject: cls === "9-V" ? "Kimyo asoslari" : "Kimyo",
          className: cls,
          room: "310-Kimyo Lab",
          topic: cTopic,
          lessonType: dayIndex % 3 === 1 ? "lab" : "theory",
          teacherName: "Nargiza Saidova",
          labSimulationType: dayIndex % 3 === 1 ? "atom3d" : undefined,
          isCompleted: isPastOrToday,
        });

        // 5. Period 5 (on 5 and 6-lesson days)
        if (lessonCountForDay >= 5) {
          const fifthObj = FIFTH_SUBJECTS[(dayIndex + targetClasses.indexOf(cls)) % FIFTH_SUBJECTS.length];
          const fifthTopic = fifthObj.topics[(dayIndex + targetClasses.indexOf(cls)) % fifthObj.topics.length];
          lessons.push({
            id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
            date: dateStr,
            formattedDate,
            quarter,
            periodIndex: 5,
            startTime: PERIOD_TIMES[4].startTime,
            endTime: PERIOD_TIMES[4].endTime,
            subject: fifthObj.subject,
            className: cls,
            room: fifthObj.room,
            topic: fifthTopic,
            lessonType: fifthObj.subject.includes("DTM") ? "exam" : "theory",
            teacherName: fifthObj.teacher,
            isCompleted: isPastOrToday,
          });
        }

        // 6. Period 6 (on 6-lesson days)
        if (lessonCountForDay >= 6) {
          const sixthObj = FIFTH_SUBJECTS[(dayIndex + 2 + targetClasses.indexOf(cls)) % FIFTH_SUBJECTS.length];
          const sixthTopic = sixthObj.topics[(dayIndex + 3) % sixthObj.topics.length];
          lessons.push({
            id: `sch-${cls.toLowerCase()}-${String(lessonCounter++).padStart(4, "0")}`,
            date: dateStr,
            formattedDate,
            quarter,
            periodIndex: 6,
            startTime: PERIOD_TIMES[5].startTime,
            endTime: PERIOD_TIMES[5].endTime,
            subject: cls === "11-A" ? "DTM Maxsus Test Soati" : sixthObj.subject,
            className: cls,
            room: cls === "11-A" ? "301-DTM Imtihon Zali" : sixthObj.room,
            topic: cls === "11-A" ? "DTM Blok Testi va Murakkab Savollar Tahlili" : sixthTopic,
            lessonType: cls === "11-A" ? "exam" : "practice",
            teacherName: cls === "11-A" ? "DTM Komissiya Eksperti" : sixthObj.teacher,
            isCompleted: isPastOrToday,
          });
        }
      });

      dayIndex++;
    }
    // Next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return lessons;
}

export const INITIAL_ANNUAL_SCHEDULE: ScheduleLesson[] = generateAnnualSchedule();
