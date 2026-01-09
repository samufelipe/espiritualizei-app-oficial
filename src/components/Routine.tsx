import React, { useState } from 'react';
import { RoutineItem, RoutineActionType } from '../types';
import { CheckCircle2, Circle, Sun, Moon, Coffee, Clock, Book, Cross, Flame, Heart, Shield, Music, Church, Star, Plus, Trash2 } from 'lucide-react';

interface RoutineProps {
  items: RoutineItem[];
  onToggle: (id: string) => void;
  onActionClick?: (action: RoutineActionType) => void;
  onAddItem?: (item: Omit<RoutineItem, 'id' | 'completed'>) => void;
  onDeleteItem?: (id: string) => void;
}

const ICON_MAP: Record<RoutineItem['icon'], React.FC<{ size?: number; className?: string }>> = {
  rosary: Circle,
  book: Book,
  cross: Cross,
  candle: Flame,
  sun: Sun,
  heart: Heart,
  shield: Shield,
  moon: Moon,
  church: Church,
  music: Music,
};

const TIME_LABELS: Record<RoutineItem['timeOfDay'], { label: string; icon: React.FC<any> }> = {
  morning: { label: 'Manhã', icon: Sun },
  afternoon: { label: 'Tarde', icon: Coffee },
  night: { label: 'Noite', icon: Moon },
  any: { label: 'Qualquer hora', icon: Clock },
};

const Routine: React.FC<RoutineProps> = ({ items, onToggle, onActionClick, onAddItem, onDeleteItem }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const time = item.timeOfDay;
    if (!acc[time]) acc[time] = [];
    acc[time].push(item);
    return acc;
  }, {} as Record<string, RoutineItem[]>);

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minha Rotina</h1>
          <p className="text-slate-400 text-sm mt-1">{completedCount} de {items.length} práticas concluídas</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-3 py-2 bg-brand-violet/20 hover:bg-brand-violet/30 text-brand-violet rounded-lg transition-colors"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-violet to-brand-violet-light transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-6">
        {(['morning', 'afternoon', 'night', 'any'] as const).map(timeOfDay => {
          const timeItems = groupedItems[timeOfDay];
          if (!timeItems || timeItems.length === 0) return null;
          
          const { label, icon: TimeIcon } = TIME_LABELS[timeOfDay];

          return (
            <div key={timeOfDay} className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400">
                <TimeIcon size={16} />
                <span className="text-sm font-medium">{label}</span>
              </div>
              
              <div className="space-y-2">
                {timeItems.map(item => {
                  const Icon = ICON_MAP[item.icon] || Star;
                  
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        item.completed 
                          ? 'bg-brand-violet/10 border-brand-violet/30' 
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <button
                        onClick={() => onToggle(item.id)}
                        className={`flex-shrink-0 transition-colors ${
                          item.completed ? 'text-brand-violet' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={item.completed ? 'text-brand-violet' : 'text-slate-400'} />
                          <h3 className={`font-medium ${item.completed ? 'line-through text-slate-400' : ''}`}>
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5 truncate">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-violet bg-brand-violet/10 px-2 py-1 rounded-full">
                          +{item.xpReward} XP
                        </span>
                        {onDeleteItem && (
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Circle size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma prática na sua rotina ainda.</p>
          <p className="text-sm mt-1">Complete o onboarding para gerar sua rotina personalizada.</p>
        </div>
      )}
    </div>
  );
};

export default Routine;
