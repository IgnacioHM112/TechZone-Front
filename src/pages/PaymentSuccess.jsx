import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SimpleNavbar from '../components/SimpleNavbar';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, Download, ShieldAlert } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const order_id = searchParams.get('external_reference') || searchParams.get('order_id');
  const payment_id = searchParams.get('payment_id');

  useEffect(() => {
    const processFlow = async () => {
      if (!order_id || !payment_id) {
        setError({ mensaje: 'Identificadores de transacción no encontrados.', type: 'error' });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError({ mensaje: 'Sesión no detectada. Por favor, inicia sesión de nuevo.', type: 'auth' });
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // 1. CONFIRMAR Y OBTENER ORDEN (Ahora el backend devuelve todo en un paso)
        const response = await api.post('/orders/confirm', { order_id, payment_id }, config);
        
        // Extraer orden de la respuesta (maneja { order: {} } o el objeto directo)
        const orderData = response.data.order || response.data;
        setOrder(orderData);
        
        // 2. Limpiar estado local
        refreshCart(); 

      } catch (err) {
        console.error('Error en el proceso de confirmación:', err);
        const status = err.response?.status;
        const msg = err.response?.data?.mensaje || err.response?.data?.message;
        
        if (status === 403) {
          setError({ mensaje: 'No tienes permiso para acceder a esta orden.', type: 'security' });
        } else {
          setError({ mensaje: msg || 'Error interno al procesar la compra.', type: 'server' });
        }
      } finally {
        setLoading(false);
      }
    };

    processFlow();
  }, [searchParams]);

  const handleDownload = async () => {
    if (!order) return;
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/orders/${order.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante_techzone_${order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Factura descargada con éxito');
    } catch (err) {
      toast.error('Error al generar la descarga del PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Validando Transacción...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white pt-24 flex items-center justify-center px-6">
        <SimpleNavbar />
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-[2.5rem] p-10 text-center shadow-2xl">
          {error.type === 'security' ? <ShieldAlert size={64} className="text-amber-500 mx-auto mb-6" /> : <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />}
          <h1 className="text-2xl font-bold mb-4">{error.type === 'security' ? 'Acceso Restringido' : 'Error en Sincronización'}</h1>
          <p className="text-slate-400 mb-8">{error.mensaje}</p>
          <Link to="/products" className="block w-full bg-white text-slate-900 font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20">
      <SimpleNavbar />
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
          {/* Efectos visuales */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <CheckCircle2 size={80} className="text-green-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
            <h1 className="text-4xl font-black mb-4 tracking-tighter text-white">¡Gracias por confiar!</h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              La orden <span className="text-blue-400 font-bold">#{order?.id}</span> ha sido procesada el {new Date(order?.created_at).toLocaleDateString()}.
            </p>

            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 mb-10 text-left">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Resumen de inversión</span>
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-lg font-black uppercase">Pagado</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-slate-300">Total Final</span>
                    <span className="text-3xl font-black text-white">${order?.total_amount?.toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handleDownload} 
                disabled={isDownloading} 
                className="w-full bg-white text-slate-900 font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="animate-spin" /> : <><Download size={20} /> Descargar Factura PDF</>}
              </button>

              <Link to="/products" className="block w-full text-slate-500 hover:text-white font-bold py-4 underline underline-offset-8 decoration-slate-700 transition-colors">
                Seguir equipando mi PC
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
