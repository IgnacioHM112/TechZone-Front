import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Layout = ({ children, title = 'Panel de Control' }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name || 'Usuario'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {typeof user?.role === 'object' ? user.role.name : (user?.role || 'Usuario')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-sm font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 section-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};


export default Layout;
