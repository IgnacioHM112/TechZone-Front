import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, LayoutDashboard, Bell } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard de Usuario">
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[2.5rem] p-12 mb-12 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-3 text-white tracking-tight">¡Hola, {user?.name || 'Usuario'}! 👋</h2>
          <p className="text-blue-50 text-xl opacity-90 font-medium">Bienvenido de nuevo a TechZone. Aquí tienes un resumen de tu actividad.</p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Tus Pedidos</h3>
          <p className="text-3xl font-black text-slate-900">0 realizados</p>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-emerald-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
            <LayoutDashboard size={28} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Carrito</h3>
          <p className="text-3xl font-black text-slate-900">0 items</p>
        </div>
        <div className="bg-white border border-slate-200 p-8 rounded-3xl hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Bell size={28} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Notificaciones</h3>
          <p className="text-3xl font-black text-slate-900">0 nuevas</p>
        </div>
      </div>
    </Layout>
  );
};


export default Home;
