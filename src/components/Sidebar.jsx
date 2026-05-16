import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  Package, 
  Tags,
  Bot,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = isAdmin ? [
    { name: 'Productos', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Categorías', icon: <Tags size={20} />, path: '/admin/categories' },
    { name: 'Soporte IA', icon: <Bot size={20} />, path: '/admin/ai-support' },
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/home' },
    { name: 'Productos', icon: <ShoppingBag size={20} />, path: '/products' },
    { name: 'Ajustes', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-500 tracking-tight">TechZone</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-500' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className="animate-in slide-in-from-left-1" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
