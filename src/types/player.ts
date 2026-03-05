export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  ownedProperties: number[];
  inJail: boolean;
  jailTurns: number;
  hasGetOutOfJailCard: boolean;
  isBankrupt: boolean;
  tokenColor: string;
  tokenImageKey: string;
}
