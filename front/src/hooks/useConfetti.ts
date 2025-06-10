import { useCallback } from "react";
import confetti from "canvas-confetti";

/**
 * Возвращает функцию shootAt(domEl)
 * Если передать null — салют из центра экрана.
 */
export const useConfetti = () => {
  const shootAt = useCallback((el?: HTMLElement | null) => {
    let originX = 0.5,
      originY = 0.5;

    if (el) {
      const { left, top, width, height } = el.getBoundingClientRect();
      originX = (left + width / 2) / window.innerWidth;
      originY = (top + height / 2) / window.innerHeight;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: originX, y: originY },
      scalar: 0.9,
    });
  }, []);

  return { shootAt };
};
