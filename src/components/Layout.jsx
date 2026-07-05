import { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu } from 'lucide-react';

const Layout = ({ children, title = 'Panel de Control' }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 flex flex-col relative w-full">
        {/* Header */}
        <header className="h-16 md:h-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 md:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 md:p-2 text-slate-400 hover:text-white md:hidden hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-xs md:text-lg font-bold text-slate-100 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-bold text-slate-100">{user?.name || 'Usuario'}</p>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user?.role && typeof user.role === 'object' ? user.role.name : (user?.role || 'Usuario')}
                </p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-[10px] md:text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-3 md:p-8 section-fade-in flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};


export default Layout;
