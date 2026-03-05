import type { GameState, GamePhase } from '../types/game';
import type { OwnableTile } from '../types/board';
import { calculateRent } from './rent';
import { transferMoney } from './bank';
import { sendToJail } from './jail';
import { drawCard } from './cards';
import { GO_SALARY } from '../data/constants';

export function handleLanding(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];
  const tile = state.board[player.position];

  switch (tile.type) {
    case 'go':
      return { ...state, phase: 'turnEnd' as GamePhase };

    case 'property':
    case 'railroad':
    case 'utility': {
      const owner = state.players.find((p) =>
        p.ownedProperties.includes(tile.id)
      );

      if (!owner) {
        if (player.money >= (tile as OwnableTile).price) {
          return { ...state, phase: 'buyDecision' as GamePhase };
        }
        return {
          ...state,
          phase: 'turnEnd' as GamePhase,
          log: [...state.log, `${player.name} cannot afford ${tile.name}.`],
        };
      }

      if (owner.id === player.id) {
        return { ...state, phase: 'turnEnd' as GamePhase };
      }

      if (owner.inJail) {
        return {
          ...state,
          phase: 'turnEnd' as GamePhase,
          log: [...state.log, `${owner.name} is in jail — no rent collected.`],
        };
      }

      const rent = calculateRent(tile, state, state.dice.total);
      const newState = transferMoney(state, player.id, owner.id, rent);
      return {
        ...newState,
        phase: 'turnEnd' as GamePhase,
        log: [...newState.log, `${player.name} paid $${rent} rent to ${owner.name} for ${tile.name}.`],
      };
    }

    case 'chance':
    case 'lottery': {
      // First enter cardDrawing phase (animation plays), then CARD_DRAW_DONE reveals
      const deckType = tile.type === 'chance' ? 'chance' : 'lottery';
      const { state: newState, card } = drawCard(state, deckType);
      return {
        ...newState,
        phase: 'cardDrawing' as GamePhase,
        log: [...newState.log, `${player.name} drew a ${card.cardType} card: ${card.title}`],
      };
    }

    case 'tax': {
      const newState = transferMoney(state, player.id, 'freeParking', tile.amount);
      return {
        ...newState,
        phase: 'turnEnd' as GamePhase,
        log: [...newState.log, `${player.name} paid $${tile.amount} in ${tile.name}.`],
      };
    }

    case 'jail':
      return {
        ...state,
        phase: 'turnEnd' as GamePhase,
        log: [...state.log, `${player.name} is just visiting Jail.`],
      };

    case 'freeParking': {
      const pool = state.freeParkingPool;
      if (pool > 0) {
        const newState = transferMoney(state, 'bank', player.id, pool);
        return {
          ...newState,
          freeParkingPool: 0,
          phase: 'turnEnd' as GamePhase,
          log: [...newState.log, `${player.name} collected $${pool} from Free Parking!`],
        };
      }
      return { ...state, phase: 'turnEnd' as GamePhase };
    }

    case 'goToJail': {
      const newState = sendToJail(state, player.id);
      return {
        ...newState,
        phase: 'turnEnd' as GamePhase,
        dice: { ...newState.dice, doublesCount: 0 },
      };
    }

    default:
      return { ...state, phase: 'turnEnd' as GamePhase };
  }
}

export function handleCardLanding(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];
  const tile = state.board[player.position];

  if (tile.type === 'goToJail') {
    return { ...state, phase: 'turnEnd' as GamePhase };
  }

  return handleLanding(state);
}

export function movePlayer(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];
  const newPosition = (player.position + state.dice.total) % 40;
  const passedGo = newPosition < player.position;

  let newState = {
    ...state,
    players: state.players.map((p) =>
      p.id === player.id ? { ...p, position: newPosition } : p
    ),
  };

  if (passedGo) {
    newState = transferMoney(newState, 'bank', player.id, GO_SALARY);
    newState = {
      ...newState,
      log: [...newState.log, `${player.name} passed GO and collected $${GO_SALARY}.`],
    };
  }

  return newState;
}

export function advanceToNextPlayer(state: GameState): GameState {
  const activePlayers = state.players.filter((p) => !p.isBankrupt);

  if (activePlayers.length <= 1) {
    return {
      ...state,
      phase: 'gameOver' as GamePhase,
      winner: activePlayers[0] ?? null,
    };
  }

  if (state.dice.isDoubles && state.dice.doublesCount < 3) {
    const player = state.players[state.currentPlayerIndex];
    if (!player.inJail) {
      return {
        ...state,
        phase: 'rollDice' as GamePhase,
        dice: { ...state.dice, rolled: false },
        log: [...state.log, `${player.name} rolled doubles — rolling again!`],
      };
    }
  }

  let nextIndex = state.currentPlayerIndex;
  do {
    nextIndex = (nextIndex + 1) % state.players.length;
  } while (state.players[nextIndex].isBankrupt);

  const nextPlayer = state.players[nextIndex];
  const nextPhase: GamePhase = nextPlayer.inJail ? 'inJail' : 'rollDice';

  return {
    ...state,
    currentPlayerIndex: nextIndex,
    phase: nextPhase,
    dice: { die1: 0, die2: 0, total: 0, isDoubles: false, doublesCount: 0, rolled: false },
  };
}
