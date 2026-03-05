import type { GameState } from '../types/game';
import { JAIL_POSITION, JAIL_FEE, MAX_JAIL_TURNS } from '../data/constants';
import { transferMoney } from './bank';
import { rollDice } from './dice';

export function sendToJail(state: GameState, playerId: number): GameState {
  const players = state.players.map((p) =>
    p.id === playerId
      ? { ...p, position: JAIL_POSITION, inJail: true, jailTurns: 0 }
      : p
  );
  return {
    ...state,
    players,
    log: [...state.log, `${state.players.find((p) => p.id === playerId)!.name} was sent to Jail!`],
  };
}

export function payJailFee(state: GameState, playerId: number): GameState {
  const player = state.players.find((p) => p.id === playerId)!;
  let newState = transferMoney(state, playerId, 'freeParking', JAIL_FEE);
  newState = {
    ...newState,
    players: newState.players.map((p) =>
      p.id === playerId ? { ...p, inJail: false, jailTurns: 0 } : p
    ),
    log: [...newState.log, `${player.name} paid $${JAIL_FEE} to get out of Jail.`],
  };
  return newState;
}

export function useJailCard(state: GameState, playerId: number): GameState {
  const player = state.players.find((p) => p.id === playerId)!;
  return {
    ...state,
    players: state.players.map((p) =>
      p.id === playerId
        ? { ...p, inJail: false, jailTurns: 0, hasGetOutOfJailCard: false }
        : p
    ),
    log: [...state.log, `${player.name} used a Get Out of Jail Free card.`],
  };
}

export function tryRollDoubles(state: GameState, playerId: number): GameState {
  const player = state.players.find((p) => p.id === playerId)!;
  const { die1, die2 } = rollDice();
  const isDoubles = die1 === die2;

  const newDice = {
    die1,
    die2,
    total: die1 + die2,
    isDoubles,
    doublesCount: 0,
    rolled: true,
  };

  if (isDoubles) {
    return {
      ...state,
      dice: newDice,
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, inJail: false, jailTurns: 0 } : p
      ),
      log: [...state.log, `${player.name} rolled doubles (${die1},${die2}) and is free from Jail!`],
    };
  }

  const newJailTurns = player.jailTurns + 1;
  if (newJailTurns >= MAX_JAIL_TURNS) {
    let newState = transferMoney(state, playerId, 'freeParking', JAIL_FEE);
    return {
      ...newState,
      dice: newDice,
      players: newState.players.map((p) =>
        p.id === playerId ? { ...p, inJail: false, jailTurns: 0 } : p
      ),
      log: [...newState.log, `${player.name} failed to roll doubles 3 times. Paid $${JAIL_FEE} and is free.`],
    };
  }

  return {
    ...state,
    dice: newDice,
    players: state.players.map((p) =>
      p.id === playerId ? { ...p, jailTurns: newJailTurns } : p
    ),
    log: [...state.log, `${player.name} rolled (${die1},${die2}) — no doubles. ${MAX_JAIL_TURNS - newJailTurns} attempt(s) left.`],
  };
}
