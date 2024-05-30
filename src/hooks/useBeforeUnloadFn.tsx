'use client'
import { useEffect } from "react";

export function useBeforeUnloadFunction(fn: () => void) {
  useEffect(() => {
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, [fn]);
}
