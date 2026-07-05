import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getUsers, deleteUser } from '../../services/userService';
import { Trash2, User, Mail, Shield, Search, Loader2, ShoppingBag, X, Calendar, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
  const [ordersModal, setOrdersModal] = useState({ show: false, orders: [], userName: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    setDeleteModal({
      show: true,
      userId: user.id,
      userName: user.name
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteModal.userId);
      toast.success(`Usuario ${deleteModal.userName} eliminado con éxito`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    } finally {
      setDeleteModal({ show: false, userId: null, userName: '' });
    }
  };

  const handleShowOrders = (user) => {
    setOrdersModal({
      show: true,
      orders: user.orders || [],
      userName: user.name
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <Layout title="Gestión de Usuarios">
      {/* Header con estadísticas rápidas */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 mb-8 shadow-xl shadow-blue-500/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8" />
              Control de Usuarios
            </h2>
            <p className="text-blue-100 opacity-90 text-sm md:text-base font-medium">Administra el acceso y los perfiles de la plataforma TechZone.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 border border-white/20 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
              <User className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-[10px] md:text-xs font-bold uppercase tracking-wider">Total Usuarios</p>
              <p className="text-xl md:text-2xl font-black text-white">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>

      {/* Barra de búsqueda */}
      <div className="card-white p-3 md:p-4 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
        <div className="bg-slate-950/50 flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-slate-700 focus-within:border-blue-500/50 transition-all">
          <Search className="text-slate-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            className="bg-transparent border-none outline-none w-full text-slate-100 font-medium placeholder:text-slate-500 text-xs md:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="card-white overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-[0.1em]">
                <th className="px-3 md:px-8 py-3 md:py-5">ID</th>
                <th className="px-3 md:px-8 py-3 md:py-5">Usuario</th>
                <th className="hidden md:table-cell px-3 md:px-8 py-3 md:py-5">Email</th>
                <th className="px-3 md:px-8 py-3 md:py-5">Compras</th>
                <th className="px-3 md:px-8 py-3 md:py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-3 md:px-8 py-12 md:py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
                      <p className="text-slate-400 font-bold text-xs md:text-sm">Cargando usuarios...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 md:px-8 py-12 md:py-20 text-center">
                    <p className="text-slate-400 font-bold text-xs md:text-sm">No se encontraron usuarios</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <span className="font-mono text-[10px] md:text-xs bg-slate-800 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-slate-400 font-bold border border-slate-700">
                        #{user.id}
                      </span>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 text-xs md:text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-100 tracking-tight text-xs md:text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-8 py-3 md:py-5 text-slate-400 font-medium text-xs md:text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                        <span className="truncate max-w-[120px] lg:max-w-none">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      {user.orders && user.orders.length > 0 ? (
                        <button
                          onClick={() => handleShowOrders(user)}
                          className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                        >
                          <ShoppingBag size={12} />
                          {user.orders.length}
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic opacity-50">Sin compras</span>
                      )}
                    </td>
                    <td className="px-3 md:px-8 py-3 md:py-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-1.5 md:p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-all duration-300 group/btn border border-transparent hover:border-red-500/20"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Órdenes */}
      {ordersModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-5 md:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-100 tracking-tight">Compras de {ordersModal.userName}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Historial de pedidos</p>
                </div>
              </div>
              <button 
                onClick={() => setOrdersModal({ show: false, orders: [], userName: '' })}
                className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4">
              {ordersModal.orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 font-bold">No hay compras registradas para este usuario.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ordersModal.orders.map((order) => (
                    <div key={order.id} className="bg-slate-800/40 border border-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl group hover:border-slate-700 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ID Orden</span>
                            <span className="font-mono text-sm text-slate-300 font-bold">#{order.id}</span>
                          </div>
                          <div className="hidden sm:block h-8 w-px bg-slate-800"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fecha</span>
                            <div className="flex items-center gap-2 text-slate-300 text-sm font-bold">
                              <Calendar size={14} className="text-slate-500" />
                              {formatDate(order.date)}
                            </div>
                          </div>
                          <div className="hidden sm:block h-8 w-px bg-slate-800"></div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total</span>
                            <span className="text-emerald-400 text-sm font-bold">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-5 md:p-8 bg-slate-950/50 border-t border-slate-800 text-center">
              <button 
                onClick={() => setOrdersModal({ show: false, orders: [], userName: '' })}
                className="w-full sm:w-auto px-8 py-3 bg-slate-850 border border-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-800 hover:text-white transition-all text-sm uppercase tracking-widest cursor-pointer"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, userId: null, userName: '' })}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${deleteModal.userName}"? Esta acción no se puede deshacer.`}
      />
    </Layout>
  );
};

export default AdminUsers;
