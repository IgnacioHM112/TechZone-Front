import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { UserPlus, Mail, Lock, User, ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import SimpleNavbar from '../components/SimpleNavbar';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación en el Cliente
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      // Redirigir al login tras registro exitoso
      navigate('/login');
    } catch (err) {
      // Manejo de errores del Backend (incluyendo el 400 de contraseñas)
      const serverMessage = err.response?.data?.mensaje || err.response?.data?.message;
      setError(serverMessage || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 pt-24">
      <SimpleNavbar />
      <div className="max-w-md w-full bg-slate-900 rounded-3xl shadow-xl shadow-slate-950/50 p-10 border border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <UserPlus className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">TechZone</h1>
          <p className="text-slate-400 mt-2 font-medium">Crea tu cuenta</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Nombre Completo</label>
            <div className="input-with-icon">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                required
                placeholder="Ingresa tu nombre"
                className="input-brand"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                required
                placeholder="Ingresa tu email"
                className="input-brand"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Ingresa tu contraseña"
                className="input-brand pr-12"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-100 mb-2 ml-1">Confirmar Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Confirma tu contraseña"
                className="input-brand pr-12"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-brand py-4 flex items-center justify-center gap-3 text-lg mt-4 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
              <>
                <span>REGISTRARSE</span>
                <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm font-medium">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 decoration-2 uppercase tracking-wider">
              INGRESAR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

};

export default Register;
