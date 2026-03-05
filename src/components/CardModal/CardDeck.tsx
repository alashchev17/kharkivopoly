import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import './CardDeck.css';

export function CardDeck() {
  const { state, dispatch } = useGame();
  const [drawAnimating, setDrawAnimating] = useState(false);

  // When entering cardDrawing phase, play draw animation then dispatch CARD_DRAW_DONE
  useEffect(() => {
    if (state.phase !== 'cardDrawing') {
      setDrawAnimating(false);
      return;
    }

    setDrawAnimating(true);
    const timer = setTimeout(() => {
      setDrawAnimating(false);
      dispatch({ type: 'CARD_DRAW_DONE' });
    }, 800);

    return () => clearTimeout(timer);
  }, [state.phase, dispatch]);

  const isChanceDraw = drawAnimating && state.currentCard?.cardType === 'chance';
  const isLotteryDraw = drawAnimating && state.currentCard?.cardType === 'lottery';

  return (
    <div className="card-decks">
      <div className={`card-deck chance-deck ${isChanceDraw ? 'deck-drawing' : ''}`}>
        <div className="deck-stack">
          <div className="deck-card deck-card-3" />
          <div className="deck-card deck-card-2" />
          <div className={`deck-card deck-card-1 ${isChanceDraw ? 'card-fly-out' : ''}`} />
        </div>
        <span className="deck-label">Chance</span>
        <span className="deck-icon">?</span>
      </div>
      <div className={`card-deck lottery-deck ${isLotteryDraw ? 'deck-drawing' : ''}`}>
        <div className="deck-stack">
          <div className="deck-card deck-card-3" />
          <div className="deck-card deck-card-2" />
          <div className={`deck-card deck-card-1 ${isLotteryDraw ? 'card-fly-out' : ''}`} />
        </div>
        <span className="deck-label">Lottery</span>
        <span className="deck-icon">&#x1F3B0;</span>
      </div>
    </div>
  );
}
