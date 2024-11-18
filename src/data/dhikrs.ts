export interface Dhikr {
  id: number;
  title: string;
  arabicText: string;
  meaning: string;
  target?: number;
  startValue: number;
  countDirection: 'up' | 'down';
  vibrateNearEnd: boolean;
  soundOnComplete: boolean;
  resetPeriod: 'daily' | 'weekly';
  vibrateThreshold?: number;
  lastReset?: string;
}

export const dhikrs: Dhikr[] = [
  {
    id: 1,
    title: "Sübhanallah",
    arabicText: "سُبْحَانَ ٱللَّٰهِ",
    meaning: "Allah'ı tüm eksikliklerden tenzih ederim",
    target: 33,
    startValue: 0,
    countDirection: 'up',
    vibrateNearEnd: true,
    soundOnComplete: true,
    resetPeriod: 'daily',
    vibrateThreshold: 3
  },
  {
    id: 2,
    title: "Elhamdülillah",
    arabicText: "ٱلْحَمْدُ لِلَّٰهِ",
    meaning: "Hamd Allah'a mahsustur",
    target: 33,
    startValue: 0,
    countDirection: 'up',
    vibrateNearEnd: true,
    soundOnComplete: true,
    resetPeriod: 'daily',
    vibrateThreshold: 3
  },
  {
    id: 3,
    title: "Allahu Ekber",
    arabicText: "اللّٰهُ أَكْبَرُ",
    meaning: "Allah en büyüktür",
    target: 33,
    startValue: 0,
    countDirection: 'up',
    vibrateNearEnd: true,
    soundOnComplete: true,
    resetPeriod: 'daily',
    vibrateThreshold: 3
  },
  {
    id: 4,
    title: "La ilahe illallah",
    arabicText: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ",
    meaning: "Allah'tan başka ilah yoktur",
    target: 100,
    startValue: 0,
    countDirection: 'up',
    vibrateNearEnd: true,
    soundOnComplete: true,
    resetPeriod: 'daily',
    vibrateThreshold: 5
  }
];