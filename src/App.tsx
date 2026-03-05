import { useGame } from './context/GameContext';
import { SetupScreen } from './components/SetupScreen/SetupScreen';
import { Board } from './components/Board/Board';
import { CardModal } from './components/CardModal/CardModal';
import { GameOver } from './components/GameOver/GameOver';

export default function App() {
  const { state } = useGame();

  if (state.phase === 'setup') {
    return <SetupScreen />;
  }

  if (state.phase === 'gameOver') {
    return <GameOver />;
  }

  return (
    <>
      <Board />
      {state.phase === 'cardReveal' && state.currentCard && <CardModal />}
    </>
  );
  // Note: cardDrawing phase animation is handled by CardDeck inside Board
}
