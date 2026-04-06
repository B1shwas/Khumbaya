import { router } from "expo-router";
import { useCallback, useRef } from "react";

export function useThrottledRouter(delay = 800) {
  const canNavigate = useRef(true);

  const push = useCallback(
    (href: string) => {
      if (!canNavigate.current) return;
      canNavigate.current = false;
      router.push(href as any);
      setTimeout(() => {
        canNavigate.current = true;
      }, delay);
    },
    [delay]
  );

  const replace = useCallback(
    (href: string) => {
      if (!canNavigate.current) return;
      canNavigate.current = false;
      router.replace(href as any);
      setTimeout(() => {
        canNavigate.current = true;
      }, delay);
    },
    [delay]
  );

  return { push, replace };
}
