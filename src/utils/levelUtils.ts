// Utility for calculating student levels, titles, and XP thresholds

export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  nextLevelXP: number;
  xpInCurrentLevel: number;
  xpNeededForNext: number;
  progressPercent: number;
  badgeIcon: string;
  badgeColor: string;
}

// Level thresholds:
// LVL 1: 0 - 150 XP
// LVL 2: 151 - 350 XP
// LVL 3: 351 - 650 XP
// LVL 4: 651 - 1050 XP
// LVL 5: 1051 - 1550 XP
// LVL 6: 1551 - 2200 XP
// LVL 7: 2201 - 3000 XP
// LVL 8: 3001 - 4000 XP
// LVL 9: 4001 - 5200 XP
// LVL 10+: 5201+ XP

const LEVEL_THRESHOLDS = [
  { level: 1, minXP: 0, title: "1-Daraja: Yosh Izlanuvchi", badgeIcon: "🌱", badgeColor: "from-emerald-500 to-teal-600" },
  { level: 2, minXP: 150, title: "2-Daraja: Laborant-Tadqiqotchi", badgeIcon: "🔬", badgeColor: "from-cyan-500 to-blue-600" },
  { level: 3, minXP: 350, title: "3-Daraja: Fan Amaliyotchisi", badgeIcon: "⚡", badgeColor: "from-indigo-500 to-purple-600" },
  { level: 4, minXP: 650, title: "4-Daraja: Nazariyotchi Olim", badgeIcon: "📐", badgeColor: "from-violet-500 to-pink-600" },
  { level: 5, minXP: 1050, title: "5-Daraja: Kvant Koshifi", badgeIcon: "⚛️", badgeColor: "from-amber-500 to-orange-600" },
  { level: 6, minXP: 1550, title: "6-Daraja: Fanlar Magistri", badgeIcon: "🎓", badgeColor: "from-rose-500 to-red-600" },
  { level: 7, minXP: 2200, title: "7-Daraja: Kvant Akademigi", badgeIcon: "👑", badgeColor: "from-yellow-400 to-amber-600" },
  { level: 8, minXP: 3000, title: "8-Daraja: Buyuk Alloma", badgeIcon: "🌌", badgeColor: "from-fuchsia-500 to-cyan-500" },
  { level: 9, minXP: 4000, title: "9-Daraja: Nobel Nomzodi", badgeIcon: "✨", badgeColor: "from-amber-300 via-rose-500 to-indigo-600" },
  { level: 10, minXP: 5200, title: "10-Daraja: Koinot Donishmandi", badgeIcon: "🪐", badgeColor: "from-indigo-400 via-purple-500 to-amber-400" },
];

export function calculateLevel(xp: number): LevelInfo {
  const safeXP = Math.max(0, xp || 0);

  let currentIdx = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (safeXP >= LEVEL_THRESHOLDS[i].minXP) {
      currentIdx = i;
    } else {
      break;
    }
  }

  const currentConfig = LEVEL_THRESHOLDS[currentIdx];
  const nextConfig = LEVEL_THRESHOLDS[currentIdx + 1];

  if (!nextConfig) {
    // Max level reached
    return {
      level: currentConfig.level,
      title: currentConfig.title,
      minXP: currentConfig.minXP,
      nextLevelXP: currentConfig.minXP + 1500,
      xpInCurrentLevel: safeXP - currentConfig.minXP,
      xpNeededForNext: 1500,
      progressPercent: 100,
      badgeIcon: currentConfig.badgeIcon,
      badgeColor: currentConfig.badgeColor,
    };
  }

  const minXP = currentConfig.minXP;
  const nextLevelXP = nextConfig.minXP;
  const xpNeededForNext = nextLevelXP - minXP;
  const xpInCurrentLevel = safeXP - minXP;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100))
  );

  return {
    level: currentConfig.level,
    title: currentConfig.title,
    minXP,
    nextLevelXP,
    xpInCurrentLevel,
    xpNeededForNext,
    progressPercent,
    badgeIcon: currentConfig.badgeIcon,
    badgeColor: currentConfig.badgeColor,
  };
}
