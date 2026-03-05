import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Tile } from '../Tile/Tile';
import { PlayerToken } from '../PlayerToken/PlayerToken';
import { Dice } from '../Dice/Dice';
import { PlayerPanel } from '../PlayerPanel/PlayerPanel';
import { CardDeck } from '../CardModal/CardDeck';
import { BOARD_SIZE } from '../../data/constants';
import './Board.css';

type GridPos = { row: number; col: number };

function tileGridPosition(id: number): GridPos {
  if (id >= 0 && id <= 10) {
    return { row: 11, col: 11 - id };
  }
  if (id >= 11 && id <= 19) {
    return { row: 10 - (id - 11), col: 1 };
  }
  if (id >= 20 && id <= 30) {
    return { row: 1, col: id - 20 + 1 };
  }
  return { row: id - 30 + 1, col: 11 };
}

const STEP_DELAY = 150; // ms per tile step

export function Board() {
  const { state, dispatch } = useGame();
  const [animatedPosition, setAnimatedPosition] = useState<number | null>(null);
  const animatingRef = useRef(false);

  // Movement animation: step through tiles one by one
  useEffect(() => {
    if (state.phase !== 'moving' || animatingRef.current) return;

    const player = state.players[state.currentPlayerIndex];
    const from = state.moveFrom;
    const to = player.position;

    if (from === to) {
      dispatch({ type: 'FINISH_MOVE' });
      return;
    }

    animatingRef.current = true;

    // Calculate the step-by-step path
    const steps: number[] = [];
    let pos = from;
    while (pos !== to) {
      pos = (pos + 1) % BOARD_SIZE;
      steps.push(pos);
    }

    setAnimatedPosition(from);

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAnimatedPosition(steps[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setAnimatedPosition(null);
        animatingRef.current = false;
        dispatch({ type: 'FINISH_MOVE' });
      }
    }, STEP_DELAY);

    return () => {
      clearInterval(interval);
      animatingRef.current = false;
    };
  }, [state.phase, state.moveFrom, state.currentPlayerIndex, state.players, dispatch]);

  // Determine display position for each player
  const currentPlayer = state.players[state.currentPlayerIndex];
  const isAnimating = state.phase === 'moving' && animatedPosition !== null;

  const playersByPosition = new Map<number, typeof state.players>();
  state.players.forEach((p) => {
    if (p.isBankrupt) return;

    let displayPos = p.position;
    if (isAnimating && p.id === currentPlayer?.id) {
      displayPos = animatedPosition;
    }

    const list = playersByPosition.get(displayPos) || [];
    list.push(p);
    playersByPosition.set(displayPos, list);
  });

  return (
    <div className="board-wrapper">
      <div className="board">
        {state.board.map((tile) => {
          const pos = tileGridPosition(tile.id);
          const playersOnTile = playersByPosition.get(tile.id) || [];
          return (
            <div
              key={tile.id}
              className="board-cell"
              style={{ gridRow: pos.row, gridColumn: pos.col }}
            >
              <Tile tile={tile} state={state} />
              {playersOnTile.length > 0 && (
                <div className="tokens-container">
                  {playersOnTile.map((p) => (
                    <PlayerToken
                      key={p.id}
                      player={p}
                      stepping={isAnimating && p.id === currentPlayer?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div className="board-center">
          <h1 className="board-title">KHARKIVOPOLY</h1>
          <CardDeck />
          <Dice />
          <PlayerPanel />
        </div>
      </div>
    </div>
  );
}
