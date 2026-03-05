import { useGame } from '../../context/GameContext';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import './CardModal.css';

export function CardModal() {
  const { state, dispatch } = useGame();
  const card = state.currentCard;
  if (!card) return null;

  return (
    <Modal>
      <div className="card-modal">
        <div className={`card-type-badge ${card.cardType}`}>
          {card.cardType === 'chance' ? 'Chance' : 'Lottery'}
        </div>
        <h2 className="card-title">{card.title}</h2>
        <p className="card-description">{card.description}</p>
        <Button onClick={() => dispatch({ type: 'ACKNOWLEDGE_CARD' })} variant="primary">
          OK
        </Button>
      </div>
    </Modal>
  );
}
