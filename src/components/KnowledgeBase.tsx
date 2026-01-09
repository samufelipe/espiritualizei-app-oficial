import React, { useState } from 'react';
import { KnowledgeItem } from '../types';
import { Book, Cross, Church, Heart, Clock, Search, ChevronRight, X, Star } from 'lucide-react';

interface KnowledgeBaseProps {
  onClose?: () => void;
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: '1',
    title: 'O que é a Eucaristia?',
    description: 'Entenda o sacramento central da fé católica',
    content: 'A Eucaristia é o sacramento no qual Jesus Cristo está verdadeiramente presente sob as aparências do pão e do vinho. É o centro e o ápice de toda a vida cristã...',
    category: 'doctrine',
    duration: '5 min',
  },
  {
    id: '2',
    title: 'Como rezar o Terço',
    description: 'Guia passo a passo para a oração do Rosário',
    content: 'O Terço é uma forma de meditação sobre os mistérios da vida de Jesus e Maria. Consiste em cinco dezenas de Ave-Marias, cada uma precedida por um Pai-Nosso...',
    category: 'prayer',
    duration: '10 min',
  },
  {
    id: '3',
    title: 'Partes da Missa',
    description: 'Compreenda cada momento da celebração eucarística',
    content: 'A Missa é dividida em quatro partes principais: Ritos Iniciais, Liturgia da Palavra, Liturgia Eucarística e Ritos Finais...',
    category: 'mass',
    duration: '8 min',
  },
  {
    id: '4',
    title: 'São Francisco de Assis',
    description: 'Vida e espiritualidade do Poverello',
    content: 'São Francisco de Assis (1181-1226) foi um dos santos mais amados da história. Fundador da Ordem Franciscana, ele é conhecido por sua pobreza radical e amor pela natureza...',
    category: 'saints',
    duration: '7 min',
  },
  {
    id: '5',
    title: 'Os Sete Sacramentos',
    description: 'Sinais eficazes da graça de Deus',
    content: 'Os sete sacramentos são: Batismo, Confirmação, Eucaristia, Penitência, Unção dos Enfermos, Ordem e Matrimônio...',
    category: 'doctrine',
    duration: '12 min',
  },
  {
    id: '6',
    title: 'Lectio Divina',
    description: 'Método de oração com a Sagrada Escritura',
    content: 'A Lectio Divina é um método tradicional de oração com a Bíblia. Consiste em quatro etapas: Leitura (Lectio), Meditação (Meditatio), Oração (Oratio) e Contemplação (Contemplatio)...',
    category: 'prayer',
    duration: '6 min',
  },
];

const CATEGORY_ICONS: Record<KnowledgeItem['category'], React.FC<{ size?: number; className?: string }>> = {
  doctrine: Book,
  prayer: Heart,
  mass: Church,
  saints: Star,
};

const CATEGORY_LABELS: Record<KnowledgeItem['category'], string> = {
  doctrine: 'Doutrina',
  prayer: 'Oração',
  mass: 'Missa',
  saints: 'Santos',
};

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeItem['category'] | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const filteredItems = KNOWLEDGE_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: (KnowledgeItem['category'] | 'all')[] = ['all', 'doctrine', 'prayer', 'mass', 'saints'];

  if (selectedItem) {
    const Icon = CATEGORY_ICONS[selectedItem.category];
    return (
      <div className="p-4 md:p-6 space-y-6">
        <button
          onClick={() => setSelectedItem(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight className="rotate-180" size={18} />
          Voltar
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl bg-brand-violet/20`}>
              <Icon className="text-brand-violet" size={24} />
            </div>
            <div>
              <span className="text-xs text-brand-violet uppercase tracking-wider">
                {CATEGORY_LABELS[selectedItem.category]}
              </span>
              <h1 className="text-2xl font-bold">{selectedItem.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Clock size={14} />
            <span>Leitura de {selectedItem.duration}</span>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed">{selectedItem.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Book className="text-brand-violet" />
          Base de Conhecimento
        </h1>
        <p className="text-slate-400 text-sm mt-1">Aprenda mais sobre a fé católica</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar artigos..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-brand-violet focus:outline-none"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-violet text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {filteredItems.map(item => {
          const Icon = CATEGORY_ICONS[item.category];
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-brand-violet/50 transition-colors text-left"
            >
              <div className="p-3 rounded-xl bg-brand-violet/20">
                <Icon className="text-brand-violet" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-slate-400 truncate">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock size={14} />
                <span className="text-xs">{item.duration}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Book size={48} className="mx-auto mb-4 opacity-50" />
          <p>Nenhum artigo encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
