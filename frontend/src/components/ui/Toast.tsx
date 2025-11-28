import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx } from "clsx";

export interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastProps[];
  removeToast: (id: string) => void;
}

const ToastItem: React.FC<ToastProps & { onRemove: () => void }> = ({
  message,
  type = "info",
  duration = 3000,
  onRemove,
}) => {
  useEffect(() => {
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [duration, onRemove]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const styles = {
    success:
      "bg-success-50 dark:bg-success-900/30 text-success-800 dark:text-success-200 border-success-200 dark:border-success-800",
    error:
      "bg-danger-50 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200 border-danger-200 dark:border-danger-800",
    info: "bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-800",
  };

  return (
    <div
      className={clsx(
        "flex items-center gap-3 p-4 rounded-lg border shadow-soft-lg animate-slide-in min-w-[300px]",
        styles[type]
      )}
    >
      {icons[type]}
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onRemove}
        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    ),
  };
};
