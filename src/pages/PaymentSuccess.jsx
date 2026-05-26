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
    // Usar order.id si está disponible, sino el order_id de la URL
    const finalId = order?.id || order_id;
    if (!finalId) return;
    
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/orders/${finalId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `comprobante_techzone_${finalId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Factura descargada con éxito');
    } catch (err) {
      console.error('Error al descargar PDF:', err);
      toast.error('Error al generar la descarga del PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Validando Transacción...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 flex items-center justify-center px-6">
        <SimpleNavbar />
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-[3rem] p-12 text-center shadow-2xl shadow-slate-200/50">
          {error.type === 'security' ? <ShieldAlert size={72} className="text-amber-500 mx-auto mb-8" /> : <AlertCircle size={72} className="text-red-500 mx-auto mb-8" />}
          <h1 className="text-3xl font-black mb-4 tracking-tight text-slate-900">{error.type === 'security' ? 'Acceso Restringido' : 'Error en Sincronización'}</h1>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">{error.mensaje}</p>
          <Link to="/products" className="btn-brand block w-full py-4 text-lg">
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20">
      <SimpleNavbar />
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
          {/* Efectos visuales */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-sm border border-emerald-100">
              <CheckCircle2 size={56} className="drop-shadow-sm" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900">¡Gracias por tu compra!</h1>
            <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
              La orden <span className="text-blue-600 font-black">#{order?.id || order_id}</span> ha sido procesada con éxito el {
                (order?.createdAt || order?.created_at || order?.date) 
                ? new Date(order?.createdAt || order?.created_at || order?.date).toLocaleDateString() 
                : new Date().toLocaleDateString()
              }.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-12 text-left shadow-inner">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen de inversión</span>
                    <span className="text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-wider shadow-sm shadow-emerald-500/20">Pagado</span>
                </div>
                
                {/* Lista de productos comprados */}
                <div className="space-y-4 mb-8">
                  {(order?.OrderItems || order?.items || order?.CartItems || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-slate-600 font-medium">
                        <span className="font-black text-slate-900">{item.quantity}x</span> {item.Product?.name || item.product?.name || 'Producto'}
                      </span>
                      <span className="text-slate-900 font-bold">${((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">Total Final</span>
                    <span className="text-4xl font-black text-slate-900">${(order?.total_amount || order?.total || 0).toLocaleString()}</span>
                </div>
            </div>

            <div className="space-y-5">
              <button 
                onClick={handleDownload} 
                disabled={isDownloading} 
                className="w-full btn-brand py-5 text-lg flex items-center justify-center gap-3"
              >
                {isDownloading ? <Loader2 className="animate-spin text-white" /> : <><Download size={22} /> Descargar Factura PDF</>}
              </button>

              <Link to="/products" className="block w-full text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all py-2">
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
