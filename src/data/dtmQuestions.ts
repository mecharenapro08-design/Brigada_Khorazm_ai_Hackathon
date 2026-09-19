export interface DTMQuestion {
  id: string;
  subject: string;
  topic?: string;
  question: string;
  options: string[];
  correctIndex: number;
  aiHint?: string;
  explanation?: string;
}

export const DTM_100_QUESTIONS: DTMQuestion[] = [
  // Matematika
  {
    id: "dtm-m-1",
    subject: "Matematika",
    topic: "Geometriya (Pifagor)",
    question: "Toʻgʻri burchakli uchburchakning katetlari 9 sm va 12 sm boʻlsa, gipotenuzasini toping.",
    options: ["15 sm", "16 sm", "18 sm", "20 sm"],
    correctIndex: 0,
    aiHint: "c = √(9² + 12²) = √(81 + 144) = √225 = 15 sm. Misr uchburchagining 3x karralisi (3-4-5 nisbat).",
  },
  {
    id: "dtm-m-2",
    subject: "Matematika",
    topic: "Tenglamalar",
    question: "x² - 7x + 12 = 0 kvadrat tenglamaning ildizlari yigʻindisini toping.",
    options: ["7", "-7", "12", "-12"],
    correctIndex: 0,
    aiHint: "Viyet teoremasiga koʻra, x₁ + x₂ = -b/a = -(-7)/1 = 7.",
  },
  {
    id: "dtm-m-3",
    subject: "Matematika",
    topic: "Trigonometriya",
    question: "sin²(α) + cos²(α) ifodaning qiymati nimaga teng?",
    options: ["1", "0", "tan(α)", "2"],
    correctIndex: 0,
    aiHint: "Bu asosiy trigonometrik ayniyat: ixtiyoriy burchak uchun sin²α + cos²α = 1 ga teng.",
  },
  {
    id: "dtm-m-4",
    subject: "Matematika",
    topic: "Progressiya",
    question: "Arifmetik progressiyada a₁ = 3, d = 4 boʻlsa, a₁₀ ni toping.",
    options: ["39", "40", "36", "43"],
    correctIndex: 0,
    aiHint: "a_n = a₁ + (n - 1)d. Shuning uchun a₁₀ = 3 + 9 * 4 = 3 + 36 = 39.",
  },
  {
    id: "dtm-m-5",
    subject: "Matematika",
    topic: "Logarifm",
    question: "log₂(32) ifodaning qiymatini toping.",
    options: ["5", "4", "6", "16"],
    correctIndex: 0,
    aiHint: "2 ning qaysi darajasi 32 ga teng? 2⁵ = 32, demak log₂32 = 5.",
  },
  {
    id: "dtm-m-6",
    subject: "Matematika",
    topic: "Hosilalar",
    question: "f(x) = 3x² + 5x - 7 funksiyaning hosilasi f'(x) ni toping.",
    options: ["6x + 5", "3x + 5", "6x - 7", "6x² + 5"],
    correctIndex: 0,
    aiHint: "(xⁿ)' = n*xⁿ⁻¹. Demak (3x²)' = 6x, (5x)' = 5, oʻzgarmasning hosilasi 0.",
  },
  {
    id: "dtm-m-7",
    subject: "Matematika",
    topic: "Integral",
    question: "∫ 2x dx aniqmas integralini hisoblang.",
    options: ["x² + C", "2x² + C", "x + C", "x³/3 + C"],
    correctIndex: 0,
    aiHint: "∫ x dx = x²/2 + C. Shuning uchun 2 * (x²/2) + C = x² + C.",
  },
  {
    id: "dtm-m-8",
    subject: "Matematika",
    topic: "Kombinatorika",
    question: "5 kishidan iborat guruhdan 2 kishilik komissiyani necha xil usulda tanlash mumkin (C(5,2))?",
    options: ["10 xil", "20 xil", "15 xil", "25 xil"],
    correctIndex: 0,
    aiHint: "C(5,2) = (5 * 4) / (2 * 1) = 20 / 2 = 10.",
  },

  // Fizika
  {
    id: "dtm-f-1",
    subject: "Fizika",
    topic: "Elektr",
    question: "Om qonuniga koʻra oʻtkazgichdagi tok kuchi formulasi qaysi?",
    options: ["I = U / R", "I = U * R", "I = R / U", "I = U² / R"],
    correctIndex: 0,
    aiHint: "Tok kuchi (I) kuchlanishga (U) toʻgʻri, qarshilikka (R) teskari mutanosib: I = U/R.",
  },
  {
    id: "dtm-f-2",
    subject: "Fizika",
    topic: "Dinamika",
    question: "Nyutonning ikkinchi qonuni qaysi formula bilan ifodalanadi?",
    options: ["F = m * a", "F = m * v", "F = k * x", "E = m * c²"],
    correctIndex: 0,
    aiHint: "Jismga taʼsir qiluvchi kuch uning massasi va tezlanishining koʻpaytmasiga teng.",
  },
  {
    id: "dtm-f-3",
    subject: "Fizika",
    topic: "Optika",
    question: "Yorugʻlikning boʻshliqdagi (vakuumdagi) tarqalish tezligi qanchaga teng?",
    options: ["300,000 km/s", "150,000 km/s", "30,000 km/s", "3,000,000 km/s"],
    correctIndex: 0,
    aiHint: "c ≈ 3 * 10⁸ m/s yoki 300,000 km/s.",
  },
  {
    id: "dtm-f-4",
    subject: "Fizika",
    topic: "Termodinamika",
    question: "Ideal gaz holat tenglamasi (Mendeleyev-Klapeyron) qaysi?",
    options: ["P * V = (m/M) * R * T", "P * T = V * R", "E = k * T", "P = ρ * g * h"],
    correctIndex: 0,
    aiHint: "PV = νRT, bu yerda ν = m/M gaz miqdori.",
  },
  {
    id: "dtm-f-5",
    subject: "Fizika",
    topic: "Kvant fizikasi",
    question: "Fotoeffekt uchun Eynshteyn tenglamasi qaysi?",
    options: ["hν = A + E_k", "E = m * v²", "hν = P * V", "F = q * E"],
    correctIndex: 0,
    aiHint: "Tushayotgan foton energiyasi (hν) elektronning chiqish ishi (A) va uning kinetik energiyasiga sarflanadi.",
  },

  // Informatika & Dasturlash
  {
    id: "dtm-i-1",
    subject: "Informatika",
    topic: "Algoritmlar",
    question: "Ikkilik qidiruv (Binary Search) algoritmining vaqt murakkabligi qanday?",
    options: ["O(log N)", "O(N)", "O(N²)", "O(1)"],
    correctIndex: 0,
    aiHint: "Tartiblangan massivda har qadamda qidiruv maydoni teng 2 ga boʻlinadi: O(log₂ N).",
  },
  {
    id: "dtm-i-2",
    subject: "Informatika",
    topic: "Sanoq sistemalari",
    question: "Oʻnlik sanoq sistemasidagi 13 sonining ikkilikdagi koʻrinishi qaysi?",
    options: ["1101", "1011", "1110", "1001"],
    correctIndex: 0,
    aiHint: "13 = 8 + 4 + 0 + 1 => ikkilikda 1101₂.",
  },
  {
    id: "dtm-i-3",
    subject: "Informatika",
    topic: "Maʼlumotlar tuzilmasi",
    question: "LIFO (Last In First Out) tamoyili asosida ishlaydigan maʼlumotlar tuzilmasi nima?",
    options: ["Stack (Stek)", "Queue (Navbat)", "Array (Massiv)", "Tree (Daraxt)"],
    correctIndex: 0,
    aiHint: "Eng oxirgi qoʻshilgan element birinchi boʻlib olinadi - xuddi likopchalar ustma-ust taxlangandek.",
  },
  {
    id: "dtm-i-4",
    subject: "Informatika",
    topic: "Sunʼiy Intellekt",
    question: "Transformer arxitekturasining asosiy innovatsion mexanizmi nima?",
    options: ["Self-Attention (Oʻziga eʼtibor)", "Backpropagation", "Linear Regression", "Bubble Sort"],
    correctIndex: 0,
    aiHint: "'Attention Is All You Need' (2017) maqolasi asosida yaratilgan Self-Attention mexanizmi.",
  },

  // Biologiya
  {
    id: "dtm-b-1",
    subject: "Biologiya",
    topic: "Sitologiya",
    question: "Hujayraning 'energiya stansiyasi' deb qaysi organoidga aytiladi?",
    options: ["Mitoxondriya", "Ribosoma", "Lizosoma", "Golji majmuasi"],
    correctIndex: 0,
    aiHint: "Mitoxondriyada ATF (adenozintrifosfat) sintezlanadi va hujayra energiya bilan taʼminlanadi.",
  },
  {
    id: "dtm-b-2",
    subject: "Biologiya",
    topic: "Genetika",
    question: "Odam tana (somatik) hujayralarida nechta xromosoma mavjud?",
    options: ["46 ta (23 juft)", "48 ta", "23 ta", "44 ta"],
    correctIndex: 0,
    aiHint: "22 juft autosoma va 1 juft jinsiy xromosoma, jami 46 ta.",
  },
  {
    id: "dtm-b-3",
    subject: "Biologiya",
    topic: "Molekulyar biologiya",
    question: "DNK dan RNK nusxasi koʻchirilishi jarayoni nima deb ataladi?",
    options: ["Transkripsiya", "Translyatsiya", "Replikatsiya", "Modifikatsiya"],
    correctIndex: 0,
    aiHint: "Transkripsiya - DNK matritsasida axborot RNK (iRNK) sintezi jarayoni.",
  },

  // Kimyo
  {
    id: "dtm-k-1",
    subject: "Kimyo",
    topic: "Davriy sistema",
    question: "Mendeleyev davriy sistemasida tartib raqami 6 boʻlgan element qaysi?",
    options: ["Uglerod (C)", "Kislorod (O)", "Azot (N)", "Bor (B)"],
    correctIndex: 0,
    aiHint: "Vodorod(1), Geliy(2), Litiy(3), Berilliy(4), Bor(5), Uglerod(6).",
  },
  {
    id: "dtm-k-2",
    subject: "Kimyo",
    topic: "Kimyoviy bogʻlanish",
    question: "Osh tuzi (NaCl) tarkibida qanday kimyoviy bogʻlanish mavjud?",
    options: ["Ion bogʻlanish", "Kovalent qutbsiz", "Vodorod bogʻlanish", "Metall bogʻlanish"],
    correctIndex: 0,
    aiHint: "Tipik metall (Na) va tipik metallmas (Cl) oʻrtasida elektron oʻtishi orqali ion bogʻ hosil boʻladi.",
  },
  {
    id: "dtm-k-3",
    subject: "Kimyo",
    topic: "Kislota-asos",
    question: "Neytral suvli eritmaning pH koʻrsatkichi nechaga teng?",
    options: ["7", "0", "14", "1"],
    correctIndex: 0,
    aiHint: "pH < 7 kislotali, pH = 7 neytral, pH > 7 ishqoriy muhit hisoblanadi.",
  },

  // Tarix
  {
    id: "dtm-t-1",
    subject: "Tarix",
    topic: "Temuriylar",
    question: "Sohibqiron Amir Temur qaysi yili tavallud topgan?",
    options: ["1336-yil 9-aprel", "1346-yil", "1326-yil", "1366-yil"],
    correctIndex: 0,
    aiHint: "Kesh (hozirgi Shahrisabz) yaqinidagi Xoʻja Ilgʻor qishlogʻida 1336-yil 9-aprelda tugʻilgan.",
  },
  {
    id: "dtm-t-2",
    subject: "Tarix",
    topic: "Qadimgi dunyo",
    question: "Qadimgi Bobil podshohi Xammurapining eng mashhur tarixiy xizmati nima?",
    options: ["Ilk yozma qonunlar majmuasi", "Piramidalar qurilishi", "Olimpiada oʻyinlari", "Kompas kashfiyoti"],
    correctIndex: 0,
    aiHint: "Xammurapi qonunlari tosh ustunlarga mixxat bilan oʻyib yozilgan qadimgi huquqiy yodgorlikdir.",
  },

  // Ona tili va Adabiyot
  {
    id: "dtm-o-1",
    subject: "Ona tili",
    topic: "Fonetika",
    question: "Oʻzbek adabiy tilida nechta unli fonema mavjud?",
    options: ["6 ta", "10 ta", "23 ta", "4 ta"],
    correctIndex: 0,
    aiHint: "Oʻzbek lotin alifbosida 6 ta unli tovush bor: a, o, i, u, oʻ, e.",
  },
  {
    id: "dtm-o-2",
    subject: "Adabiyot",
    topic: "Alisher Navoiy",
    question: "Alisher Navoiyning turkiy tilda yaratgan besh dostonlik asari qanday ataladi?",
    options: ["Xamsa", "Devoni Foniy", "Lison ut-Tayr", "Mahbub ul-Qulub"],
    correctIndex: 0,
    aiHint: "'Xamsa' arabcha 'beshlik' demakdir.",
  },

  // Ingliz tili
  {
    id: "dtm-eng-1",
    subject: "Ingliz tili",
    topic: "Grammar (Tenses)",
    question: "If it rains tomorrow, we ... the picnic.",
    options: ["will cancel", "canceled", "have canceled", "are canceling"],
    correctIndex: 0,
    aiHint: "First Conditional: If + Present Simple, will + base verb.",
  },
  {
    id: "dtm-eng-2",
    subject: "Ingliz tili",
    topic: "Vocabulary",
    question: "Which word is a synonym for 'rapid'?",
    options: ["Fast", "Slow", "Heavy", "Deep"],
    correctIndex: 0,
    aiHint: "'Rapid' means happening in a short time or at a fast pace.",
  },
];
