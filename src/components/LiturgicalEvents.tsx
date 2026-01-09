import React, { useState, useEffect } from 'react';
import { LiturgyDay } from '../types';
import { fetchRealDailyLiturgy as fetchLiturgy } from '../services/liturgyService';
import { Calendar, Book, Cross, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface LiturgicalEventsProps {
  onClose?: () => void;
}

const COLOR_MAP: Record<string, string> = {
  verde: 'bg-green-500',
  roxo: 'bg-purple-500',
  branco: 'bg-white',
  vermelho: 'bg-red-500',
  rosa: 'bg-pink-400',
};

const LiturgicalEvents: React.FC<LiturgicalEventsProps> = ({ onClose }) => {
  const [liturgy, setLiturgy] = useState<LiturgyDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadLiturgy();
  }, [currentDate]);

  const loadLiturgy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiturgy();
      setLiturgy(data);
    } catch (err) {
      setError('Não foi possível carregar a liturgia.');
    } finally {
      setLoading(false);
    }
  };

  const navigateDay = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-brand-violet" />
      </div>
    );
  }

  if (error || !liturgy) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Cross size={48} className="mx-auto mb-4 opacity-50" />
        <p>{error || 'Liturgia não disponível.'}</p>
        <button
          onClick={loadLiturgy}
          className="mt-4 px-4 py-2 bg-brand-violet/20 text-brand-violet rounded-lg hover:bg-brand-violet/30"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const liturgicalColor = liturgy.liturgicalColor?.toLowerCase() || 'verde';

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-brand-violet" />
            Liturgia do Dia
          </h1>
          <p className="text-slate-400 text-sm mt-1">{liturgy.season}</p>
        </div>
        <div className={`w-6 h-6 rounded-full ${COLOR_MAP[liturgicalColor] || 'bg-green-500'} border border-white/20`} />
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
        <button
          onClick={() => navigateDay(-1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="font-medium capitalize">{formatDate(currentDate)}</p>
          {liturgy.saint && <p className="text-sm text-brand-violet mt-1">{liturgy.saint}</p>}
        </div>
        <button
          onClick={() => navigateDay(1)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Readings */}
      <div className="space-y-4">
        {/* First Reading */}
        {liturgy.readings.first && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-brand-violet mb-2">
              <Book size={16} />
              <span className="text-sm font-medium">Primeira Leitura</span>
              <span className="text-slate-400 text-xs">({liturgy.readings.first.ref})</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{liturgy.readings.first.text}</p>
          </div>
        )}

        {/* Psalm */}
        {liturgy.readings.psalm && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <span className="text-sm font-medium">Salmo Responsorial</span>
              <span className="text-slate-400 text-xs">({liturgy.readings.psalm.ref})</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed italic">{liturgy.readings.psalm.text}</p>
          </div>
        )}

        {/* Second Reading (if exists) */}
        {liturgy.readings.second && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Book size={16} />
              <span className="text-sm font-medium">Segunda Leitura</span>
              <span className="text-slate-400 text-xs">({liturgy.readings.second.ref})</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{liturgy.readings.second.text}</p>
          </div>
        )}

        {/* Gospel */}
        {liturgy.readings.gospel && (
          <div className="bg-gradient-to-br from-brand-violet/20 to-purple-900/20 border border-brand-violet/30 rounded-xl p-4">
            <div className="flex items-center gap-2 text-brand-violet mb-2">
              <Cross size={16} />
              <span className="text-sm font-medium">Evangelho</span>
              <span className="text-slate-400 text-xs">({liturgy.readings.gospel.ref})</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">{liturgy.readings.gospel.text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiturgicalEvents;
