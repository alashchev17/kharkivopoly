import type { GameState } from '../types/game';
import type { OwnableTile } from '../types/board';
import { RAILROAD_RENTS } from '../data/constants';

export function calculateRent(
  tile: OwnableTile,
  state: GameState,
  diceTotal: number
): number {
  const owner = state.players.find((p) =>
    p.ownedProperties.includes(tile.id)
  );
  if (!owner) return 0;

  switch (tile.type) {
    case 'property': {
      const colorGroupTiles = state.board.filter(
        (t) => t.type === 'property' && t.colorGroup === tile.colorGroup
      );
      const ownsAll = colorGroupTiles.every((t) =>
        owner.ownedProperties.includes(t.id)
      );
      return ownsAll ? tile.rent * 2 : tile.rent;
    }
    case 'railroad': {
      const ownedRailroads = state.board.filter(
        (t) => t.type === 'railroad' && owner.ownedProperties.includes(t.id)
      ).length;
      return RAILROAD_RENTS[ownedRailroads - 1];
    }
    case 'utility': {
      const ownedUtilities = state.board.filter(
        (t) => t.type === 'utility' && owner.ownedProperties.includes(t.id)
      ).length;
      return ownedUtilities === 2 ? diceTotal * 10 : diceTotal * 4;
    }
  }
}
