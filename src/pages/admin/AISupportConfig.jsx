import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Mail, History, Bot, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const AISupportConfig = () => {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Datos mock para el historial de correos
  const [emailHistory, setEmailHistory] = useState([
    { id: 1, recipient: 'juan.perez@email.com', subject: 'Consulta sobre RTX 4080', status: 'Sent', date: '2024-03-14 10:30' },
    { id: 2, recipient: 'maria.garcia@email.com', subject: 'Problema con mi pedido #1234', status: 'Sent', date: '2024-03-14 09:15' },
    { id: 3, recipient: 'lucas.rodriguez@email.com', subject: 'Stock de procesadores AMD', status: 'Failed', date: '2024-03-13 18:45' },
    { id: 4, recipient: 'sofia.martinez@email.com', subject: 'Garantía de Monitor Gamer', status: 'Sent', date: '2024-03-13 14:20' },
    { id: 5, recipient: 'diego.sanchez@email.com', subject: 'Presupuesto PC de oficina', status: 'Sent', date: '2024-03-13 11:05' },
  ]);

  const handleToggleAutoReply = async () => {
    setIsLoading(true);
    // Simulación de llamada a la API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoReplyEnabled(!autoReplyEnabled);
      toast.success(`Respuesta automática ${!autoReplyEnabled ? 'activada' : 'desactivada'}`);
    } catch (error) {
      toast.error('Error al actualizar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshHistory = async () => {
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Historial sincronizado');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Layout title="Configuración de Soporte IA">
      <div className="space-y-8">
        {/* Banner de Bienvenida/Resumen */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/5">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Asistente de Soporte IA</h2>
                <p className="text-slate-400 max-w-md">Gestiona las respuestas automáticas inteligentes y supervisa la comunicación por correo electrónico con tus clientes.</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${autoReplyEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                Estado: {autoReplyEnabled ? 'Operativo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Configuración */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 h-full shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="text-blue-500" size={24} />
                <h3 className="text-xl font-bold text-white">Configuración de Correo</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-200">Respuesta Automática</span>
                    <span className="text-xs text-slate-500">Enviar correos vía IA</span>
                  </div>
                  
                  <button
                    onClick={handleToggleAutoReply}
                    disabled={isLoading}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${autoReplyEnabled ? 'bg-blue-600' : 'bg-slate-700'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`${
                        autoReplyEnabled ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-md`}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={12} className="text-blue-200 animate-spin" />
                      </div>
                    )}
                  </button>
                </div>
                
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-xs text-blue-400 leading-relaxed">
                    <strong>Nota:</strong> Cuando esta opción está activa, la IA responderá automáticamente a las consultas frecuentes de los clientes utilizando el tono oficial de TechZone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Historial */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-lg h-full flex flex-col">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <History className="text-blue-500" size={24} />
                  <h3 className="text-xl font-bold text-white">Historial Reciente</h3>
                </div>
                <button 
                  onClick={handleRefreshHistory}
                  disabled={isSyncing}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
                >
                  <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
                </button>
              </div>
              
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/30 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Destinatario</th>
                      <th className="px-6 py-4">Asunto</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {emailHistory.map((email) => (
                      <tr key={email.id} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-200">{email.recipient}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-400 truncate max-w-[200px] block">{email.subject}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {email.status === 'Sent' ? (
                              <>
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span className="text-xs text-green-500">Enviado</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle size={14} className="text-red-500" />
                                <span className="text-xs text-red-500">Error</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs text-slate-500 font-mono">{email.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AISupportConfig;
