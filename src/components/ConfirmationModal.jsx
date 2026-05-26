import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro?', 
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger' // 'danger' o 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header con icono decorativo */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
          }`}>
            <AlertTriangle size={28} />
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8">
          <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
          <p className="text-slate-500 font-medium leading-relaxed">{message}</p>
        </div>

        {/* Acciones */}
        <div className="p-8 bg-slate-50/50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl text-slate-600 hover:bg-white hover:border-slate-300 transition-all font-bold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all transform active:scale-95 ${
              variant === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};


export default ConfirmationModal;
