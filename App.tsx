
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import MessageBubble from './components/MessageBubble';
import { Message, Role, ChatSession } from './types';
import { bizConsultAI } from './services/geminiService';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, scrollToBottom]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'Nueva Consultoría',
      messages: [
        {
          role: Role.MODEL,
          content: "BIENVENIDO A BIZCONSULT AI\n\nEstoy aquí para ayudarte a escalar tu negocio con estrategias concretas.\n\nNOTA: SOY UNA INTELIGENCIA ARTIFICIAL Y NO PROPORCIONO ASESORÍA LEGAL, FISCAL NI FINANCIERA PERSONALIZADA. CONSULTA CON PROFESIONALES.\n\nPara empezar, por favor cuéntame:\n\n1. ¿A qué sector pertenece tu negocio?\n2. ¿Cuál es tu modelo de ingresos actual?\n3. ¿Cuál es el mayor reto que enfrentas hoy?",
          timestamp: new Date()
        }
      ],
      createdAt: new Date()

        const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  };
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    bizConsultAI.startChat();
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const session = sessions.find(s => s.id === id);
    if (session) {
      bizConsultAI.startChat(session.messages);
    }
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (updated.length === 0) {
        setTimeout(() => handleNewChat(), 100);
        return [];
      }
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
        bizConsultAI.startChat(updated[0].messages);
      }
      return updated;
    });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = {
      role: Role.USER,
      content: input,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length === 1 ? input.substring(0, 30) + '...' : s.title;
        return { 
          ...s, 
          title: newTitle,
          messages: [...s.messages, userMessage] 
        };
      }
      return s;
    }));

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const aiMessagePlaceholder: Message = {
        role: Role.MODEL,
        content: '',
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, aiMessagePlaceholder] }
          : s
      ));

      let fullResponse = '';
      const stream = bizConsultAI.sendMessageStream(currentInput);

      for await (const chunk of stream) {
        if (chunk) {
          fullResponse += chunk;
          setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
              const updatedMessages = [...s.messages];
              updatedMessages[updatedMessages.length - 1].content = fullResponse;
              return { ...s, messages: updatedMessages };
            }
            return s;
          }));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: Role.MODEL,
        content: "ERROR DE CONEXIÓN\n\nNo se pudo procesar la solicitud. Por favor intenta de nuevo.",
        timestamp: new Date()
      };
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="md:hidden h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 truncate max-w-[200px] md:max-w-none uppercase">
                {activeSession?.title || 'BIZCONSULT AI'}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">ESTRATEGA ACTIVO</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 custom-scrollbar bg-slate-50/50">
          <div className="max-w-3xl mx-auto">
            {activeSession?.messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
            {isLoading && !activeSession?.messages[activeSession.messages.length - 1].content && (
              <div className="flex justify-start mb-6">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto relative">
            <form 
              onSubmit={handleSendMessage}
              className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-1 flex items-end focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Describe tu situación o haz una pregunta..."
                className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-4 text-slate-700 text-sm max-h-32 min-h-[50px] custom-scrollbar"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl mb-1 mr-1 transition-all ${
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p className="text-[10px] text-center mt-3 text-slate-400 font-medium uppercase tracking-wider">
              BIZCONSULT AI NO PROPORCIONA ASESORÍA LEGAL O FISCAL OFICIAL.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
