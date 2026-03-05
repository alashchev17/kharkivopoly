import type { GameState, GameAction, DiceState } from '../types/game';
import type { Player } from '../types/player';
import type { OwnableTile } from '../types/board';
import { BOARD_TILES } from '../data/tiles';
import { CHANCE_CARDS } from '../data/chanceCards';
import { LOTTERY_CARDS } from '../data/lotteryCards';
import { STARTING_MONEY, MAX_DOUBLES } from '../data/constants';
import { rollDice } from './dice';
import { shuffle, applyCardEffect } from './cards';
import { transferMoney } from './bank';
import { sendToJail, payJailFee, useJailCard, tryRollDoubles } from './jail';
import { handleLanding, handleCardLanding, movePlayer, advanceToNextPlayer } from './turnFlow';
import { checkBankruptcy } from './bankruptcy';

export function createInitialState(): GameState {
  return {
    phase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    board: BOARD_TILES,
    dice: { die1: 0, die2: 0, total: 0, isDoubles: false, doublesCount: 0, rolled: false },
    chanceDeck: shuffle(CHANCE_CARDS),
    lotteryDeck: shuffle(LOTTERY_CARDS),
    chanceDiscard: [],
    lotteryDiscard: [],
    currentCard: null,
    moveFrom: 0,
    freeParkingPool: 0,
    winner: null,
    log: [],
  };
}

function startGame(
  state: GameState,
  playerData: { name: string; tokenColor: string }[]
): GameState {
  const players: Player[] = playerData.map((p, i) => ({
    id: i,
    name: p.name,
    money: STARTING_MONEY,
    position: 0,
    ownedProperties: [],
    inJail: false,
    jailTurns: 0,
    hasGetOutOfJailCard: false,
    isBankrupt: false,
    tokenColor: p.tokenColor,
    tokenImageKey: `tokens/player_${i}`,
  }));

  return {
    ...state,
    phase: 'rollDice',
    players,
    currentPlayerIndex: 0,
    log: ['Game started! ' + players.map((p) => p.name).join(', ') + ' are playing.'],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return startGame(state, action.players);

    case 'ROLL_DICE': {
      const { die1, die2 } = rollDice();
      const total = die1 + die2;
      const isDoubles = die1 === die2;
      const doublesCount = isDoubles ? state.dice.doublesCount + 1 : 0;
      const player = state.players[state.currentPlayerIndex];

      const dice: DiceState = { die1, die2, total, isDoubles, doublesCount, rolled: true };

      if (doublesCount >= MAX_DOUBLES) {
        const newState = sendToJail(
          { ...state, dice },
          player.id
        );
        return {
          ...newState,
          phase: 'turnEnd',
          log: [...newState.log, `${player.name} rolled doubles 3 times — sent to Jail!`],
        };
      }

      const moveFrom = player.position;
      const movedState = movePlayer({ ...state, dice, moveFrom });
      return {
        ...movedState,
        phase: 'moving',
        log: [...movedState.log, `${player.name} rolled ${die1}+${die2}=${total}.`],
      };
    }

    case 'FINISH_MOVE': {
      const landedState = handleLanding(state);
      return checkBankruptcy(landedState);
    }

    case 'CARD_DRAW_DONE': {
      // Animation finished, now reveal the card
      return { ...state, phase: 'cardReveal' };
    }

    case 'BUY_PROPERTY': {
      const player = state.players[state.currentPlayerIndex];
      const tile = state.board[player.position] as OwnableTile;
      const newState = transferMoney(state, player.id, 'bank', tile.price);
      return {
        ...newState,
        players: newState.players.map((p) =>
          p.id === player.id
            ? { ...p, ownedProperties: [...p.ownedProperties, tile.id] }
            : p
        ),
        phase: 'turnEnd',
        log: [...newState.log, `${player.name} bought ${tile.name} for $${tile.price}.`],
      };
    }

    case 'DECLINE_PROPERTY': {
      const player = state.players[state.currentPlayerIndex];
      const tile = state.board[player.position];
      return {
        ...state,
        phase: 'turnEnd',
        log: [...state.log, `${player.name} declined to buy ${tile.name}.`],
      };
    }

    case 'ACKNOWLEDGE_CARD': {
      if (!state.currentCard) return { ...state, phase: 'turnEnd' };

      const card = state.currentCard;
      let newState = applyCardEffect(state, card);
      newState = { ...newState, currentCard: null };
      newState = checkBankruptcy(newState);

      // If card moved the player, process landing
      if (
        card.effect.type === 'moveTo' ||
        card.effect.type === 'moveSteps' ||
        card.effect.type === 'goBack' ||
        card.effect.type === 'moveToNearestRailroad' ||
        card.effect.type === 'moveToNearestUtility'
      ) {
        return handleCardLanding(newState);
      }

      if (card.effect.type === 'goToJail') {
        return { ...newState, phase: 'turnEnd' };
      }

      return { ...newState, phase: 'turnEnd' };
    }

    case 'PAY_JAIL_FEE': {
      const player = state.players[state.currentPlayerIndex];
      const newState = payJailFee(state, player.id);
      return { ...newState, phase: 'rollDice' };
    }

    case 'USE_JAIL_CARD': {
      const player = state.players[state.currentPlayerIndex];
      const newState = useJailCard(state, player.id);
      return { ...newState, phase: 'rollDice' };
    }

    case 'TRY_JAIL_DOUBLES': {
      const player = state.players[state.currentPlayerIndex];
      const newState = tryRollDoubles(state, player.id);
      const updatedPlayer = newState.players.find((p) => p.id === player.id)!;

      if (!updatedPlayer.inJail) {
        const moveFrom = updatedPlayer.position;
        const movedState = movePlayer(newState);
        return { ...movedState, phase: 'moving', moveFrom };
      }

      return { ...newState, phase: 'turnEnd' };
    }

    case 'END_TURN':
      return advanceToNextPlayer(state);

    case 'DECLARE_BANKRUPTCY': {
      const player = state.players[state.currentPlayerIndex];
      const newState: GameState = {
        ...state,
        players: state.players.map((p) =>
          p.id === player.id
            ? { ...p, isBankrupt: true, money: 0, ownedProperties: [] }
            : p
        ),
        log: [...state.log, `${player.name} declared bankruptcy!`],
      };
      const activePlayers = newState.players.filter((p) => !p.isBankrupt);
      if (activePlayers.length === 1) {
        return { ...newState, phase: 'gameOver', winner: activePlayers[0] };
      }
      return advanceToNextPlayer(newState);
    }

    case 'PLAY_AGAIN':
      return createInitialState();

    default:
      return state;
  }
}
