import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [devInfo, setDevInfo] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDevInfo(null);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      if (response.data?.dev_info) {
        setDevInfo(response.data.dev_info);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error al procesar tu solicitud. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
      <SimpleNavbar />
      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-xl shadow-slate-950/50 p-10 border border-slate-800 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <KeyRound className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Recuperar Contraseña</h1>
          <p className="text-slate-400 mt-2 text-center text-sm font-medium">
            Ingresa tu correo para recibir las instrucciones de restablecimiento.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 px-5 py-4 rounded-2xl text-sm font-medium flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
              <p>Si el correo ingresado está registrado, recibirás un enlace de recuperación.</p>
            </div>

            {devInfo && devInfo.token && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">Modo Desarrollo Detectado</p>
                <button
                  onClick={() => navigate(`/reset-password?token=${devInfo.token}`)}
                  className="w-full py-3 px-4 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>[DEV] Simular clic en el correo</span>
                </button>
              </div>
            )}

            <div className="pt-4 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium hover:underline">
                <ArrowLeft size={16} />
                <span>Volver a Iniciar Sesión</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Correo Electrónico</label>
              <div className="input-with-icon">
                <Mail className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  className="input-brand"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brand py-4 flex items-center justify-center gap-3 text-lg uppercase tracking-widest disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  <span>Enviar Enlace</span>
                </>
              )}
            </button>

            <div className="pt-6 border-t border-slate-800 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium hover:underline">
                <ArrowLeft size={16} />
                <span>Volver al Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
