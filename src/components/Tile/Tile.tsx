import type { BoardTile } from '../../types/board';
import type { GameState } from '../../types/game';
import { COLOR_GROUP_COLORS } from '../../data/constants';
import './Tile.css';

interface TileProps {
  tile: BoardTile;
  state: GameState;
}

function getOwnerColor(tileId: number, state: GameState): string | null {
  const owner = state.players.find((p) => p.ownedProperties.includes(tileId));
  return owner ? owner.tokenColor : null;
}

function getTileOrientation(id: number): 'bottom' | 'left' | 'top' | 'right' | 'corner' {
  if (id === 0 || id === 10 || id === 20 || id === 30) return 'corner';
  if (id >= 1 && id <= 9) return 'bottom';
  if (id >= 11 && id <= 19) return 'left';
  if (id >= 21 && id <= 29) return 'top';
  return 'right';
}

export function Tile({ tile, state }: TileProps) {
  const orientation = getTileOrientation(tile.id);
  const ownerColor = tile.type === 'property' || tile.type === 'railroad' || tile.type === 'utility'
    ? getOwnerColor(tile.id, state)
    : null;

  if (orientation === 'corner') {
    return (
      <div className={`tile tile-corner tile-${tile.type}`}>
        <span className="tile-name">{tile.name}</span>
        {tile.type === 'go' && <span className="tile-icon">&#x2B06;</span>}
        {tile.type === 'jail' && <span className="tile-icon">&#x1F6A8;</span>}
        {tile.type === 'freeParking' && <span className="tile-icon">&#x1F17F;</span>}
        {tile.type === 'goToJail' && <span className="tile-icon">&#x1F46E;</span>}
      </div>
    );
  }

  return (
    <div className={`tile tile-${orientation} tile-${tile.type}`}>
      {tile.type === 'property' && (
        <div
          className={`color-bar color-bar-${orientation}`}
          style={{ backgroundColor: COLOR_GROUP_COLORS[tile.colorGroup] }}
        />
      )}
      {ownerColor && (
        <div className="owner-indicator" style={{ backgroundColor: ownerColor }} />
      )}
      <span className="tile-name">{tile.name}</span>
      {tile.type === 'property' && <span className="tile-price">${tile.price}</span>}
      {tile.type === 'railroad' && (
        <>
          <span className="tile-icon">&#x1F682;</span>
          <span className="tile-price">${tile.price}</span>
        </>
      )}
      {tile.type === 'utility' && (
        <>
          <span className="tile-icon">&#x26A1;</span>
          <span className="tile-price">${tile.price}</span>
        </>
      )}
      {tile.type === 'chance' && <span className="tile-icon">&#x2753;</span>}
      {tile.type === 'lottery' && <span className="tile-icon">&#x1F3B0;</span>}
      {tile.type === 'tax' && (
        <>
          <span className="tile-icon">&#x1F4B0;</span>
          <span className="tile-price">${tile.amount}</span>
        </>
      )}
    </div>
  );
}
