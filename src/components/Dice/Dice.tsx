import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Button } from '../shared/Button';
import './Dice.css';

function DieFace({ value }: { value: number }) {
  const pipPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  const pips = pipPositions[value] || [];

  return (
    <svg viewBox="0 0 100 100" className="die-face">
      <rect x="2" y="2" width="96" height="96" rx="12" fill="#fff" stroke="#333" strokeWidth="2" />
      {pips.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#1a1a2e" />
      ))}
    </svg>
  );
}

export function Dice() {
  const { state, dispatch } = useGame();
  const [rolling, setRolling] = useState(false);
  const canRoll = state.phase === 'rollDice' && !rolling;

  const handleRoll = () => {
    setRolling(true);
    setTimeout(() => {
      dispatch({ type: 'ROLL_DICE' });
      setRolling(false);
    }, 400);
  };

  return (
    <div className="dice-container">
      <div className={`dice-pair ${rolling ? 'dice-rolling' : ''}`}>
        <DieFace value={state.dice.die1 || 1} />
        <DieFace value={state.dice.die2 || 1} />
      </div>
      {state.dice.rolled && (
        <div className="dice-total">Total: {state.dice.total}</div>
      )}
      {canRoll && (
        <Button onClick={handleRoll} variant="primary">
          Roll Dice
        </Button>
      )}
    </div>
  );
}
