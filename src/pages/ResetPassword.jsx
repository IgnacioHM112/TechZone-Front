import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones del lado del cliente
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token,
        password,
        confirmPassword
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace de recuperación es inválido o ha expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
      <SimpleNavbar />
      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-xl shadow-slate-950/50 p-10 border border-slate-800 transition-all duration-300">
        
        {/* CASO 1: NO HAY TOKEN EN LA URL */}
        {!token ? (
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-500 shadow-lg shadow-red-500/10">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Acceso Inválido</h1>
            <p className="text-slate-400 mt-2 mb-8 text-sm font-medium">
              No se ha proporcionado un token válido para restablecer la contraseña.
            </p>
            <Link
              to="/login"
              className="w-full btn-brand py-4 flex items-center justify-center gap-3 text-lg uppercase tracking-widest cursor-pointer"
            >
              <span>Ir al Login</span>
            </Link>
          </div>
        ) : success ? (
          /* CASO 2: ÉXITO EN EL RESTABLECIMIENTO */
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-8 h-8 animate-bounce" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">¡Contraseña Restablecida!</h1>
            <p className="text-emerald-400 mt-2 mb-8 text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 py-3 px-4 rounded-xl w-full">
              Tu contraseña ha sido restablecida correctamente.
            </p>
            <Link
              to="/login"
              className="w-full btn-brand py-4 flex items-center justify-center gap-3 text-lg uppercase tracking-widest cursor-pointer"
            >
              <span>Iniciar Sesión</span>
            </Link>
          </div>
        ) : (
          /* CASO 3: FORMULARIO DE RESTABLECIMIENTO */
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                <Lock className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Nueva Contraseña</h1>
              <p className="text-slate-400 mt-2 text-center text-sm font-medium">
                Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-100 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </div>
                {/* Si es error de token/API inválido, ofrecer botón para volver a solicitar */}
                {(error.includes('enlace') || error.includes('expirado') || error.includes('inválido') || error.includes('token')) && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold underline mt-1 block"
                  >
                    Volver a solicitar recuperación
                  </Link>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Nueva Contraseña</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className="input-brand pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Confirmar Nueva Contraseña</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Repite tu contraseña"
                    className="input-brand pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
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
                    <span>Restablecer</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
