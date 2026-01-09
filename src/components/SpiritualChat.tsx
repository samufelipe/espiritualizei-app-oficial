import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { sendMessageToAssistant as sendChatMessage } from '../services/geminiService';
import { Send, Loader2, Sparkles, User, Bot, Trash2 } from 'lucide-react';

interface SpiritualChatProps {
  user: UserProfile;
  onClose?: () => void;
}

const SpiritualChat: React.FC<SpiritualChatProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: 'greeting',
        role: 'model',
        text: `Olá, ${user.name}! 👋\n\nSou seu diretor espiritual virtual. Estou aqui para ajudá-lo em sua jornada de fé.\n\nPosso ajudar com:\n• Dúvidas sobre a fé católica\n• Orientação para oração\n• Reflexões sobre as leituras\n• Discernimento espiritual\n\nComo posso ajudá-lo hoje?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [user.name]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputText.trim(), user);
      
      const assistantMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        text: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    const greeting: ChatMessage = {
      id: 'greeting-new',
      role: 'model',
      text: `Conversa reiniciada. Como posso ajudá-lo, ${user.name}?`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-violet/20 rounded-full flex items-center justify-center">
            <Sparkles className="text-brand-violet" size={20} />
          </div>
          <div>
            <h2 className="font-semibold">Diretor Espiritual</h2>
            <p className="text-xs text-slate-400">Orientação católica com IA</p>
          </div>
        </div>
        <button
          onClick={handleClearChat}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="Limpar conversa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-brand-violet' : 'bg-white/10'
              }`}
            >
              {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-brand-violet text-white rounded-tr-sm'
                  : 'bg-white/10 text-slate-200 rounded-tl-sm'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Pensando...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-violet focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-3 bg-brand-violet hover:bg-brand-violet-dark rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          As respostas são geradas por IA e não substituem orientação sacerdotal.
        </p>
      </div>
    </div>
  );
};

export default SpiritualChat;
