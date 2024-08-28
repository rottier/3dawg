import { useEffect, useRef } from "react";

interface PointerHandlers {
  onStart?: (e: PointerEvent) => void;
  onMove?: (e: PointerEvent) => void;
  onEnd?: (e: PointerEvent) => void;
}

const usePointerMove = ({ onStart, onMove, onEnd }: PointerHandlers) => {
  const pointerIdRef = useRef<number | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerIdRef.current === e.pointerId && onMove) {
        onMove(e);
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (pointerIdRef.current === e.pointerId) {
        pointerIdRef.current = null;
        if (onEnd) {
          onEnd(e);
        }
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onMove, onEnd]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    if (onStart) {
      onStart(e.nativeEvent);
    }
  };

  return handlePointerDown;
};

export default usePointerMove;