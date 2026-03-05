export const STARTING_MONEY = 1500;
export const GO_SALARY = 200;
export const JAIL_FEE = 50;
export const JAIL_POSITION = 10;
export const GO_TO_JAIL_POSITION = 30;
export const MAX_JAIL_TURNS = 3;
export const MAX_DOUBLES = 3;
export const BOARD_SIZE = 40;
export const INCOME_TAX_AMOUNT = 200;
export const LUXURY_TAX_AMOUNT = 100;

export const TOKEN_COLORS = [
  '#e74c3c', // red
  '#3498db', // blue
  '#2ecc71', // green
  '#f39c12', // orange
  '#9b59b6', // purple
  '#1abc9c', // teal
] as const;

export const COLOR_GROUP_COLORS: Record<string, string> = {
  brown: '#8B4513',
  lightBlue: '#87CEEB',
  pink: '#FF69B4',
  orange: '#FF8C00',
  red: '#FF0000',
  yellow: '#FFD700',
  green: '#008000',
  darkBlue: '#00008B',
};

export const RAILROAD_RENTS = [25, 50, 100, 200] as const;
