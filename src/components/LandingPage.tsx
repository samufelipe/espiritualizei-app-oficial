import React from 'react';
import { ArrowRight, Sparkles, Heart, Shield, Flame, Star, Cross, Church, Book, CheckCircle2 } from 'lucide-react';
import BrandLogo from './BrandLogo';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  const features = [
    { icon: Cross, title: 'Rotina Personalizada', description: 'Práticas espirituais adaptadas ao seu momento de vida' },
    { icon: Book, title: 'Liturgia Diária', description: 'Leituras do dia e reflexões para sua meditação' },
    { icon: Heart, title: 'Comunidade', description: 'Ore com milhares de católicos ao redor do Brasil' },
    { icon: Church, title: 'Paróquias Próximas', description: 'Encontre igrejas e horários de missa perto de você' },
  ];

  const testimonials = [
    { name: 'Maria S.', text: 'Finalmente consegui criar uma rotina de oração consistente!', avatar: '👩' },
    { name: 'João P.', text: 'O app me ajudou a voltar para a Igreja depois de anos.', avatar: '👨' },
    { name: 'Ana L.', text: 'As reflexões diárias são incríveis. Recomendo!', avatar: '👩‍🦰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-dark via-brand-dark to-purple-950">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <BrandLogo size={24} />
        <button
          onClick={onLogin}
          className="text-sm text-slate-300 hover:text-white transition-colors"
        >
          Já tenho conta
        </button>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-violet/20 rounded-full text-brand-violet text-sm mb-6">
          <Sparkles size={16} />
          Sua jornada espiritual começa aqui
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Transforme sua vida<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-purple-400">
            com fé e consistência
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Crie hábitos espirituais saudáveis com rotinas personalizadas, 
          comunidade ativa e acompanhamento inteligente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-violet hover:bg-brand-violet-dark rounded-xl font-medium text-lg transition-colors"
          >
            Começar Gratuitamente
            <ArrowRight size={20} />
          </button>
          <button
            onClick={onLogin}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-lg transition-colors"
          >
            Entrar na Minha Conta
          </button>
        </div>

        <p className="text-sm text-slate-500 mt-4">
          Grátis para sempre. Sem cartão de crédito.
        </p>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo que você precisa para crescer na fé
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-violet/50 transition-colors"
            >
              <div className="w-12 h-12 bg-brand-violet/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="text-brand-violet" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{t.avatar}</span>
                <div>
                  <p className="font-medium">{t.name}</p>
                  <div className="flex gap-0.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
              <p className="text-slate-300 italic">"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-brand-violet/30 to-purple-900/30 border border-brand-violet/30 rounded-3xl p-8 md:p-12 text-center">
          <Flame className="mx-auto text-brand-violet mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Junte-se a milhares de católicos que já estão transformando suas vidas espirituais.
          </p>
          <button
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-violet hover:bg-brand-violet-dark rounded-xl font-medium text-lg transition-colors mx-auto"
          >
            Criar Minha Conta
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <BrandLogo size={24} />
          <p>© 2024 Espiritualizei. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Termos</a>
            <a href="#" className="hover:text-slate-300">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
