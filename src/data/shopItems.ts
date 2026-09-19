export interface ShopItem {
  id: string;
  name: string;
  category: "frame" | "title" | "avatar" | "theme" | "coupon";
  categoryLabel: string;
  description: string;
  cost: number;
  icon: string;
  previewClass?: string;
  value: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // 0. DTM RASMIY TEST KUPONLARI (MAGAZINDA QIMMATBAHO & NOYOB)
  {
    id: "dtm_coupon_single",
    name: "1x Rasmiy DTM Test Kuponi",
    category: "coupon",
    categoryLabel: "🎟️ Imtihon Kuponi",
    description: "Davlat Test Markazi (DTM) 100 talik sinovida 1 marta qatnashish uchun rasmiy elektron kupon. Faqat eng tirishqoq oʻquvchilar uchun qimmatbaho narxda.",
    cost: 450,
    icon: "🎟️",
    value: "1",
  },
  {
    id: "dtm_coupon_pack",
    name: "5x DTM Test Kuponlari Jamlanmasi",
    category: "coupon",
    categoryLabel: "🎫 Kuponlar Toʻplami",
    description: "DTM testlari uchun 5 dona qimmatbaho rasmiy kuponlar toʻplami. Abituriyentlar va universitetga tayyorlanuvchilar uchun maxsus elita toʻplami.",
    cost: 2000,
    icon: "🎫",
    value: "5",
  },

  // 1. RAMKALAR VA AURALAR
  {
    id: "frame_cyber_neon",
    name: "Kiber Neon Ramkasi",
    category: "frame",
    categoryLabel: "Ramka & Aura",
    description: "Profilingiz va reyting jadvalida avataringiz atrofida kiber neon nur taratadi.",
    cost: 80,
    icon: "💫",
    previewClass: "ring-4 ring-cyan-400 shadow-md shadow-cyan-400/50",
    value: "ring-4 ring-cyan-400 shadow-lg shadow-cyan-400/50",
  },
  {
    id: "frame_gold_quantum",
    name: "Oltin Kvant Aurasi",
    category: "frame",
    categoryLabel: "Ramka & Aura",
    description: "Eng yuqori intellektual salohiyat belgisi boʻlgan oltin zarhal yaltiroq chegara.",
    cost: 120,
    icon: "👑",
    previewClass: "ring-4 ring-amber-400 shadow-md shadow-amber-400/50",
    value: "ring-4 ring-amber-400 shadow-lg shadow-amber-400/50",
  },
  {
    id: "frame_galactic_plasma",
    name: "Galaktik Plazma Ramkasi",
    category: "frame",
    categoryLabel: "Ramka & Aura",
    description: "Aylanuvchi binafsha koinot nuri va astrofizik plazma effekti.",
    cost: 150,
    icon: "🌌",
    previewClass: "ring-4 ring-purple-500 shadow-md shadow-purple-500/50",
    value: "ring-4 ring-purple-500 shadow-lg shadow-purple-500/50",
  },
  {
    id: "frame_laser_emerald",
    name: "Zumrad Lazer Ramkasi",
    category: "frame",
    categoryLabel: "Ramka & Aura",
    description: "Yashil spektrli aniq lazer nuri bilan oʻralgan tadqiqotchi ramkasi.",
    cost: 95,
    icon: "❇️",
    previewClass: "ring-4 ring-emerald-400 shadow-md shadow-emerald-400/50",
    value: "ring-4 ring-emerald-400 shadow-lg shadow-emerald-400/50",
  },

  // 2. MAXSUS UNVONLAR
  {
    id: "title_quantum_academic",
    name: "«Kvant Akademigi»",
    category: "title",
    categoryLabel: "Maxsus Unvon",
    description: "Ismingiz yonida porlab turuvchi eng nufuzli ilmiy martaba unvoni.",
    cost: 140,
    icon: "⚛️",
    value: "Kvant Akademigi",
  },
  {
    id: "title_math_wizard",
    name: "«Matematika Sehrgari»",
    category: "title",
    categoryLabel: "Maxsus Unvon",
    description: "Tenglamalar, funksiyalar va formulalarni mukammal biluvchi bilimdon unvoni.",
    cost: 110,
    icon: "📐",
    value: "Matematika Sehrgari",
  },
  {
    id: "title_astro_explorer",
    name: "«Astronomiya Koshifi»",
    category: "title",
    categoryLabel: "Maxsus Unvon",
    description: "Sayyoralar, yulduzlar va koinot sirlarini zabt etuvchi unvon.",
    cost: 115,
    icon: "🪐",
    value: "Astronomiya Koshifi",
  },
  {
    id: "title_dtm_sniper",
    name: "«DTM Snayperi»",
    category: "title",
    categoryLabel: "Maxsus Unvon",
    description: "Test sinovlarida xatosiz va maksimal ball toʻplovchi yetakchi unvoni.",
    cost: 130,
    icon: "🎯",
    value: "DTM Snayperi",
  },
  {
    id: "title_lab_professor",
    name: "«Laboratoriya Professori»",
    category: "title",
    categoryLabel: "Maxsus Unvon",
    description: "2D va 3D fazoviy tajribalarni mustaqil modellashtiruvchi usta.",
    cost: 125,
    icon: "🧪",
    value: "Laboratoriya Professori",
  },

  // 3. EKSKLYUZIV AVATARLAR
  {
    id: "avatar_cyber_scholar",
    name: "Kiber Ilmiy Murabbiy",
    category: "avatar",
    categoryLabel: "Maxsus Avatar",
    description: "3D formatda ishlangan zamonaviy kibernetik olim qiyofasi.",
    cost: 160,
    icon: "🤖",
    value: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar_astro_physicist",
    name: "Astrofizik Fazogir",
    category: "avatar",
    categoryLabel: "Maxsus Avatar",
    description: "Kosmik fazoda kvant tadqiqotlarini olib boruvchi yosh fazogir qiyofasi.",
    cost: 175,
    icon: "🧑‍🚀",
    value: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "avatar_young_polymath",
    name: "Yosh Al-Xorazmiy",
    category: "avatar",
    categoryLabel: "Maxsus Avatar",
    description: "Sharq donishmandligi va zamonaviy informatika uygʻunligi.",
    cost: 150,
    icon: "📜",
    value: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },

  // 4. PROFIL FON TEMALARI
  {
    id: "theme_deep_cosmos",
    name: "Chuqur Kosmos Banderoli",
    category: "theme",
    categoryLabel: "Profil Temasi",
    description: "Profilingiz yuqori qismida yulduzlar tumanligi va galaktikalar fonini ochadi.",
    cost: 100,
    icon: "🌌",
    value: "from-indigo-950 via-purple-950 to-slate-950",
  },
  {
    id: "theme_cyber_lab",
    name: "Kvant Laboratoriya Foni",
    category: "theme",
    categoryLabel: "Profil Temasi",
    description: "Elektron sxemalar va neon nurli zamonaviy fizika laboratoriyasi foni.",
    cost: 110,
    icon: "🔬",
    value: "from-cyan-950 via-slate-900 to-blue-950",
  },
  {
    id: "theme_royal_gold",
    name: "Shon-Sharaf Oltin Foni",
    category: "theme",
    categoryLabel: "Profil Temasi",
    description: "Respublika olimpiadasi gʻoliblariga xos oliy darajali oltin fon.",
    cost: 135,
    icon: "🏆",
    value: "from-amber-950 via-slate-900 to-amber-900",
  },
];
