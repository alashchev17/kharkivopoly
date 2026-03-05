import type { GameState } from '../types/game';

export function transferMoney(
  state: GameState,
  fromPlayerId: number | 'bank',
  toPlayerId: number | 'bank' | 'freeParking',
  amount: number
): GameState {
  const players = state.players.map((p) => {
    if (p.id === fromPlayerId) {
      return { ...p, money: p.money - amount };
    }
    if (p.id === toPlayerId) {
      return { ...p, money: p.money + amount };
    }
    return p;
  });

  let freeParkingPool = state.freeParkingPool;
  if (toPlayerId === 'freeParking') {
    freeParkingPool += amount;
  }

  return { ...state, players, freeParkingPool };
}

export function canAfford(state: GameState, playerId: number, amount: number): boolean {
  const player = state.players.find((p) => p.id === playerId);
  return player ? player.money >= amount : false;
}
