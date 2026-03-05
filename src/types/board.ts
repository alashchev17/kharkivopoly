export type ColorGroup =
  | 'brown'
  | 'lightBlue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'darkBlue';

export interface PropertyTile {
  type: 'property';
  id: number;
  name: string;
  price: number;
  rent: number;
  colorGroup: ColorGroup;
  imageKey: string;
}

export interface RailroadTile {
  type: 'railroad';
  id: number;
  name: string;
  price: number;
  imageKey: string;
}

export interface UtilityTile {
  type: 'utility';
  id: number;
  name: string;
  price: number;
  imageKey: string;
}

export interface ChanceTile {
  type: 'chance';
  id: number;
  name: string;
  imageKey: string;
}

export interface LotteryTile {
  type: 'lottery';
  id: number;
  name: string;
  imageKey: string;
}

export interface TaxTile {
  type: 'tax';
  id: number;
  name: string;
  amount: number;
  imageKey: string;
}

export interface GoTile {
  type: 'go';
  id: number;
  name: string;
  imageKey: string;
}

export interface JailTile {
  type: 'jail';
  id: number;
  name: string;
  imageKey: string;
}

export interface FreeParkingTile {
  type: 'freeParking';
  id: number;
  name: string;
  imageKey: string;
}

export interface GoToJailTile {
  type: 'goToJail';
  id: number;
  name: string;
  imageKey: string;
}

export type BoardTile =
  | PropertyTile
  | RailroadTile
  | UtilityTile
  | ChanceTile
  | LotteryTile
  | TaxTile
  | GoTile
  | JailTile
  | FreeParkingTile
  | GoToJailTile;

export type OwnableTile = PropertyTile | RailroadTile | UtilityTile;
