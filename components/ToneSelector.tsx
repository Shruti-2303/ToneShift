'use client';

import { Briefcase, Heart, Sparkles, Users, Zap, MessageCircle } from 'lucide-react';

const tones = [
  { id: 'professional', label: 'Professional', icon: Briefcase, color: 'text-slate-700' },
  { id: 'friendly', label: 'Friendly', icon: Heart, color: 'text-slate-700' },
  { id: 'casual', label: 'Casual', icon: MessageCircle, color: 'text-slate-700' },
  { id: 'formal', label: 'Formal', icon: Users, color: 'text-slate-700' },
  { id: 'enthusiastic', label: 'Enthusiastic', icon: Zap, color: 'text-slate-700' },
  { id: 'clear', label: 'Clear & Simple', icon: Sparkles, color: 'text-slate-700' },
];

interface ToneSelectorProps {
  selectedTone: string;
  onToneSelect: (tone: string) => void;
}

export default function ToneSelector({ selectedTone, onToneSelect }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {tones.map(({ id, label, icon: Icon, color }) => {
        const isSelected = selectedTone === id;
        return (
          <button
            key={id}
            onClick={() => onToneSelect(id)}
            className={`p-3 border rounded-xl transition-all duration-200 flex items-center gap-2.5 ${
              isSelected
                ? 'bg-indigo-50 border-indigo-600 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : color}`} />
            <span className={`font-medium text-sm text-left ${isSelected ? 'text-indigo-700' : color}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
