
import React, { useEffect } from "react";
import { useToast, setToastFunction } from "./use-toast";

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, open, close, update } = useToast();

  useEffect(() => {
    // Set the global toast function
    const toastFunctions = { open, close, update };
    setToastFunction(toastFunctions);
    
    return () => {
      // Cleanup
      setToastFunction(null);
    };
  }, [open, close, update]);

  return <>{children}</>;
}
