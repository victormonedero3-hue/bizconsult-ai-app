import React from 'react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession }) => {
  return (
    <aside className="w-72 bg-slate-900 text-slate-50 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">BizConsult AI</h1>
        </div>

        <button
          onClick={onNewChat}
          className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Consultoría
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Historial</p>
        </div>
        <div className="space-y-1">
          {sessions.length === 0 ? (
            <p className="px-2 text-sm text-slate-500 text-center mt-8">No hay conversaciones</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="group relative"
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 ${
                    activeSessionId === session.id
                      ? 'bg-slate-800 text-white shadow-md'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-sm truncate flex-1">{session.title}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-300 transition-all"
                  title="Eliminar conversación"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>


      <div className="px-4 pb-4">
        <video 
          className="w-full rounded-lg shadow-lg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source 
            src="https://oiyhilcacpupkcasykey.supabase.co/storage/v1/object/sign/WEB/imagen%20suscribete.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hNWIwY2YxYi0wNjllLTQwMmMtODVmMC1mMzViOWY1YTFjYzgiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJXRUIvaW1hZ2VuIHN1c2NyaWJldGUubXA0IiwiaWF0IjoxNzY4NTE2OTA4LCJleHAiOjE4MDAwNTI5MDh9.sHBAXnPwgsKqz6GoQF82KL5fh5fmDhMYPPus-X8yzDk" 
            type="video/mp4"
          />
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Sistema Operativo</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;