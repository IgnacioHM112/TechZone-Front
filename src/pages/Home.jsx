import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LayoutDashboard, Bell } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard de Usuario">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">¡Hola, {user?.name || 'Usuario'}! 👋</h2>
          <p className="text-blue-100 text-lg opacity-90">Bienvenido de nuevo a TechZone. Aquí tienes un resumen de tu actividad.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag size={24} />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Tus Pedidos</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-green-500/30 transition-all">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
            <LayoutDashboard size={24} />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Carrito</h3>
          <p className="text-2xl font-bold">0 items</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl hover:border-purple-500/30 transition-all">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
            <Bell size={24} />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Notificaciones</h3>
          <p className="text-2xl font-bold">0 nuevas</p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
