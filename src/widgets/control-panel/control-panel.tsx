import { useGameStore } from '^/entities/game-store/game-store';
import { UiButton } from '^/shared/ui/ui-button/ui-button';

import styles from './control-panel.module.css';

export function ControlPanel() {
  const history = useGameStore((state) => state.history);
  const undoCount = useGameStore((state) => state.undoCount);
  const undo = useGameStore((state) => state.undo);
  const redo = useGameStore((state) => state.redo);
  const reset = useGameStore((state) => state.reset);

  const canUndo = history.length > 0 && history.length - undoCount - 1 >= 0;
  const canRedo = undoCount > 0;

  return (
    <div className={styles.controlPanel}>
      <UiButton onClick={undo} disabled={!canUndo}>
        실행 취소
      </UiButton>
      <UiButton onClick={redo} disabled={!canRedo}>
        다시 실행
      </UiButton>
      <UiButton onClick={reset}>리셋</UiButton>
    </div>
  );
}
