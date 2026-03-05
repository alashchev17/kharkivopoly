import type { Player } from '../../types/player';
import './PlayerToken.css';

export function PlayerToken({ player, stepping = false }: { player: Player; stepping?: boolean }) {
  return (
    <div
      className={`player-token ${stepping ? 'player-token-stepping' : ''}`}
      style={{ backgroundColor: player.tokenColor }}
      title={player.name}
    >
      {player.name[0]}
    </div>
  );
}
