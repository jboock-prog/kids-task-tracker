import React, { useState } from 'react';
import { KidProfile, MorningChecklistState, NutrisliceDayMenu } from '../types';
import {
  ArrowLeft,
  Check,
  Laptop,
  BookOpen,
  PenTool,
  Waves,
  Utensils,
  Sparkles,
  Smile,
  ShieldCheck,
  GlassWater,
  Shirt,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playDingSound, playCelebrationSound } from '../utils/audio';

interface KidCheckinViewProps {
  kid: KidProfile;
  state: MorningChecklistState;
  onUpdateState: (newState: MorningChecklistState) => void;
  onBack: () => void;
  isSwimDay: boolean;
  todayMenu: NutrisliceDayMenu;
  dayName: string;
}

export const KidCheckinView: React.FC<KidCheckinViewProps> = ({
  kid,
  state,
  onUpdateState,
  onBack,
  isSwimDay,
  todayMenu,
  dayName
}) => {
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Toggle individual task
  const toggleTask = (taskId: string) => {
    playDingSound();
    const newChecked = {
      ...state.checkedTasks,
      [taskId]: !state.checkedTasks[taskId]
    };

    const newState = {
      ...state,
      checkedTasks: newChecked
    };

    // Check if everything is now complete
    checkCompletion(newState);
  };

  // Update lunch selection
  const selectLunchType = (type: 'school' | 'home', specificChoice?: string) => {
    playDingSound();
    const newLunch = {
      type,
      nutrisliceChoice: type === 'school' ? (specificChoice || todayMenu.entrees[0] || 'School Entree') : undefined,
      details: type === 'home' ? (specificChoice || 'Home Packed') : undefined
    };

    const newState = {
      ...state,
      lunch: newLunch
    };

    checkCompletion(newState);
  };

  // Check if all required items for this child are checked
  const checkCompletion = (updatedState: MorningChecklistState) => {
    const requiredItems: string[] = ['homework', 'water_bottle', 'teeth_morning'];

    if (kid.needsComputer) requiredItems.push('pack_computer');
    if (kid.needsSignatures) requiredItems.push('signatures');

    if (isSwimDay) {
      requiredItems.push('swim_bag', 'swim_goggles', 'swim_equipment', 'swim_towel');
    }

    const allTasksDone = requiredItems.every(item => Boolean(updatedState.checkedTasks[item]));
    const lunchDone = updatedState.lunch.type !== 'unselected';

    const isFullyComplete = allTasksDone && lunchDone;

    if (isFullyComplete && !updatedState.isCompleted) {
      triggerCelebration();
    }

    onUpdateState({
      ...updatedState,
      isCompleted: isFullyComplete,
      completedAt: isFullyComplete ? new Date().toISOString() : undefined
    });
  };

  const triggerCelebration = () => {
    playCelebrationSound();
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    setShowCelebrationModal(true);
  };

  // Calculate task counts
  const requiredItemKeys: string[] = ['homework', 'water_bottle', 'teeth_morning'];
  if (kid.needsComputer) requiredItemKeys.push('pack_computer');
  if (kid.needsSignatures) requiredItemKeys.push('signatures');
  if (isSwimDay) {
    requiredItemKeys.push('swim_bag', 'swim_goggles', 'swim_equipment', 'swim_towel');
  }

  const completedCount = requiredItemKeys.filter(key => Boolean(state.checkedTasks[key])).length + (state.lunch.type !== 'unselected' ? 1 : 0);
  const totalCount = requiredItemKeys.length + 1; // +1 for lunch choice
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 pb-24">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>All Kids</span>
        </button>

        <div className="flex items-center gap-2">
          {progressPercent === 100 ? (
            <span className="flex items-center gap-1.5 bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl shadow-sm text-sm">
              <ShieldCheck className="w-4 h-4" /> Ready for Launch!
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Kid Banner Card */}
      <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r ${kid.bgGradient} text-white shadow-lg mb-8 relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl shadow-inner border border-white/30 shrink-0">
            {kid.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {kid.name}'s Morning Check-In
              </h2>
            </div>
            <p className="text-white/90 text-sm sm:text-base font-semibold">
              {kid.grade} · Age {kid.age} · {dayName}'s Launch Checklist
            </p>
            {kid.customNotes && (
              <p className="text-white/80 text-xs mt-1.5 bg-black/10 inline-block px-3 py-1 rounded-full border border-white/10">
                📌 {kid.customNotes}
              </p>
            )}
          </div>
        </div>

        {/* Big Progress Bar in Banner */}
        <div className="mt-5 relative z-10">
          <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5 backdrop-blur-sm">
            <div
              className="bg-white h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* SECTION 1: LUNCH DECISION (Nutrislice vs Home) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
              🥪
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                1. What's for Lunch Today?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Choose School Nutrislice cafeteria or packed lunch from home
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Lunch Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                state.lunch.type === 'school'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
              }`}
            >
              <div
                className="flex items-center justify-between mb-3"
                onClick={() => selectLunchType('school', todayMenu.entrees[0])}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <h4 className="font-bold text-base text-slate-800">
                      School Lunch (Nutrislice)
                    </h4>
                    <span className="text-xs font-semibold text-indigo-600">
                      {todayMenu.specialNote || "Today's Cafeteria Menu"}
                    </span>
                  </div>
                </div>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                  state.lunch.type === 'school'
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-slate-300 bg-white'
                }`}>
                  {state.lunch.type === 'school' && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Nutrislice Entree Options */}
              <div className="mt-3 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pick Today's Entree ({dayName}):
                </p>
                {todayMenu.entrees.map((entree) => (
                  <label
                    key={entree}
                    onClick={() => selectLunchType('school', entree)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition ${
                      state.lunch.type === 'school' && state.lunch.nutrisliceChoice === entree
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🍽️</span>
                      <span>{entree}</span>
                    </span>
                    {state.lunch.type === 'school' && state.lunch.nutrisliceChoice === entree && (
                      <Check className="w-4 h-4 stroke-[3]" />
                    )}
                  </label>
                ))}

                {/* Sides preview */}
                <div className="pt-2 text-xs text-slate-500 border-t border-slate-200/80">
                  <span className="font-bold text-slate-600">Sides available: </span>
                  {todayMenu.sides.join(', ')}
                </div>
              </div>
            </div>

            {/* Home Lunch Card */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                state.lunch.type === 'home'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
              }`}
            >
              <div>
                <div
                  className="flex items-center justify-between mb-3"
                  onClick={() => selectLunchType('home', 'Sandwich / Bento')}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🥪</span>
                    <div>
                      <h4 className="font-bold text-base text-slate-800">
                        Home Lunch
                      </h4>
                      <span className="text-xs font-semibold text-emerald-600">
                        Packed from home
                      </span>
                    </div>
                  </div>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                    state.lunch.type === 'home'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {state.lunch.type === 'home' && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 font-medium mb-3">
                  Packed in lunchbox with ice pack, snacks, and drink.
                </p>

                {/* Home Lunch Quick Tags */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Sandwich / Rollup', 'Bento Box', 'Warm Thermos', 'Snack Pack'].map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => selectLunchType('home', choice)}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        state.lunch.type === 'home' && state.lunch.details === choice
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>

              {state.lunch.type === 'home' && (
                <div className="mt-4 p-2.5 rounded-xl bg-emerald-100/70 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Selected: {state.lunch.details || 'Home Lunch'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: SWIM PRACTICE GEAR (Mon - Thu) */}
        {isSwimDay ? (
          <div className="bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 rounded-3xl p-5 sm:p-7 border-2 border-cyan-300 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                  🏊‍♂️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                      2. Swim Bag Ready (Mon–Thu)
                    </h3>
                    <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-200">
                      Practice Today
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    All 3 kids swim today — pack goggles, equipment & towel!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'swim_bag', title: 'Swim Bag Packed', desc: 'Main backpack / duffel ready by door', icon: '🎒' },
                { id: 'swim_goggles', title: 'Goggles Packed', desc: 'Anti-fog goggles & spare strap', icon: '🥽' },
                { id: 'swim_equipment', title: 'Equipment & Cap', desc: 'Fins, kickboard, pull buoy & swim cap', icon: '🏊' },
                { id: 'swim_towel', title: 'Clean Dry Towel', desc: 'Large absorbent swim towel', icon: '🧖' }
              ].map((item) => {
                const isChecked = Boolean(state.checkedTasks[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                      isChecked
                        ? 'bg-cyan-500 text-white border-cyan-500 shadow-md'
                        : 'bg-white text-slate-800 border-cyan-200/80 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className={`font-bold text-sm sm:text-base ${isChecked ? 'text-white' : 'text-slate-800'}`}>
                          {item.title}
                        </h4>
                        <p className={`text-xs ${isChecked ? 'text-cyan-100' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-white text-cyan-600 border-white'
                        : 'border-slate-300 bg-slate-50'
                    }`}>
                      {isChecked && <Check className="w-5 h-5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between text-slate-500 text-sm">
            <div className="flex items-center gap-2.5">
              <Waves className="w-5 h-5 text-slate-400" />
              <span className="font-semibold">No Swim Practice Today ({dayName}) — Leave swim gear at home</span>
            </div>
            <span className="text-xs bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full">
              Day Off
            </span>
          </div>
        )}

        {/* SECTION 3: SCHOOL & BACKPACK ESSENTIALS */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
              🎒
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {isSwimDay ? '3.' : '2.'} School Essentials Checklist
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Make sure everything is in the backpack before leaving
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Computer / Laptop (Required for Jessica & Megan) */}
            {kid.needsComputer && (
              <div
                onClick={() => toggleTask('pack_computer')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                  state.checkedTasks['pack_computer']
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-indigo-50/50 text-slate-800 border-indigo-200 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    state.checkedTasks['pack_computer'] ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm sm:text-base">
                        Computer Packed
                      </h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        state.checkedTasks['pack_computer'] ? 'bg-indigo-700 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        Daily Must
                      </span>
                    </div>
                    <p className={`text-xs ${state.checkedTasks['pack_computer'] ? 'text-indigo-100' : 'text-slate-500'}`}>
                      Laptop + charging cord packed in bag
                    </p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                  state.checkedTasks['pack_computer']
                    ? 'bg-white text-indigo-600 border-white'
                    : 'border-slate-300 bg-white'
                }`}>
                  {state.checkedTasks['pack_computer'] && <Check className="w-5 h-5 stroke-[3]" />}
                </div>
              </div>
            )}

            {/* Homework to bring back */}
            <div
              onClick={() => toggleTask('homework')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                state.checkedTasks['homework']
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                  : 'bg-emerald-50/40 text-slate-800 border-emerald-200 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  state.checkedTasks['homework'] ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Homework Folder
                  </h4>
                  <p className={`text-xs ${state.checkedTasks['homework'] ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Completed homework packed to bring back
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                state.checkedTasks['homework']
                  ? 'bg-white text-emerald-600 border-white'
                  : 'border-slate-300 bg-white'
              }`}>
                {state.checkedTasks['homework'] && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </div>

            {/* Parent Signatures */}
            <div
              onClick={() => toggleTask('signatures')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                state.checkedTasks['signatures']
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'bg-purple-50/40 text-slate-800 border-purple-200 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  state.checkedTasks['signatures'] ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                }`}>
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Signed Papers & Slips
                  </h4>
                  <p className={`text-xs ${state.checkedTasks['signatures'] ? 'text-purple-100' : 'text-slate-500'}`}>
                    Agenda / permission slips signed by Mom/Dad
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                state.checkedTasks['signatures']
                  ? 'bg-white text-purple-600 border-white'
                  : 'border-slate-300 bg-white'
              }`}>
                {state.checkedTasks['signatures'] && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </div>

            {/* Water Bottle Filled */}
            <div
              onClick={() => toggleTask('water_bottle')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                state.checkedTasks['water_bottle']
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-blue-50/40 text-slate-800 border-blue-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  state.checkedTasks['water_bottle'] ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                }`}>
                  <GlassWater className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Cold Water Bottle
                  </h4>
                  <p className={`text-xs ${state.checkedTasks['water_bottle'] ? 'text-blue-100' : 'text-slate-500'}`}>
                    Fresh water filled & side pocket loaded
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                state.checkedTasks['water_bottle']
                  ? 'bg-white text-blue-600 border-white'
                  : 'border-slate-300 bg-white'
              }`}>
                {state.checkedTasks['water_bottle'] && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </div>

            {/* Morning Routine / Teeth */}
            <div
              onClick={() => toggleTask('teeth_morning')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 select-none active:scale-[0.98] ${
                state.checkedTasks['teeth_morning']
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'bg-amber-50/40 text-slate-800 border-amber-200 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  state.checkedTasks['teeth_morning'] ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Smile className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    Teeth Brushed & Clothes On
                  </h4>
                  <p className={`text-xs ${state.checkedTasks['teeth_morning'] ? 'text-amber-100' : 'text-slate-500'}`}>
                    Fresh breath, shoes & coat ready
                  </p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 ${
                state.checkedTasks['teeth_morning']
                  ? 'bg-white text-amber-600 border-white'
                  : 'border-slate-300 bg-white'
              }`}>
                {state.checkedTasks['teeth_morning'] && <Check className="w-5 h-5 stroke-[3]" />}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Done & Return to Home Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onBack}
          className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition flex items-center justify-center gap-2 ${
            progressPercent === 100
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
              : 'bg-slate-800 hover:bg-slate-900 text-white active:scale-95'
          }`}
        >
          {progressPercent === 100 ? (
            <>
              <ShieldCheck className="w-6 h-6" />
              <span>{kid.name} is All Done! Back to Kiosk</span>
            </>
          ) : (
            <>
              <span>Save & Back to Kiosk ({completedCount}/{totalCount} Ready)</span>
            </>
          )}
        </button>
      </div>

      {/* Celebration Modal Overlay */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-pop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-emerald-400">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 animate-bounce">
              🌟
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
              Way to go, {kid.name}!
            </h3>
            <p className="text-slate-600 font-medium mb-4 text-sm sm:text-base">
              You are 100% packed and ready for school today! Have an amazing day!
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left text-xs text-slate-700 mb-6 space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Lunch:</span>
                <span className="font-bold text-indigo-700">
                  {state.lunch.type === 'school' ? state.lunch.nutrisliceChoice : state.lunch.details || 'Home Lunch'}
                </span>
              </div>
              {isSwimDay && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Swim Practice:</span>
                  <span className="font-bold text-cyan-700">Bag & Gear Packed 🏊‍♂️</span>
                </div>
              )}
              {kid.needsComputer && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Computer:</span>
                  <span className="font-bold text-emerald-700">Packed 💻</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowCelebrationModal(false);
                onBack();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-2xl shadow-md transition"
            >
              Back to Morning Screen
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
