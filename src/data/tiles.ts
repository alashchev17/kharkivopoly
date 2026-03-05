import type { BoardTile } from '../types/board';

export const BOARD_TILES: BoardTile[] = [
  // Bottom row (right to left: 0-10)
  { type: 'go', id: 0, name: 'GO', imageKey: 'tiles/go' },
  { type: 'property', id: 1, name: 'Kholodna Hora', price: 60, rent: 2, colorGroup: 'brown', imageKey: 'tiles/brown_1' },
  { type: 'lottery', id: 2, name: 'Lottery', imageKey: 'tiles/lottery' },
  { type: 'property', id: 3, name: 'Kvitka-Osnovianenko St', price: 60, rent: 4, colorGroup: 'brown', imageKey: 'tiles/brown_2' },
  { type: 'tax', id: 4, name: 'Income Tax', amount: 200, imageKey: 'tiles/income_tax' },
  { type: 'railroad', id: 5, name: 'Pivdennyi Station', price: 200, imageKey: 'tiles/railroad_1' },
  { type: 'property', id: 6, name: 'Haharina Ave', price: 100, rent: 6, colorGroup: 'lightBlue', imageKey: 'tiles/lightblue_1' },
  { type: 'chance', id: 7, name: 'Chance', imageKey: 'tiles/chance' },
  { type: 'property', id: 8, name: 'Heroiv Pratsi Ave', price: 100, rent: 6, colorGroup: 'lightBlue', imageKey: 'tiles/lightblue_2' },
  { type: 'property', id: 9, name: 'Saltivske Hwy', price: 120, rent: 8, colorGroup: 'lightBlue', imageKey: 'tiles/lightblue_3' },

  // Left column (bottom to top: 10-20)
  { type: 'jail', id: 10, name: 'Jail / Visiting', imageKey: 'tiles/jail' },
  { type: 'property', id: 11, name: 'Klochkivska St', price: 140, rent: 10, colorGroup: 'pink', imageKey: 'tiles/pink_1' },
  { type: 'utility', id: 12, name: 'Kharkivoblenergo', price: 150, imageKey: 'tiles/utility_1' },
  { type: 'property', id: 13, name: 'Poltavskyi Shliakh', price: 140, rent: 10, colorGroup: 'pink', imageKey: 'tiles/pink_2' },
  { type: 'property', id: 14, name: 'Moskovskyi Ave', price: 160, rent: 12, colorGroup: 'pink', imageKey: 'tiles/pink_3' },
  { type: 'railroad', id: 15, name: 'Kharkiv-Pasazhyrskyi', price: 200, imageKey: 'tiles/railroad_2' },
  { type: 'property', id: 16, name: 'Pushkinska St', price: 180, rent: 14, colorGroup: 'orange', imageKey: 'tiles/orange_1' },
  { type: 'lottery', id: 17, name: 'Lottery', imageKey: 'tiles/lottery' },
  { type: 'property', id: 18, name: 'Rymarska St', price: 180, rent: 14, colorGroup: 'orange', imageKey: 'tiles/orange_2' },
  { type: 'property', id: 19, name: 'Konstytutsii Sq', price: 200, rent: 16, colorGroup: 'orange', imageKey: 'tiles/orange_3' },

  // Top row (left to right: 20-30)
  { type: 'freeParking', id: 20, name: 'Free Parking', imageKey: 'tiles/free_parking' },
  { type: 'property', id: 21, name: 'Nauky Ave', price: 220, rent: 18, colorGroup: 'red', imageKey: 'tiles/red_1' },
  { type: 'chance', id: 22, name: 'Chance', imageKey: 'tiles/chance' },
  { type: 'property', id: 23, name: 'Shevchenko St', price: 220, rent: 18, colorGroup: 'red', imageKey: 'tiles/red_2' },
  { type: 'property', id: 24, name: 'Universytetska St', price: 240, rent: 20, colorGroup: 'red', imageKey: 'tiles/red_3' },
  { type: 'railroad', id: 25, name: 'Levada Station', price: 200, imageKey: 'tiles/railroad_3' },
  { type: 'property', id: 26, name: 'Darvina St', price: 260, rent: 22, colorGroup: 'yellow', imageKey: 'tiles/yellow_1' },
  { type: 'property', id: 27, name: 'Kultur St', price: 260, rent: 22, colorGroup: 'yellow', imageKey: 'tiles/yellow_2' },
  { type: 'utility', id: 28, name: 'Kharkivvodokanal', price: 150, imageKey: 'tiles/utility_2' },
  { type: 'property', id: 29, name: 'Yerohova St', price: 280, rent: 24, colorGroup: 'yellow', imageKey: 'tiles/yellow_3' },

  // Right column (top to bottom: 30-39)
  { type: 'goToJail', id: 30, name: 'Go To Jail', imageKey: 'tiles/go_to_jail' },
  { type: 'property', id: 31, name: 'Sumska St', price: 300, rent: 26, colorGroup: 'green', imageKey: 'tiles/green_1' },
  { type: 'property', id: 32, name: 'Myronosytska St', price: 300, rent: 26, colorGroup: 'green', imageKey: 'tiles/green_2' },
  { type: 'lottery', id: 33, name: 'Lottery', imageKey: 'tiles/lottery' },
  { type: 'property', id: 34, name: 'Alchevskyh St', price: 320, rent: 28, colorGroup: 'green', imageKey: 'tiles/green_3' },
  { type: 'railroad', id: 35, name: 'Osnova Station', price: 200, imageKey: 'tiles/railroad_4' },
  { type: 'chance', id: 36, name: 'Chance', imageKey: 'tiles/chance' },
  { type: 'property', id: 37, name: 'Svobody Square', price: 350, rent: 35, colorGroup: 'darkBlue', imageKey: 'tiles/darkblue_1' },
  { type: 'tax', id: 38, name: 'Luxury Tax', amount: 100, imageKey: 'tiles/luxury_tax' },
  { type: 'property', id: 39, name: 'Maidan Nezalezhnosti', price: 400, rent: 50, colorGroup: 'darkBlue', imageKey: 'tiles/darkblue_2' },
];
