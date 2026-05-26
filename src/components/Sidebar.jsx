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
  ] : [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/home' },
    { name: 'Productos', icon: <ShoppingBag size={20} />, path: '/products' },
    { name: 'Ajustes', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0 shadow-sm">
      <div className="p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent tracking-tight">TechZone</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'}`}>
                  {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-blue-600" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group font-bold text-sm"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};


export default Sidebar;
