import { KidProfile, NutrisliceDayMenu } from '../types';

export const INITIAL_KIDS: KidProfile[] = [
  {
    id: 'jessica',
    name: 'Jessica',
    age: 10,
    grade: '5th Grade',
    avatar: '🦄',
    themeColor: 'purple',
    bgGradient: 'from-fuchsia-500 to-indigo-600',
    borderClass: 'border-fuchsia-400',
    badgeClass: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
    needsComputer: true,
    needsHomework: true,
    needsSignatures: true,
    swimDays: [1, 2, 3, 4], // Mon - Thu
    customNotes: '5th Grade Chromebook + Charger & Reading Log'
  },
  {
    id: 'megan',
    name: 'Megan',
    age: 8,
    grade: '2nd Grade',
    avatar: '🐬',
    themeColor: 'emerald',
    bgGradient: 'from-teal-400 to-emerald-600',
    borderClass: 'border-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    needsComputer: true,
    needsHomework: true,
    needsSignatures: true,
    swimDays: [1, 2, 3, 4], // Mon - Thu
    customNotes: '2nd Grade Laptop & Homework Folder'
  },
  {
    id: 'andrew',
    name: 'Andrew',
    age: 6,
    grade: '1st Grade',
    avatar: '🦖',
    themeColor: 'amber',
    bgGradient: 'from-amber-400 to-orange-500',
    borderClass: 'border-amber-400',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    needsComputer: false,
    needsHomework: true,
    needsSignatures: true,
    swimDays: [1, 2, 3, 4], // Mon - Thu
    customNotes: '1st Grade Take-Home Folder & Library Books'
  }
];

export const INITIAL_WEEKLY_MENU: Record<string, NutrisliceDayMenu> = {
  Monday: {
    dayName: 'Monday',
    entrees: ['Crispy Chicken Tenders w/ Roll', 'Baked Mac & Cheese', 'Sunbutter & Jelly Sandwich'],
    sides: ['Steamed Sweet Corn', 'Fresh Apple Slices', 'Baby Carrots with Ranch'],
    specialNote: 'Nutrislice Hot Lunch'
  },
  Tuesday: {
    dayName: 'Tuesday',
    entrees: ['Warm Beef Taco Boat', 'Cheese Quesadilla', 'Turkey Deli Sub'],
    sides: ['Fiesta Black Beans', 'Salsa & Tortilla Chips', 'Chilled Diced Pears'],
    specialNote: 'Taco Tuesday!'
  },
  Wednesday: {
    dayName: 'Wednesday',
    entrees: ['Classic Spaghetti & Meatballs', 'Cheesy Garlic Flatbread', 'Yogurt & Pretzel Bento'],
    sides: ['Seasoned Green Beans', 'Garden Side Salad', 'Fresh Orange Smiles'],
    specialNote: 'Pasta Day'
  },
  Thursday: {
    dayName: 'Thursday',
    entrees: ['BBQ Pulled Chicken Sliders', 'Golden Mozzarella Sticks w/ Marinara', 'Turkey & Cheese Wrap'],
    sides: ['Crispy Tater Tots', 'Cucumber Slices', 'Fresh Seedless Grapes'],
    specialNote: 'Chef Special'
  },
  Friday: {
    dayName: 'Friday',
    entrees: ['Stuffed Crust Cheese Pizza', 'Pepperoni Pizza Slice', 'Veggie Box with Hummus'],
    sides: ['Steamed Broccoli florets', 'Watermelon Wedges', 'Fruit Juice Cup'],
    specialNote: 'Pizza Friday 🎉'
  }
};
