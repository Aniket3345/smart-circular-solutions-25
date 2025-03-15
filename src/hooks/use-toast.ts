
import { useState, useCallback } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionType = {
  open: (props: Omit<ToastProps, "id">) => string;
  close: (id: string) => void;
  update: (id: string, props: Partial<Omit<ToastProps, "id">>) => void;
};

let count = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const open = useCallback((props: Omit<ToastProps, "id">) => {
    const id = String(count++);
    setToasts((toasts) => [...toasts, { id, ...props }]);
    return id;
  }, []);

  const close = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const update = useCallback((id: string, props: Partial<Omit<ToastProps, "id">>) => {
    setToasts((toasts) =>
      toasts.map((toast) =>
        toast.id === id ? { ...toast, ...props } : toast
      )
    );
  }, []);

  return {
    toasts,
    open,
    close,
    update,
  };
};

// This is a singleton to allow imperative toast creation
let TOAST_FUNCTION: ToastActionType | null = null;

// Make the toast object use functions that call the methods on the current TOAST_FUNCTION
export const toast = {
  open: (props: Omit<ToastProps, "id">): string => {
    if (!TOAST_FUNCTION) return "";
    return TOAST_FUNCTION.open(props);
  },
  close: (id: string): void => {
    if (!TOAST_FUNCTION) return;
    TOAST_FUNCTION.close(id);
  },
  update: (id: string, props: Partial<Omit<ToastProps, "id">>): void => {
    if (!TOAST_FUNCTION) return;
    TOAST_FUNCTION.update(id, props);
  }
};

// Export function to set the global toast function - will be called by ToastProvider
export const setToastFunction = (functions: ToastActionType | null): void => {
  TOAST_FUNCTION = functions;
};
