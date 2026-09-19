export interface ClassStudent {
  id: string;
  name: string;
  avatar: string;
  attendance: "present" | "late" | "excused" | "absent";
  score: number;
  parentPhone: string;
  parentName: string;
  note: string;
  lastHomework: string;
  status: "active" | "warning";
  strengths: string[];
}

export interface ClassTopicProgress {
  topic: string;
  score: number;
  status: "Mukammal" | "Yaxshi" | "Qoʻshimcha dars kerak" | "Oʻrtacha";
}

export interface ClassHomework {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submittedCount: number;
  totalCount: number;
  status: "active" | "checking" | "graded";
  labSimulationType?: "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d";
}

export interface ClassroomData {
  id: string;
  name: string;
  direction: string;
  headTeacher: string;
  room: string;
  weeklyHours: number;
  targetExam: string;
  students: ClassStudent[];
  topicsProgress: ClassTopicProgress[];
  homeworks: ClassHomework[];
  aiNotes: {
    generalSummary: string;
    focusArea: string;
    talentedStudents: string[];
    needsAttention: string[];
    parentMeetingDraft: string;
  };
}

export const INITIAL_CLASSROOMS: ClassroomData[] = [
  {
    id: "cls-10a",
    name: "10-A sinf",
    direction: "Aniq fanlar & Fizika-Matematika",
    headTeacher: "Rustam Muallim (Siz)",
    room: "304-fizika xonasi",
    weeklyHours: 6,
    targetExam: "DTM Milliy Sertifikat & Fan Olimpiadasi",
    students: [
      {
        id: "st-10a-1",
        name: "Azizbek Rahimov",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 96,
        parentName: "Dilshod Rahimov (Otasi)",
        parentPhone: "+998 90 123-45-67",
        note: "Fotoeffekt va 3D atom simulyatsiyasida aʼlo faollik koʻrsatdi",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Kvant fizikasi", "Vektor hisobi"],
      },
      {
        id: "st-10a-2",
        name: "Madina Karimova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 93,
        parentName: "Nodira Karimova (Onasi)",
        parentPhone: "+998 91 234-56-78",
        note: "Pifagor va fazoviy geometriya loyihasi toʻliq topshirildi",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Geometriya", "Optika"],
      },
      {
        id: "st-10a-3",
        name: "Jasur Bekmirzayev",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        attendance: "late",
        score: 78,
        parentName: "Rustambek Bekmirzayev (Otasi)",
        parentPhone: "+998 93 345-67-89",
        note: "Darsga 10 daqiqa kechikdi, mexanika formulalarini takrorlash kerak",
        lastHomework: "Tekshirilmoqda",
        status: "warning",
        strengths: ["Tajriba yigʻish"],
      },
      {
        id: "st-10a-4",
        name: "Ziyoda Umarova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 89,
        parentName: "Gulchehra Umarova (Onasi)",
        parentPhone: "+998 94 456-78-90",
        note: "Elektrodinamika savol-javoblarida faol qatnashdi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Termodinamika"],
      },
      {
        id: "st-10a-5",
        name: "Bekzod Aliyev",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        attendance: "absent",
        score: 64,
        parentName: "Shavkat Aliyev (Otasi)",
        parentPhone: "+998 97 567-89-01",
        note: "Sababsiz dars qoldirdi, ota-onasiga SMS yuborildi",
        lastHomework: "Topshirilmadi",
        status: "warning",
        strengths: ["Amaliy chizmalar"],
      },
      {
        id: "st-10a-6",
        name: "Nilufar Saidova",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        attendance: "excused",
        score: 87,
        parentName: "Lola Saidova (Onasi)",
        parentPhone: "+998 99 678-90-12",
        note: "Shifokor maʼlumotnomasi bilan sababli, topshiriqni mustaqil topshirdi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Nyuton mexanikasi"],
      },
    ],
    topicsProgress: [
      { topic: "Kinematika va Nyuton qonunlari", score: 94, status: "Mukammal" },
      { topic: "Pifagor teoremasi va 3D fazoviy vektorlar", score: 88, status: "Yaxshi" },
      { topic: "Om qonuni va zanjir hisobi", score: 82, status: "Yaxshi" },
      { topic: "Elektromagnit induksiya va oqim", score: 68, status: "Qoʻshimcha dars kerak" },
      { topic: "Kvant fizikasi & Fotoeffekt", score: 75, status: "Oʻrtacha" },
    ],
    homeworks: [
      {
        id: "hw-10a-1",
        title: "Nyutonning 2-qonuniga oid 5 ta murakkab masala",
        subject: "Fizika",
        dueDate: "20-Sentyabr, 2026",
        submittedCount: 5,
        totalCount: 6,
        status: "active",
        labSimulationType: "projectile",
      },
      {
        id: "hw-10a-2",
        title: "Pifagor teoremasi fazoviy kub simulyatsiyasi hisoboti",
        subject: "Geometriya & 3D Lab",
        dueDate: "23-Sentyabr, 2026",
        submittedCount: 6,
        totalCount: 6,
        status: "checking",
        labSimulationType: "pythagoras",
      },
    ],
    aiNotes: {
      generalSummary:
        "10-A sinf aniq fanlar yoʻnalishida yuqori salohiyatga ega. Oʻrtacha ball 84.5. Sinfning 70% oʻquvchilari laboratoriya ishlarida yetakchi.",
      focusArea:
        "Elektromagnit maydon va Faradey qonunida hisoblash xatolari kuzatilmoqda. 15 daqiqalik interaktiv 3D simulyatsiya koʻrsatish tavsiya etiladi.",
      talentedStudents: ["Azizbek Rahimov", "Madina Karimova"],
      needsAttention: ["Bekzod Aliyev (davomat)", "Jasur Bekmirzayev (formulalar)"],
      parentMeetingDraft:
        "Hurmatli 10-A sinf ota-onalari! Sentyabr oyi tahlili boʻyicha sinf davomati 86% ni, umumiy oʻzlashtirish esa 85 ballni tashkil etmoqda. Kelgusi haftada Respublika fan olimpiadasi saralash bosqichi oʻtkaziladi.",
    },
  },
  {
    id: "cls-10b",
    name: "10-B sinf",
    direction: "Muhandislik & Amaliy Geometriya",
    headTeacher: "Zulfiya Karimova",
    room: "208-geometriya zali",
    weeklyHours: 4,
    targetExam: "DTM & Muhandislik Loyihalari",
    students: [
      {
        id: "st-10b-1",
        name: "Shohrux Mirzayev",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 91,
        parentName: "Jamshid Mirzayev (Otasi)",
        parentPhone: "+998 90 333-22-11",
        note: "Fazoviy prizma va konus yasashda yetakchi",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Fazoviy geometriya", "Chizmachilik"],
      },
      {
        id: "st-10b-2",
        name: "Gulnoza Hakimova",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 88,
        parentName: "Zuhra Hakimova (Onasi)",
        parentPhone: "+998 91 444-55-66",
        note: "Stereometriya masalalarini aniq yechdi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Stereometriya"],
      },
      {
        id: "st-10b-3",
        name: "Sardor Qobilov",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        attendance: "late",
        score: 74,
        parentName: "Qobil Aliyev (Otasi)",
        parentPhone: "+998 93 555-66-77",
        note: "Vektorlar ayirmasida chalkashdi, qoʻshimcha konspekt berildi",
        lastHomework: "Topshirilmadi",
        status: "warning",
        strengths: ["Chizma chizish"],
      },
      {
        id: "st-10b-4",
        name: "Rayhona Yusupova",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 95,
        parentName: "Mansur Yusupov (Otasi)",
        parentPhone: "+998 94 666-77-88",
        note: "Fazoviy jismlar kesimlari boʻyicha aʼlo namoyish",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Planimetriya", "Vektorlar"],
      },
      {
        id: "st-10b-5",
        name: "Farhod Ergashev",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 82,
        parentName: "Nargiza Ergasheva (Onasi)",
        parentPhone: "+998 97 777-88-99",
        note: "Darsda intizomli, hisob-kitoblarni sinchiklab bajaradi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Hisoblash"],
      },
    ],
    topicsProgress: [
      { topic: "Fazoviy vektorlar va skalyar koʻpaytma", score: 90, status: "Mukammal" },
      { topic: "Stereometriya aksiomalari", score: 85, status: "Yaxshi" },
      { topic: "Koʻpyoqlar va aylanma jismlar", score: 76, status: "Oʻrtacha" },
      { topic: "Fazoda toʻgʻri chiziq va tekisliklar", score: 82, status: "Yaxshi" },
    ],
    homeworks: [
      {
        id: "hw-10b-1",
        title: "Pifagor teoremasi va fazoviy shakllar loyihasi",
        subject: "Geometriya",
        dueDate: "19-Sentyabr, 2026",
        submittedCount: 4,
        totalCount: 5,
        status: "checking",
        labSimulationType: "pythagoras",
      },
    ],
    aiNotes: {
      generalSummary:
        "10-B sinf stereometriya va fazoviy tasavvur boʻyicha yuqori intilishga ega. Oʻrtacha ball 86.0. Davomat 90%.",
      focusArea: "Aylanma jismlar (silindr, konus, shar) yuzasi va hajmi formulalarini amaliy loyihalar bilan mustahkamlash lozim.",
      talentedStudents: ["Rayhona Yusupova", "Shohrux Mirzayev"],
      needsAttention: ["Sardor Qobilov (uy vazifasi oʻz vaqtida topshirilishi nazoratda)"],
      parentMeetingDraft:
        "Hurmatli 10-B sinf ota-onalari! Geometriya darslarida oʻquvchilar 3D vizual modellar orqali fazoviy shakllarni chuqur oʻrganmoqda. Farzandlaringiz uy vazifalarini vaqtida topshirishini nazorat qilishingizni soʻraymiz.",
    },
  },
  {
    id: "cls-9v",
    name: "9-V sinf",
    direction: "Amaliy Fizika & 3D Laboratoriya",
    headTeacher: "Olimjon Vohidov",
    room: "Fizika Laboratoriya Binosi",
    weeklyHours: 4,
    targetExam: "Tayanch DTM & Oʻquvchilar Kengashi",
    students: [
      {
        id: "st-9v-1",
        name: "Daler Ismoilov",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 90,
        parentName: "Sanjar Ismoilov (Otasi)",
        parentPhone: "+998 90 888-11-22",
        note: "Elektr zanjirini yigʻish va ampermetr ulashda juda chaqqon",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Elektr zanjiri", "Amaliy tajriba"],
      },
      {
        id: "st-9v-2",
        name: "Kamola Tursunova",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 87,
        parentName: "Mavjuda Tursunova (Onasi)",
        parentPhone: "+998 91 999-22-33",
        note: "Optik linzalar formulasini yaxshi oʻzlashtirgan",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Geometrik optika"],
      },
      {
        id: "st-9v-3",
        name: "Javohir Yoʻldoshev",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 80,
        parentName: "Ilhom Yoʻldoshev (Otasi)",
        parentPhone: "+998 93 111-33-44",
        note: "Laboratoriya xavfsizlik qoidalariga rioya qildi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Tajribalar"],
      },
      {
        id: "st-9v-4",
        name: "Maftuna Zokirova",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        attendance: "absent",
        score: 68,
        parentName: "Munira Zokirova (Onasi)",
        parentPhone: "+998 94 222-44-55",
        note: "Sababsiz kelmadi, xabardor qilindi",
        lastHomework: "Topshirilmadi",
        status: "warning",
        strengths: ["Optika"],
      },
      {
        id: "st-9v-5",
        name: "Doniyor Boboyev",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 85,
        parentName: "Akmal Boboyev (Otasi)",
        parentPhone: "+998 97 333-55-66",
        note: "Prujinali tebranishlar va Guk qonunini toʻgʻri hisobladi",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Mexanik tebranishlar"],
      },
    ],
    topicsProgress: [
      { topic: "Elektr zanjiri va Om qonuni", score: 88, status: "Yaxshi" },
      { topic: "Optik linzalar va nurning sinishi", score: 84, status: "Yaxshi" },
      { topic: "Guk qonuni va prujinali mayatnik", score: 92, status: "Mukammal" },
      { topic: "Issiqlik miqdori va f.i.k", score: 71, status: "Oʻrtacha" },
    ],
    homeworks: [
      {
        id: "hw-9v-1",
        title: "Elektr zanjiri va Om qonuni simulyatsiya hisoboti",
        subject: "Fizika Lab",
        dueDate: "18-Sentyabr, 2026",
        submittedCount: 4,
        totalCount: 5,
        status: "graded",
        labSimulationType: "spring3d",
      },
      {
        id: "hw-9v-2",
        title: "Optik prizma orqali yorugʻlik dispersiyasi tahlili",
        subject: "Optika 3D Lab",
        dueDate: "24-Sentyabr, 2026",
        submittedCount: 2,
        totalCount: 5,
        status: "active",
        labSimulationType: "optics3d",
      },
    ],
    aiNotes: {
      generalSummary:
        "9-V sinfda amaliy laboratoriya ishtiyoqi yuqori. 3D simulyatsiyalar yordamida oʻzlashtirish 18% ga oshgan.",
      focusArea: "Issiqlik miqdori va f.i.k. hisoblashda formulalarni qoʻllash boʻyicha qoʻshimcha 20 daqiqa seminar oʻtkazish maqsadga muvofiq.",
      talentedStudents: ["Daler Ismoilov", "Kamola Tursunova"],
      needsAttention: ["Maftuna Zokirova (dars qoldirishining oldini olish)"],
      parentMeetingDraft:
        "Hurmatli 9-V sinf ota-onalari! Oʻquvchilar fizik hodisalarni 3D virtual laboratoriyada amaliy sinovdan oʻtkazmoqda. Ularning faolligi quvonarli darajada yuqori.",
    },
  },
  {
    id: "cls-11a",
    name: "11-A sinf",
    direction: "DTM Intensiv & Milliy Sertifikat Abituriyent",
    headTeacher: "Anvar Qosimov",
    room: "310-intensiv auditoriya",
    weeklyHours: 8,
    targetExam: "DTM Maksimal 189 Ball & Universitet Granti",
    students: [
      {
        id: "st-11a-1",
        name: "Shahboz Joʻrayev",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 98,
        parentName: "Farrux Joʻrayev (Otasi)",
        parentPhone: "+998 90 777-11-00",
        note: "Katta Bilim Marafonida 42.195 km ni xatosiz yakunladi, DTM 100%",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["DTM Blitz", "Yadro fizikasi", "Integrallar"],
      },
      {
        id: "st-11a-2",
        name: "Dildora Qodirova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 95,
        parentName: "Salima Qodirova (Onasi)",
        parentPhone: "+998 91 888-22-11",
        note: "Fizikadan Milliy Sertifikat 'A+' darajaga tayyor",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Kvant mexanikasi", "Optika"],
      },
      {
        id: "st-11a-3",
        name: "Bobur Shodiyev",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 91,
        parentName: "Ulugʻbek Shodiyev (Otasi)",
        parentPhone: "+998 93 999-33-22",
        note: "Elektrodinamika va tebranishlar masalalarini tez yechmoqda",
        lastHomework: "Topshirildi (5)",
        status: "active",
        strengths: ["Tebranishlar", "Magnit maydon"],
      },
      {
        id: "st-11a-4",
        name: "Shahnoza Xoliqova",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        attendance: "present",
        score: 89,
        parentName: "Ozoda Xoliqova (Onasi)",
        parentPhone: "+998 94 000-44-33",
        note: "Matematik tahlil va Nyuton mexanikasi boʻyicha aʼlo",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Hisob-kitob", "Termodinamika"],
      },
      {
        id: "st-11a-5",
        name: "Temur Rustamov",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
        attendance: "late",
        score: 84,
        parentName: "Rustam Aliyev (Otasi)",
        parentPhone: "+998 97 111-55-44",
        note: "Test yechish tezligini oshirish ustida ishlamoqda",
        lastHomework: "Topshirildi (4)",
        status: "active",
        strengths: ["Kinematika"],
      },
    ],
    topicsProgress: [
      { topic: "DTM Kvant va Yadro fizikasi", score: 96, status: "Mukammal" },
      { topic: "Murakkab zanjirlar va Kirxgof qoidalari", score: 92, status: "Mukammal" },
      { topic: "Magnit maydonida zaryad harakati (Lorens)", score: 90, status: "Mukammal" },
      { topic: "Toʻlqin optikasi & Difraksiya panjarasi", score: 86, status: "Yaxshi" },
    ],
    homeworks: [
      {
        id: "hw-11a-1",
        title: "DTM 30 talik sinov testi (Fizika 2026 yangi format)",
        subject: "DTM Abituriyent",
        dueDate: "21-Sentyabr, 2026",
        submittedCount: 5,
        totalCount: 5,
        status: "graded",
      },
      {
        id: "hw-11a-2",
        title: "Atomning Bor modeli va vodorod spektri 3D tahlili",
        subject: "Fizika 3D Lab",
        dueDate: "25-Sentyabr, 2026",
        submittedCount: 4,
        totalCount: 5,
        status: "active",
        labSimulationType: "atom3d",
      },
    ],
    aiNotes: {
      generalSummary:
        "11-A bitiruvchi sinfida intizom va DTM testlariga tayyorgarlik darajasi 93%. Shahboz va Dildora 100% grant olish imkoniyatiga ega.",
      focusArea: "Vaqt boshqaruvi: har bir DTM savoliga 1.5 daqiqadan oshmagan vaqt sarflash texnikasini takomillashtirish.",
      talentedStudents: ["Shahboz Joʻrayev", "Dildora Qodirova", "Bobur Shodiyev"],
      needsAttention: ["Temur Rustamov (test topshirish tezligi)"],
      parentMeetingDraft:
        "Hurmatli 11-A sinf bitiruvchilari ota-onalari! Sinfimiz DTM sinovlarida maktab boʻyicha 1-oʻrinni egallab kelmoqda. Grant oʻrinlariga daʼvogarlarimiz koʻp. Ruxsatnomalar va hujjatlar oʻz vaqtida tayyorlanmoqda.",
    },
  },
];
