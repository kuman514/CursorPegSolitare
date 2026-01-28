import { useEffect, useState } from 'react';
import { useGameStore } from '^/entities/game-store/game-store';
import { hasAnyMovableBall, getGameResult } from '^/features/game-logic';
import styles from './game-over-overlay.module.css';

export function GameOverOverlay() {
  const board = useGameStore((state) => state.board);
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const hasMovableBall = hasAnyMovableBall(board);
  const gameResult = getGameResult(board);
  const shouldShow = !hasMovableBall && gameResult !== null;

  useEffect(() => {
    if (shouldShow) {
      setIsVisible(true);
      setIsFading(false);

      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 2000);

      return () => {
        clearTimeout(fadeTimer);
      };
    } else {
      setIsVisible(false);
      setIsFading(false);
    }
  }, [shouldShow]);

  if (!isVisible) {
    return null;
  }

  const text = (() => {
    switch (gameResult) {
      case 'MAVERICK_END':
        return 'MAVERICK END!!!';
      case 'KOISHI_END':
        return 'KOISHI END!';
      case 'YASUO_END':
        return 'YASUO END...';
      default:
        return '';
    }
  })();

  const className = `${styles.overlay} ${isFading ? styles.fadeOut : ''}`;

  return <section className={className}>{text}</section>;
}
