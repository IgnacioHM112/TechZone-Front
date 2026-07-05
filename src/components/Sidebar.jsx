import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  Package, 
  Tags,
  Users,
  Bot,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const menuItems = isAdmin ? [
    { name: 'Productos', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Categorías', icon: <Tags size={20} />, path: '/admin/categories' },
    { name: 'Usuarios', icon: <Users size={20} />, path: '/admin/users' },
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/home' },
    { name: 'Volver al Catálogo', icon: <ShoppingBag size={20} />, path: '/products' },
  ];

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[115] md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar contenedor */}
      <aside className={`
        w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen fixed md:sticky top-0 left-0 z-[120] md:z-10 shadow-2xl md:shadow-sm transition-transform duration-300 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 md:p-8 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">TechZone</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 md:p-2 text-slate-400 hover:text-white md:hidden hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 md:px-4 space-y-1 md:space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-600/10 text-slate-100 shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-900 hover:text-blue-300'
                }`}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className={`transition-colors ${isActive ? 'text-blue-300' : 'text-slate-400 group-hover:text-blue-600'}`}>
                    {item.icon}
                  </div>
                  <span className="font-bold text-xs md:text-sm tracking-tight">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-blue-300" />}
              </Link>
            );
          })}
        </nav>

        {isAdmin && (
          <div className="p-4 md:p-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 w-full text-slate-400 hover:text-red-500 hover:bg-red-950/50 border border-transparent hover:border-red-500/15 rounded-lg md:rounded-xl transition-all group font-bold text-xs md:text-sm cursor-pointer"
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};


export default Sidebar;
