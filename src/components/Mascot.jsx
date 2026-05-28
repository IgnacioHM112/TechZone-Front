import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

const Mascot = () => {
  const [position, setPosition] = useState({ x: -100, y: 50, side: 'left' });
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');

  const messages = [
    '¡Hola! ¿Buscando hardware potente? 🚀',
    '¡Mirá esos procesadores! ✨',
    '¿Necesitás ayuda con tu compra? 🛒',
    '¡TechZone tiene lo mejor para vos! 💎',
    '¡No te pierdas las ofertas de hoy! 🔥'
  ];

  useEffect(() => {
    const showMascot = () => {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMessage);
      setIsVisible(true);
      
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const xPos = side === 'left' ? 20 : window.innerWidth - 300;
      setPosition({ x: xPos, y: Math.random() * 60 + 20, side });

      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) { // Más frecuente
        showMascot();
      }
    }, 10000); // Intervalo más corto

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-[100] transition-all duration-1000 ease-in-out flex items-center gap-4"
      style={{ 
        left: position.side === 'left' ? `${position.x}px` : 'auto', 
        right: position.side === 'right' ? `20px` : 'auto',
        top: `${position.y}%` 
      }}
    >
      {position.side === 'right' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl relative animate-in slide-in-from-right-10">
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-b border-l border-slate-200 -rotate-45"></div>
          <p className="text-sm font-bold text-slate-700 whitespace-nowrap">{message}</p>
        </div>
      )}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
        <Bot className="text-white w-10 h-10" />
      </div>
      {position.side === 'left' && (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl relative animate-in slide-in-from-left-10">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 -rotate-45"></div>
          <p className="text-sm font-bold text-slate-700 whitespace-nowrap">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Mascot;
