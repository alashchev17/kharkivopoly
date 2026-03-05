import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { TOKEN_COLORS } from '../../data/constants';
import { Button } from '../shared/Button';
import './SetupScreen.css';

export function SetupScreen() {
  const { dispatch } = useGame();
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState<string[]>(
    Array.from({ length: 6 }, (_, i) => `Player ${i + 1}`)
  );

  const handleStart = () => {
    const players = Array.from({ length: playerCount }, (_, i) => ({
      name: names[i].trim() || `Player ${i + 1}`,
      tokenColor: TOKEN_COLORS[i],
    }));
    dispatch({ type: 'START_GAME', players });
  };

  return (
    <div className="setup-screen">
      <h1 className="setup-title">KHARKIVOPOLY</h1>
      <p className="setup-subtitle">A Kharkiv-themed Monopoly game</p>

      <div className="setup-form">
        <label className="setup-label">
          Number of players:
          <select
            value={playerCount}
            onChange={(e) => setPlayerCount(Number(e.target.value))}
            className="setup-select"
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} players</option>
            ))}
          </select>
        </label>

        <div className="player-inputs">
          {Array.from({ length: playerCount }, (_, i) => (
            <div key={i} className="player-input-row">
              <div
                className="color-dot"
                style={{ backgroundColor: TOKEN_COLORS[i] }}
              />
              <input
                type="text"
                value={names[i]}
                onChange={(e) => {
                  const next = [...names];
                  next[i] = e.target.value;
                  setNames(next);
                }}
                placeholder={`Player ${i + 1}`}
                className="player-name-input"
                maxLength={20}
              />
            </div>
          ))}
        </div>

        <Button onClick={handleStart} variant="primary">
          Start Game
        </Button>
      </div>
    </div>
  );
}
