import type { GameState } from '../types/game';

export function checkBankruptcy(state: GameState): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];

  if (currentPlayer.money >= 0 || currentPlayer.isBankrupt) {
    return state;
  }

  return eliminatePlayer(state, currentPlayer.id);
}

export function eliminatePlayer(state: GameState, playerId: number): GameState {
  const player = state.players.find((p) => p.id === playerId)!;

  const players = state.players.map((p) =>
    p.id === playerId
      ? { ...p, isBankrupt: true, money: 0, ownedProperties: [] }
      : p
  );

  const newState = {
    ...state,
    players,
    log: [...state.log, `${player.name} went bankrupt and is eliminated!`],
  };

  return checkWinner(newState);
}

export function checkWinner(state: GameState): GameState {
  const activePlayers = state.players.filter((p) => !p.isBankrupt);

  if (activePlayers.length === 1) {
    return {
      ...state,
      phase: 'gameOver',
      winner: activePlayers[0],
    };
  }

  return state;
}
