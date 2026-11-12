import React, { useState } from 'react';
import { NutrisliceDayMenu } from '../types';
import { X, Plus, Trash2, RotateCcw, Volume2, Waves, Save, Check } from 'lucide-react';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyMenu: Record<string, NutrisliceDayMenu>;
  onSaveMenu: (newMenu: Record<string, NutrisliceDayMenu>) => void;
  onResetToday: () => void;
  enableAudio: boolean;
  onToggleAudio: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  onClose,
  weeklyMenu,
  onSaveMenu,
  onResetToday,
  enableAudio,
  onToggleAudio
}) => {
  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [menuCopy, setMenuCopy] = useState<Record<string, NutrisliceDayMenu>>(weeklyMenu);
  const [newEntreeInput, setNewEntreeInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentDayData = menuCopy[activeDay] || {
    dayName: activeDay,
    entrees: [],
    sides: [],
    specialNote: ''
  };

  const addEntree = () => {
    if (!newEntreeInput.trim()) return;
    const updated = {
      ...menuCopy,
      [activeDay]: {
        ...currentDayData,
        entrees: [...currentDayData.entrees, newEntreeInput.trim()]
      }
    };
    setMenuCopy(updated);
    setNewEntreeInput('');
  };

  const removeEntree = (index: number) => {
    const updated = {
      ...menuCopy,
      [activeDay]: {
        ...currentDayData,
        entrees: currentDayData.entrees.filter((_, i) => i !== index)
      }
    };
    setMenuCopy(updated);
  };

  const handleSave = () => {
    onSaveMenu(menuCopy);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Parent Control & Menu Setup
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Load Nutrislice lunch menus the night before & configure check-ins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* Section: Nutrislice Weekly Menu Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏫</span> Nutrislice Cafeteria Menus
              </h4>
              <span className="text-xs text-indigo-600 font-semibold">
                Kids see this when choosing school lunch
              </span>
            </div>

            {/* Day Selector Pills */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-4 overflow-x-auto">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                    activeDay === day
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Active Day Menu Editor */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-700">
                  {activeDay}'s Entrees
                </span>
                <span className="text-xs text-slate-400">
                  {currentDayData.entrees.length} entrees listed
                </span>
              </div>

              {/* Entrees list */}
              <div className="space-y-2">
                {currentDayData.entrees.map((entree, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">#{idx + 1}</span>
                      <span>{entree}</span>
                    </span>
                    <button
                      onClick={() => removeEntree(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Entree input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder={`Add an entree from Nutrislice for ${activeDay}...`}
                  value={newEntreeInput}
                  onChange={(e) => setNewEntreeInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addEntree()}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addEntree}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Special Note / Title */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Day Label / Theme (e.g. "Taco Tuesday", "Pizza Friday")
                </label>
                <input
                  type="text"
                  value={currentDayData.specialNote || ''}
                  onChange={(e) => {
                    setMenuCopy({
                      ...menuCopy,
                      [activeDay]: {
                        ...currentDayData,
                        specialNote: e.target.value
                      }
                    });
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional day theme"
                />
              </div>
            </div>
          </div>

          {/* Section: Quick Actions & Toggles */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Quick Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Reset Morning Button */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-800">
                    Reset Morning
                  </div>
                  <div className="text-xs text-slate-500">
                    Clear today's checks for all kids
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Reset all 3 kids' morning check-ins for a fresh start?")) {
                      onResetToday();
                      onClose();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-rose-600 text-xs font-bold hover:bg-rose-50 shadow-sm transition"
                >
                  Reset
                </button>
              </div>

              {/* Sound Audio Toggle */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-bold text-sm text-slate-800">
                      Audio Effects
                    </div>
                    <div className="text-xs text-slate-500">
                      {enableAudio ? 'Sound enabled' : 'Muted'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onToggleAudio}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    enableAudio
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {enableAudio ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Swim Day Note */}
            <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs flex items-center gap-3">
              <Waves className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <span className="font-bold">Swim Schedule:</span> Monday through Thursday automatically triggers the swim bag gear checklist (goggles, swim equipment, towel) for Jessica, Megan, and Andrew.
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200/60 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center gap-1.5"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
