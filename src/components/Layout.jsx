import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Layout = ({ children, title = 'Panel de Control' }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-700 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-slate-400 capitalize">
                  {typeof user?.role === 'object' ? user.role.name : (user?.role || 'Usuario')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
