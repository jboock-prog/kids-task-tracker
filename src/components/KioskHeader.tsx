import React from 'react';
import { Settings, Calendar, Waves, Sparkles, RefreshCw } from 'lucide-react';

interface KioskHeaderProps {
  currentDayName: string;
  formattedDate: string;
  isSwimDay: boolean;
  onOpenSettings: () => void;
  onResetToday: () => void;
  selectedDayOverride: string | null;
  onSelectDayOverride: (day: string | null) => void;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const KioskHeader: React.FC<KioskHeaderProps> = ({
  currentDayName,
  formattedDate,
  isSwimDay,
  onOpenSettings,
  onResetToday,
  selectedDayOverride,
  onSelectDayOverride
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: App Title and Date */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100 text-white text-2xl animate-pop">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
                  Morning Launchpad
                </h1>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                  iPad Kiosk
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
                {selectedDayOverride && (
                  <span className="bg-amber-100 text-amber-800 text-[11px] px-1.5 py-0.2 rounded font-bold">
                    (Simulating {selectedDayOverride})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Quick controls on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Swim Day Status Badge */}
        {isSwimDay ? (
          <div className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-3.5 py-1.5 rounded-xl shadow-sm text-xs sm:text-sm font-bold tracking-wide animate-pulse">
            <Waves className="w-4 h-4 animate-bounce" />
            <span>SWIM DAY TODAY (Mon–Thu) · Pack Swim Bag!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>No Swim Practice Today</span>
          </div>
        )}

        {/* Right: Day Simulator selector & Settings buttons */}
        <div className="hidden md:flex items-center gap-2">
          {/* Day tester pill */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => onSelectDayOverride(null)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedDayOverride === null
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real Today
            </button>
            {WEEKDAYS.map((day) => (
              <button
                key={day}
                onClick={() => onSelectDayOverride(day)}
                className={`px-2 py-1 rounded-lg font-medium transition ${
                  selectedDayOverride === day
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <button
            onClick={onResetToday}
            title="Reset Today's Check-ins"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition flex items-center gap-1 text-xs font-semibold px-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold px-3 border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Parents</span>
          </button>
        </div>

      </div>
    </header>
  );
};
