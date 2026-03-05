import type { GameState } from '../types/game';
import type { Card, CardEffect } from '../types/cards';
import { transferMoney } from './bank';
import { sendToJail } from './jail';
import { BOARD_SIZE, GO_SALARY } from '../data/constants';

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function drawCard(
  state: GameState,
  deckType: 'chance' | 'lottery'
): { state: GameState; card: Card } {
  const deckKey = deckType === 'chance' ? 'chanceDeck' : 'lotteryDeck';
  const discardKey = deckType === 'chance' ? 'chanceDiscard' : 'lotteryDiscard';

  let deck = [...state[deckKey]];
  let discard = [...state[discardKey]];

  if (deck.length === 0) {
    deck = shuffle(discard);
    discard = [];
  }

  const card = deck.shift()!;

  if (card.effect.type !== 'getOutOfJailFree') {
    discard.push(card);
  }

  return {
    state: { ...state, [deckKey]: deck, [discardKey]: discard, currentCard: card },
    card,
  };
}

export function applyCardEffect(state: GameState, card: Card): GameState {
  const currentPlayer = state.players[state.currentPlayerIndex];
  const effect: CardEffect = card.effect;

  switch (effect.type) {
    case 'moveTo': {
      const passesGo = effect.position < currentPlayer.position && effect.position !== 0;
      let newState = state;
      if (passesGo || (effect.position === 0 && currentPlayer.position !== 0)) {
        newState = transferMoney(state, 'bank', currentPlayer.id, GO_SALARY);
        newState = { ...newState, log: [...newState.log, `${currentPlayer.name} passed GO and collected $${GO_SALARY}.`] };
      }
      return {
        ...newState,
        players: newState.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, position: effect.position } : p
        ),
      };
    }
    case 'moveSteps': {
      const newPos = (currentPlayer.position + effect.steps + BOARD_SIZE) % BOARD_SIZE;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, position: newPos } : p
        ),
      };
    }
    case 'goBack': {
      const newPos = (currentPlayer.position - effect.steps + BOARD_SIZE) % BOARD_SIZE;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, position: newPos } : p
        ),
      };
    }
    case 'collect':
      return transferMoney(state, 'bank', currentPlayer.id, effect.amount);
    case 'pay':
      return transferMoney(state, currentPlayer.id, 'freeParking', effect.amount);
    case 'goToJail':
      return sendToJail(state, currentPlayer.id);
    case 'getOutOfJailFree':
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, hasGetOutOfJailCard: true } : p
        ),
      };
    case 'collectFromEachPlayer': {
      let newState = state;
      for (const p of state.players) {
        if (p.id !== currentPlayer.id && !p.isBankrupt) {
          newState = transferMoney(newState, p.id, currentPlayer.id, effect.amount);
        }
      }
      return newState;
    }
    case 'payEachPlayer': {
      let newState = state;
      for (const p of state.players) {
        if (p.id !== currentPlayer.id && !p.isBankrupt) {
          newState = transferMoney(newState, currentPlayer.id, p.id, effect.amount);
        }
      }
      return newState;
    }
    case 'moveToNearestRailroad': {
      const railroadPositions = [5, 15, 25, 35];
      const pos = currentPlayer.position;
      const nearest = railroadPositions.find((r) => r > pos) ?? railroadPositions[0];
      const passesGo = nearest < pos;
      let newState = state;
      if (passesGo) {
        newState = transferMoney(state, 'bank', currentPlayer.id, GO_SALARY);
      }
      return {
        ...newState,
        players: newState.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, position: nearest } : p
        ),
      };
    }
    case 'moveToNearestUtility': {
      const utilityPositions = [12, 28];
      const pos = currentPlayer.position;
      const nearest = utilityPositions.find((u) => u > pos) ?? utilityPositions[0];
      const passesGo = nearest < pos;
      let newState = state;
      if (passesGo) {
        newState = transferMoney(state, 'bank', currentPlayer.id, GO_SALARY);
      }
      return {
        ...newState,
        players: newState.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, position: nearest } : p
        ),
      };
    }
  }
}
