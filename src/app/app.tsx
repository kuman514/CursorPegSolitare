import { Title } from '^/shared/ui/title/title';
import { Board } from '^/widgets/board/board';
import { ControlPanel } from '^/widgets/control-panel/control-panel';
import { GameOverOverlay } from '^/widgets/game-over-overlay/game-over-overlay';

import './styles/global.css';

export function App() {
  return (
    <>
      <main>
        <Title />
        <Board />
        <ControlPanel />
      </main>
      <GameOverOverlay />
    </>
  );
}
