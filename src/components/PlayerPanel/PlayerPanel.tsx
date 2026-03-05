import { useGame } from '../../context/GameContext';
import { Button } from '../shared/Button';
import { MoneyDisplay } from '../shared/MoneyDisplay';
import { JAIL_FEE } from '../../data/constants';
import './PlayerPanel.css';

export function PlayerPanel() {
  const { state, dispatch } = useGame();
  const player = state.players[state.currentPlayerIndex];
  if (!player) return null;

  const tile = state.board[player.position];

  return (
    <div className="player-panel">
      <div className="current-player">
        <div className="player-header">
          <div className="player-dot" style={{ backgroundColor: player.tokenColor }} />
          <span className="player-name-label">{player.name}</span>
          <MoneyDisplay amount={player.money} />
        </div>

        {state.phase === 'moving' && (
          <div className="action-row">
            <span className="action-text">Moving...</span>
          </div>
        )}

        {state.phase === 'buyDecision' && (tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility') && (
          <div className="action-row">
            <span className="action-text">Buy {tile.name}?</span>
            <div className="action-buttons">
              <Button onClick={() => dispatch({ type: 'BUY_PROPERTY' })} variant="primary">
                Buy (${tile.price})
              </Button>
              <Button onClick={() => dispatch({ type: 'DECLINE_PROPERTY' })} variant="secondary">
                Pass
              </Button>
            </div>
          </div>
        )}

        {state.phase === 'inJail' && (
          <div className="action-row">
            <span className="action-text">In Jail! (Turn {player.jailTurns + 1}/3)</span>
            <div className="action-buttons">
              <Button
                onClick={() => dispatch({ type: 'PAY_JAIL_FEE' })}
                variant="primary"
                disabled={player.money < JAIL_FEE}
              >
                Pay ${JAIL_FEE}
              </Button>
              {player.hasGetOutOfJailCard && (
                <Button onClick={() => dispatch({ type: 'USE_JAIL_CARD' })} variant="primary">
                  Use Card
                </Button>
              )}
              <Button onClick={() => dispatch({ type: 'TRY_JAIL_DOUBLES' })} variant="secondary">
                Roll Doubles
              </Button>
            </div>
          </div>
        )}

        {state.phase === 'turnEnd' && (
          <div className="action-row">
            <span className="action-text">Landed on: {tile.name}</span>
            <div className="action-buttons">
              <Button onClick={() => dispatch({ type: 'END_TURN' })} variant="primary">
                End Turn
              </Button>
              <Button onClick={() => dispatch({ type: 'DECLARE_BANKRUPTCY' })} variant="danger">
                Declare Bankruptcy
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      <div className="scoreboard">
        {state.players.map((p) => (
          <div
            key={p.id}
            className={`score-row ${p.isBankrupt ? 'bankrupt' : ''} ${p.id === player.id ? 'active' : ''}`}
          >
            <div className="score-dot" style={{ backgroundColor: p.tokenColor }} />
            <span className="score-name">{p.name}</span>
            <MoneyDisplay amount={p.money} />
            <span className="score-props">{p.ownedProperties.length} props</span>
          </div>
        ))}
      </div>

      {/* Game Log */}
      <div className="game-log">
        {state.log.slice(-5).map((msg, i) => (
          <div key={i} className="log-entry">{msg}</div>
        ))}
      </div>
    </div>
  );
}
