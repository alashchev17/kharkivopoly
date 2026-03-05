export type CardType = 'chance' | 'lottery';

export type CardEffect =
  | { type: 'moveTo'; position: number }
  | { type: 'moveSteps'; steps: number }
  | { type: 'collect'; amount: number }
  | { type: 'pay'; amount: number }
  | { type: 'goToJail' }
  | { type: 'getOutOfJailFree' }
  | { type: 'collectFromEachPlayer'; amount: number }
  | { type: 'payEachPlayer'; amount: number }
  | { type: 'moveToNearestRailroad' }
  | { type: 'moveToNearestUtility' }
  | { type: 'goBack'; steps: number };

export interface Card {
  id: string;
  cardType: CardType;
  title: string;
  description: string;
  effect: CardEffect;
  imageKey: string;
}
