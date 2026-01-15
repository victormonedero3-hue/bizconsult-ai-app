
import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession }) => {
  return (
    <aside className="w-72 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-full border-r border-slate-800 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">BizConsult AI</h1>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl text-white font-medium flex items-center justify-center gap-2 border border-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Consultoría
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Historial reciente</p>
        </div>
        <div className="space-y-1">
          {sessions.length === 0 ? (
            <p className="px-2 text-sm text-slate-600 italic">No hay sesiones previas</p>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all flex items-center gap-3 group ${
                  activeSessionId === session.id 
                    ? 'bg-slate-800 text-white border border-slate-700' 
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="truncate flex-1">{session.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 p-2 bg-slate-800/30 rounded-lg">
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Usuario Pro</p>
            <p className="text-xs text-slate-500 truncate">Plan Enterprise</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
