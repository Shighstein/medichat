import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

export const CHAT_LIST_MIN_WIDTH = 150;
export const CHAT_LIST_MAX_WIDTH = 600;

type ResizeStart = { startX: number; startWidth: number };

export function useResizableWidth(initialWidth = 200) {
  const [width, setWidth] = useState(initialWidth);
  const resizeStartRef = useRef<ResizeStart | null>(null);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    const { startX, startWidth } = resizeStartRef.current;
    const nextWidth = startWidth + (e.clientX - startX);
    setWidth(
      Math.min(CHAT_LIST_MAX_WIDTH, Math.max(CHAT_LIST_MIN_WIDTH, nextWidth)),
    );
  }, []);

  const handleResizeMouseUp = useCallback(() => {
    resizeStartRef.current = null;
    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  }, [handleResizeMouseMove]);

  const handleResizeMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      resizeStartRef.current = { startX: e.clientX, startWidth: width };
      document.addEventListener("mousemove", handleResizeMouseMove);
      document.addEventListener("mouseup", handleResizeMouseUp);
    },
    [width, handleResizeMouseMove, handleResizeMouseUp],
  );

  // drop the listeners if we unmount mid-drag
  useEffect(() => handleResizeMouseUp, [handleResizeMouseUp]);

  return { width, handleResizeMouseDown };
}
