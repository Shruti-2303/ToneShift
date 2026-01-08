'use client';

import { Briefcase, Heart, Sparkles, Users, Zap, MessageCircle } from 'lucide-react';

const tones = [
  { id: 'professional', label: 'Professional', icon: Briefcase, color: 'text-blue-600 bg-blue-50/50 hover:bg-blue-50 border-blue-100', selectedBorder: 'border-blue-500' },
  { id: 'friendly', label: 'Friendly', icon: Heart, color: 'text-rose-600 bg-rose-50/50 hover:bg-rose-50 border-rose-100', selectedBorder: 'border-rose-500' },
  { id: 'casual', label: 'Casual', icon: MessageCircle, color: 'text-amber-600 bg-amber-50/50 hover:bg-amber-50 border-amber-100', selectedBorder: 'border-amber-500' },
  { id: 'formal', label: 'Formal', icon: Users, color: 'text-slate-600 bg-slate-50/50 hover:bg-slate-50 border-slate-100', selectedBorder: 'border-slate-500' },
  { id: 'enthusiastic', label: 'Enthusiastic', icon: Zap, color: 'text-orange-600 bg-orange-50/50 hover:bg-orange-50 border-orange-100', selectedBorder: 'border-orange-500' },
  { id: 'clear', label: 'Clear & Simple', icon: Sparkles, color: 'text-teal-600 bg-teal-50/50 hover:bg-teal-50 border-teal-100', selectedBorder: 'border-teal-500' },
];

interface ToneSelectorProps {
  selectedTone: string;
  onToneSelect: (tone: string) => void;
}

export default function ToneSelector({ selectedTone, onToneSelect }: ToneSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {tones.map(({ id, label, icon: Icon, color, selectedBorder }) => (
        <button
          key={id}
          onClick={() => onToneSelect(id)}
          className={`p-2.5 border rounded-lg transition-all duration-150 flex items-center gap-2 ${color} ${
            selectedTone === id 
              ? `bg-white shadow-sm ${selectedBorder}` 
              : 'hover:shadow-sm'
          }`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="font-medium text-xs text-left">{label}</span>
        </button>
      ))}
    </div>
  );
}
