export type UserRole = "student" | "teacher" | "professor";

export interface DailyQuest {
  id: string;
  title: string;
  description?: string;
  rewardXP: number;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  schoolOrCity: string;
  avatar: string;
  streak: number;
  xp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  password?: string;
  role?: UserRole;
  grade: string;
  school: string;
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  inventory: string[];
  lastActiveDate: string;
  completedChapterIds: string[];
  unlockedBadgeIds: string[];
  dailyQuests: DailyQuest[];
  subscription?: "free" | "classic" | "premium";
  subscriptionPeriod?: "month" | "year";
  subscriptionExpiresAt?: string;
  dtmCoupons?: number;
  customTitle?: string;
  avatarFrame?: string;
  bannerTheme?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export interface LessonSection {
  title: string;
  body: string;
  analogy?: string;
  interactiveWidget?: string;
  widgetData?: any;
}

export interface LessonChapter {
  id: string;
  title: string;
  durationMinutes: number;
  xpReward: number;
  coinsReward: number;
  summary: string;
  traditionalVsDigital: {
    traditional: string;
    smartEdu: string;
  };
  contentSections: LessonSection[];
  simulation?: {
    type: string;
    title: string;
    description: string;
  };
  quiz: QuizQuestion[];
}

export interface SubjectModule {
  id: string;
  title: string;
  gradeLevel: string;
  description: string;
  iconName: string;
  accentColor: string;
  chapters: LessonChapter[];
}

export interface LabTask {
  id: string;
  labType: "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d";
  dimension: "2d" | "3d";
  title: string;
  description: string;
  targetCriteria: string;
  hint: string;
  xpReward: number;
  coinsReward: number;
}

export type DayOfWeek = "Dushanba" | "Seshanba" | "Chorshanba" | "Payshanba" | "Juma" | "Shanba";

export interface ScheduleLesson {
  id: string;
  dayOfWeek?: DayOfWeek;
  date: string;        // e.g. "2026-09-19"
  formattedDate?: string; // e.g. "19-Sentabr, 2026"
  quarter?: 1 | 2 | 3 | 4; // 1 to 4 quarters of school year
  periodIndex: number; // 1 to 6
  startTime: string;   // e.g. "08:30"
  endTime: string;     // e.g. "09:15"
  subject: string;     // e.g. "Fizika", "Geometriya", "Algebra"
  className: string;   // e.g. "10-A", "10-B", "9-V"
  room: string;        // e.g. "304-Fizika Lab"
  topic: string;       // e.g. "Pifagor teoremasi va 3D fazo"
  lessonType: "theory" | "lab" | "quiz" | "exam";
  teacherName: string;
  isCompleted?: boolean;
  labSimulationType?: "pythagoras" | "atom3d" | "optics3d" | "projectile" | "spring3d";
}
