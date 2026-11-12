import React, { useState, useEffect } from 'react';
import { KidProfile, MorningChecklistState, NutrisliceDayMenu } from './types';
import { INITIAL_KIDS, INITIAL_WEEKLY_MENU } from './data/defaults';
import { KioskHeader } from './components/KioskHeader';
import { KidSelectorCard } from './components/KidSelectorCard';
import { KidCheckinView } from './components/KidCheckinView';
import { ParentSettingsModal } from './components/ParentSettingsModal';
import { Sparkles, Trophy, CheckCircle2, ShieldCheck, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCelebrationSound } from './utils/audio';

const STORAGE_KEY_STATES = 'kids_checkin_states_v1';
const STORAGE_KEY_MENU = 'kids_nutrislice_menu_v1';
const STORAGE_KEY_AUDIO = 'kids_audio_enabled_v1';

export function App() {
  const [kids] = useState<KidProfile[]>(INITIAL_KIDS);
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);
  const [selectedDayOverride, setSelectedDayOverride] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Nutrislice Menu stored in state and localStorage
  const [weeklyMenu, setWeeklyMenu] = useState<Record<string, NutrisliceDayMenu>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MENU);
      return saved ? JSON.parse(saved) : INITIAL_WEEKLY_MENU;
    } catch {
      return INITIAL_WEEKLY_MENU;
    }
  });

  // Calculate current day and formatted date string
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const realDayName = dayNames[now.getDay()];
  const currentDayName = selectedDayOverride || (realDayName === 'Sunday' || realDayName === 'Saturday' ? 'Monday' : realDayName);

  // Swim day is Monday - Thursday (days 1, 2, 3, 4)
  const isSwimDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(currentDayName);

  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Checklist states for each child keyed by date and kidId
  const todayDateKey = `${now.toISOString().slice(0, 10)}_${currentDayName}`;

  const [checkinStates, setCheckinStates] = useState<Record<string, MorningChecklistState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // initialize empty for all kids
    const initial: Record<string, MorningChecklistState> = {};
    INITIAL_KIDS.forEach(k => {
      initial[k.id] = {
        kidId: k.id,
        dateString: todayDateKey,
        lunch: { type: 'unselected' },
        checkedTasks: {},
        isCompleted: false
      };
    });
    return initial;
  });

  // Save states to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATES, JSON.stringify(checkinStates));
    } catch {
      // ignore
    }
  }, [checkinStates]);

  // Save menu changes
  const handleSaveMenu = (newMenu: Record<string, NutrisliceDayMenu>) => {
    setWeeklyMenu(newMenu);
    try {
      localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(newMenu));
    } catch {
      // ignore
    }
  };

  // Reset all check-ins for the day
  const handleResetToday = () => {
    const resetStates: Record<string, MorningChecklistState> = {};
    kids.forEach(k => {
      resetStates[k.id] = {
        kidId: k.id,
        dateString: todayDateKey,
        lunch: { type: 'unselected' },
        checkedTasks: {},
        isCompleted: false
      };
    });
    setCheckinStates(resetStates);
    setSelectedKidId(null);
  };

  // Get or create state for a specific kid
  const getKidState = (kidId: string): MorningChecklistState => {
    return checkinStates[kidId] || {
      kidId,
      dateString: todayDateKey,
      lunch: { type: 'unselected' },
      checkedTasks: {},
      isCompleted: false
    };
  };

  const handleUpdateKidState = (newState: MorningChecklistState) => {
    setCheckinStates(prev => ({
      ...prev,
      [newState.kidId]: newState
    }));
  };

  // Count items for each kid
  const getKidTaskMetrics = (kid: KidProfile) => {
    const requiredItemKeys: string[] = ['homework', 'water_bottle', 'teeth_morning'];
    if (kid.needsComputer) requiredItemKeys.push('pack_computer');
    if (kid.needsSignatures) requiredItemKeys.push('signatures');
    if (isSwimDay) {
      requiredItemKeys.push('swim_bag', 'swim_goggles', 'swim_equipment', 'swim_towel');
    }

    const state = getKidState(kid.id);
    const checkedCount = requiredItemKeys.filter(k => Boolean(state.checkedTasks[k])).length + (state.lunch.type !== 'unselected' ? 1 : 0);
    const totalCount = requiredItemKeys.length + 1; // +1 for lunch decision
    return { checkedCount, totalCount, isComplete: checkedCount === totalCount && state.lunch.type !== 'unselected' };
  };

  const allKidsComplete = kids.every(k => getKidTaskMetrics(k).isComplete);

  // Trigger grand celebration if all 3 are complete
  useEffect(() => {
    if (allKidsComplete && kids.length > 0) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  }, [allKidsComplete]);

  const selectedKid = kids.find(k => k.id === selectedKidId);
  const todayMenu = weeklyMenu[currentDayName] || INITIAL_WEEKLY_MENU['Monday'];

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans">
      
      {/* Header */}
      <KioskHeader
        currentDayName={currentDayName}
        formattedDate={formattedDate}
        isSwimDay={isSwimDay}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetToday={handleResetToday}
        selectedDayOverride={selectedDayOverride}
        onSelectDayOverride={setSelectedDayOverride}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {selectedKid ? (
          // Kid individual checklist view
          <KidCheckinView
            kid={selectedKid}
            state={getKidState(selectedKid.id)}
            onUpdateState={handleUpdateKidState}
            onBack={() => setSelectedKidId(null)}
            isSwimDay={isSwimDay}
            todayMenu={todayMenu}
            dayName={currentDayName}
          />
        ) : (
          // Kiosk Home Screen with all 3 kids
          <div className="space-y-6">

            {/* Banner: Overall Morning Status */}
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm transition-all ${
              allKidsComplete
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-200'
                : 'bg-white border-slate-200/90 text-slate-800'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${
                    allKidsComplete ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {allKidsComplete ? '🏆' : '☀️'}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {allKidsComplete
                        ? 'All 3 Kids Ready for School!'
                        : "Morning Launchpad Check-In"}
                    </h2>
                    <p className={`text-sm sm:text-base font-semibold ${allKidsComplete ? 'text-white/90' : 'text-slate-500'}`}>
                      {allKidsComplete
                        ? 'Backpacks packed, lunches chosen, swim bags ready. Out the door on time!'
                        : 'Tap your name below to pack your backpack, pick your lunch, and check your gear.'}
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  {allKidsComplete ? (
                    <div className="flex items-center gap-2 bg-white text-emerald-800 font-extrabold px-4 py-2 rounded-2xl shadow-sm text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>100% Launch Ready</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-slate-100 text-slate-700 font-bold px-3.5 py-2 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Morning in Progress</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kids Cards Grid (Touch targets for iPad) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kids.map((kid) => {
                const metrics = getKidTaskMetrics(kid);
                return (
                  <KidSelectorCard
                    key={kid.id}
                    kid={kid}
                    state={getKidState(kid.id)}
                    isSwimDay={isSwimDay}
                    onSelect={() => setSelectedKidId(kid.id)}
                    totalTasksCount={metrics.totalCount}
                    completedTasksCount={metrics.checkedCount}
                  />
                );
              })}
            </div>

            {/* Today's Nutrislice Cafeteria Preview on Kiosk Home */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                    🏫
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">
                      Nutrislice Lunch Menu for {currentDayName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Loaded for morning selection ({todayMenu.specialNote || 'School Lunch'})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
                >
                  Edit Menu
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {todayMenu.entrees.map((entree, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-sm font-semibold text-slate-700"
                  >
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="truncate">{entree}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-600">Daily Sides & Fruits:</span>
                <span>{todayMenu.sides.join(' · ')}</span>
              </div>
            </div>

            {/* Quick Tips for iPad Kiosk */}
            <div className="text-center text-xs text-slate-400 py-2">
              💡 iPad Tip: Tap the Share button in Safari and choose <strong>"Add to Home Screen"</strong> to run as a full-screen kiosk app.
            </div>

          </div>
        )}

      </main>

      {/* Parent Settings Modal */}
      <ParentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        weeklyMenu={weeklyMenu}
        onSaveMenu={handleSaveMenu}
        onResetToday={handleResetToday}
        enableAudio={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
      />

    </div>
  );
}

export default App;
