import { useEffect, useRef, useCallback } from "react";

interface PointerHandlers {
  onStart?: (e: PointerEvent) => void;
  onMove?: (e: PointerEvent) => void;
  onEnd?: (e: PointerEvent) => void;
}

const usePointerMove = ({ onStart, onMove, onEnd }: PointerHandlers) => {
  const pointerIdRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const clearTimeoutSafely = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleEnd = useCallback((e: PointerEvent) => {
    if (pointerIdRef.current === e.pointerId) {
      pointerIdRef.current = null;
      clearTimeoutSafely();
      if (onEnd) {
        onEnd(e);
      }
      if (elementRef.current) {
        elementRef.current.releasePointerCapture(e.pointerId);
      }
    }
  }, [onEnd]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    elementRef.current = e.currentTarget as HTMLElement;
    elementRef.current.setPointerCapture(e.pointerId);
    
    if (onStart) {
      onStart(e.nativeEvent);
    }

    timeoutRef.current = window.setTimeout(() => {
      console.warn("Fallback cleanup triggered");
      if (pointerIdRef.current !== null) {
        handleEnd(new PointerEvent('pointerup', { pointerId: pointerIdRef.current }));
      }
    }, 10000);
  }, [onStart, handleEnd]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerIdRef.current === e.pointerId && onMove) {
        onMove(e);
      }
    };

    const handlePointerUp = handleEnd;
    const handlePointerCancel = handleEnd;

    const handleBlur = () => {
      if (pointerIdRef.current !== null) {
        handleEnd(new PointerEvent('pointerup', { pointerId: pointerIdRef.current }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && pointerIdRef.current !== null) {
        handleEnd(new PointerEvent('pointerup', { pointerId: pointerIdRef.current }));
      }
    };

    // Use window to catch events that might occur outside the document
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeoutSafely();
    };
  }, [onMove, handleEnd]);

  return handlePointerDown;
};

export default usePointerMove;