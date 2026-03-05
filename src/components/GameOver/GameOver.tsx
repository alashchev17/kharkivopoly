import { useGame } from '../../context/GameContext';
import { Button } from '../shared/Button';
import { MoneyDisplay } from '../shared/MoneyDisplay';
import './GameOver.css';

export function GameOver() {
  const { state, dispatch } = useGame();
  const winner = state.winner;

  return (
    <div className="game-over">
      <h1 className="game-over-title">Game Over!</h1>
      {winner && (
        <div className="winner-card">
          <div className="winner-dot" style={{ backgroundColor: winner.tokenColor }} />
          <h2 className="winner-name">{winner.name} wins!</h2>
          <p className="winner-money">
            Final balance: <MoneyDisplay amount={winner.money} />
          </p>
          <p className="winner-props">
            Properties owned: {winner.ownedProperties.length}
          </p>
        </div>
      )}
      <Button onClick={() => dispatch({ type: 'PLAY_AGAIN' })} variant="primary">
        Play Again
      </Button>
    </div>
  );
}
