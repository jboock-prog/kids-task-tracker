export interface KidProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  avatar: string;
  themeColor: 'purple' | 'rose' | 'amber' | 'emerald' | 'blue' | 'indigo';
  bgGradient: string;
  borderClass: string;
  badgeClass: string;
  needsComputer: boolean;
  needsHomework: boolean;
  needsSignatures: boolean;
  swimDays: number[]; // 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri
  customNotes?: string;
}

export interface LunchChoice {
  type: 'school' | 'home' | 'unselected';
  details?: string;
  nutrisliceChoice?: string;
}

export interface MorningChecklistState {
  kidId: string;
  dateString: string;
  lunch: LunchChoice;
  checkedTasks: Record<string, boolean>;
  isCompleted: boolean;
  completedAt?: string;
}

export interface NutrisliceDayMenu {
  dayName: string;
  entrees: string[];
  sides: string[];
  specialNote?: string;
}

export interface ParentSettings {
  enableAudio: boolean;
  swimEnabledMonThu: boolean;
  nutrisliceWeeklyMenu: Record<string, NutrisliceDayMenu>; // 'Monday', 'Tuesday', etc.
}
