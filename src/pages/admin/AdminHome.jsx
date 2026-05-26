import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Tags, Users } from 'lucide-react';

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard Administrativo">
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-[2.5rem] p-12 mb-12 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-black mb-3 tracking-tight">¡Bienvenido, {user?.name || 'Admin'}! 👋</h2>
          <p className="text-blue-50 text-xl opacity-90 max-w-2xl leading-relaxed font-medium">Estás en el panel de control central. Gestiona el inventario, categorías y monitorea el estado de TechZone.</p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card-white p-10 group hover:border-blue-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <ShoppingBag size={32} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Total Inventario</h3>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">Activo</p>
        </div>
        
        <div className="card-white p-10 group hover:border-emerald-300">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
            <Tags size={32} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Categorías</h3>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">Organizadas</p>
        </div>

        <div className="card-white p-10 group hover:border-blue-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <Users size={32} />
          </div>
          <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Estado Sistema</h3>
          <p className="text-4xl font-black text-slate-900 tracking-tighter">Óptimo</p>
        </div>
      </div>
    </Layout>
  );
};


export default AdminHome;
