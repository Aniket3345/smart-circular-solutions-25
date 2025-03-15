
import React, { useEffect } from "react";
import { useToast } from "./use-toast";

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, open, close, update } = useToast();

  useEffect(() => {
    // Set the global toast function
    if (typeof window !== "undefined") {
      // @ts-ignore - we're purposely setting a global reference
      window.TOAST_FUNCTION = { open, close, update };
    }
    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore - cleanup
        window.TOAST_FUNCTION = undefined;
      }
    };
  }, [open, close, update]);

  return <>{children}</>;
}
