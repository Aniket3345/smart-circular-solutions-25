
import { useState, useCallback, useEffect } from "react";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastActionType = {
  open: (props: Omit<ToastProps, "id">) => void;
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
let TOAST_FUNCTION: ToastActionType;

export const toast: ToastActionType = {
  open: (props) => TOAST_FUNCTION?.open(props),
  close: (id) => TOAST_FUNCTION?.close(id),
  update: (id, props) => TOAST_FUNCTION?.update(id, props),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, open, close, update } = useToast();

  useEffect(() => {
    TOAST_FUNCTION = { open, close, update };
    return () => {
      TOAST_FUNCTION = undefined as any;
    };
  }, [open, close, update]);

  return <>{children}</>;
}
