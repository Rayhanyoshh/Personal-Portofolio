import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastContextType {
  showToast: (type: Toast['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'info': return <Info size={20} />;
    }
  };

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/90 text-white border-green-400';
      case 'error': return 'bg-red-500/90 text-white border-red-400';
      case 'warning': return 'bg-yellow-500/90 text-black border-yellow-400';
      case 'info': return 'bg-cyan-500/90 text-white border-cyan-400';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[10001] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 backdrop-blur-sm shadow-lg font-tech text-sm animate-[slideInRight_0.3s_ease-out] pointer-events-auto ${getColors(toast.type)}`}
          >
            {getIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
