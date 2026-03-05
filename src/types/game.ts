import type { BoardTile } from './board';
import type { Player } from './player';
import type { Card } from './cards';

export type GamePhase =
  | 'setup'
  | 'rollDice'
  | 'moving'
  | 'landed'
  | 'buyDecision'
  | 'cardDrawing'
  | 'cardReveal'
  | 'payingRent'
  | 'payingTax'
  | 'inJail'
  | 'turnEnd'
  | 'gameOver';

export interface DiceState {
  die1: number;
  die2: number;
  total: number;
  isDoubles: boolean;
  doublesCount: number;
  rolled: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  board: BoardTile[];
  dice: DiceState;
  chanceDeck: Card[];
  lotteryDeck: Card[];
  chanceDiscard: Card[];
  lotteryDiscard: Card[];
  currentCard: Card | null;
  moveFrom: number;
  freeParkingPool: number;
  winner: Player | null;
  log: string[];
}

export type GameAction =
  | { type: 'START_GAME'; players: { name: string; tokenColor: string }[] }
  | { type: 'ROLL_DICE' }
  | { type: 'FINISH_MOVE' }
  | { type: 'CARD_DRAW_DONE' }
  | { type: 'BUY_PROPERTY' }
  | { type: 'DECLINE_PROPERTY' }
  | { type: 'ACKNOWLEDGE_CARD' }
  | { type: 'PAY_JAIL_FEE' }
  | { type: 'USE_JAIL_CARD' }
  | { type: 'TRY_JAIL_DOUBLES' }
  | { type: 'END_TURN' }
  | { type: 'DECLARE_BANKRUPTCY' }
  | { type: 'PLAY_AGAIN' };
