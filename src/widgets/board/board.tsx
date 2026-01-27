import { TileButton } from '^/widgets/tile-button/tile-button';
import styles from './board.module.css';

export function Board() {
  const tiles = [];

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      tiles.push(<TileButton key={`${row}-${col}`} row={row} col={col} />);
    }
  }

  return <div className={styles.board}>{tiles}</div>;
}
