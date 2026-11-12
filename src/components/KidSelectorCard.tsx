import React from 'react';
import { KidProfile, MorningChecklistState } from '../types';
import { CheckCircle2, ChevronRight, Waves, Laptop, Utensils, Star, AlertCircle } from 'lucide-react';

interface KidSelectorCardProps {
  kid: KidProfile;
  state: MorningChecklistState;
  isSwimDay: boolean;
  onSelect: () => void;
  totalTasksCount: number;
  completedTasksCount: number;
}

export const KidSelectorCard: React.FC<KidSelectorCardProps> = ({
  kid,
  state,
  isSwimDay,
  onSelect,
  totalTasksCount,
  completedTasksCount
}) => {
  const isAllDone = totalTasksCount > 0 && completedTasksCount === totalTasksCount && state.lunch.type !== 'unselected';
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return (
    <div
      onClick={onSelect}
      className={`relative overflow-hidden rounded-3xl bg-white border-2 transition-all duration-200 cursor-pointer text-left active:scale-[0.98] select-none shadow-md hover:shadow-xl ${
        isAllDone
          ? 'border-emerald-400 bg-gradient-to-b from-white to-emerald-50/50 shadow-emerald-100 ring-4 ring-emerald-200/50'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      {/* Top Banner with Kid's Theme Gradient */}
      <div className={`h-4 bg-gradient-to-r ${kid.bgGradient}`} />

      <div className="p-5 sm:p-6">
        {/* Header Row: Avatar, Name, Grade & Status Icon */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${kid.bgGradient} flex items-center justify-center text-3xl shadow-md text-white font-fun shrink-0 transform -rotate-1`}>
              {kid.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {kid.name}
                </h3>
                {isAllDone && (
                  <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    <Star className="w-3 h-3 fill-white" /> Ready!
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-500">
                {kid.grade} · {kid.age} yrs
              </p>
            </div>
          </div>

          <div className="shrink-0 pt-1">
            {isAllDone ? (
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ChevronRight className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className={isAllDone ? 'text-emerald-700' : 'text-slate-600'}>
              {isAllDone ? 'All Checklist Items Ready!' : 'Morning Progress'}
            </span>
            <span className={isAllDone ? 'text-emerald-600' : 'text-slate-500'}>
              {completedTasksCount} of {totalTasksCount} items
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAllDone ? 'bg-emerald-500' : `bg-gradient-to-r ${kid.bgGradient}`
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Glance Badges (Lunch, Swim, Computer) */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Lunch Badge */}
          <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
            state.lunch.type === 'school'
              ? 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
              : state.lunch.type === 'home'
              ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <Utensils className="w-4 h-4 shrink-0 text-amber-500" />
            <div className="truncate">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lunch</span>
              <span className="font-bold truncate block">
                {state.lunch.type === 'school' ? (state.lunch.nutrisliceChoice || 'School Lunch') : state.lunch.type === 'home' ? 'Home Lunch' : 'Not Chosen'}
              </span>
            </div>
          </div>

          {/* Swim Bag Badge */}
          {isSwimDay ? (
            <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              state.checkedTasks['swim_bag'] && state.checkedTasks['swim_goggles'] && state.checkedTasks['swim_equipment'] && state.checkedTasks['swim_towel']
                ? 'bg-cyan-50 border-cyan-200 text-cyan-900 font-medium'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <Waves className="w-4 h-4 shrink-0 text-cyan-600" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Swim Bag</span>
                <span className="font-bold truncate block">
                  {state.checkedTasks['swim_bag'] && state.checkedTasks['swim_goggles'] ? 'Packed 🏊‍♂️' : 'Needs Pack!'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 flex items-center gap-2">
              <Waves className="w-4 h-4 shrink-0 text-slate-300" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Swim</span>
                <span className="font-medium text-slate-400">Off Today</span>
              </div>
            </div>
          )}

          {/* Computer Badge (Jessica & Megan) */}
          {kid.needsComputer && (
            <div className={`p-2.5 rounded-xl border col-span-2 flex items-center justify-between gap-2 ${
              state.checkedTasks['pack_computer']
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-2 truncate">
                <Laptop className="w-4 h-4 shrink-0 text-indigo-600" />
                <span className="font-semibold text-xs truncate">
                  Laptop / Computer
                </span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                state.checkedTasks['pack_computer']
                  ? 'bg-indigo-200 text-indigo-800'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {state.checkedTasks['pack_computer'] ? 'Packed' : 'Unpacked'}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className={`w-full mt-4 py-3 rounded-2xl font-bold text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-sm ${
            isAllDone
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {isAllDone ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Review {kid.name}'s Check-In</span>
            </>
          ) : (
            <>
              <span>Tap to Check In {kid.name}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>
    </div>
  );
};
