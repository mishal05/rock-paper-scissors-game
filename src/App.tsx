import React, { useState, useEffect } from 'react';
import { Scissors, FileText, CircleOff } from 'lucide-react';

// Game images for Rock, Paper, Scissors
const gameImages = {
  rock: `
    _______
---'   ____)
      (_____)
      (_____)
      (____)
---.__(___)
`,
  paper: `
    _______
---'   ____)____
          ______)
          _______)
         _______)
---.__________)
`,
  scissors: `
    _______
---'   ____)____
          ______)
       __________)
      (____)
---.__(___)
`
};

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'tie' | null;

function App() {
  const [userChoice, setUserChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<GameResult>(null);
  const [score, setScore] = useState({ user: 0, computer: 0, ties: 0 });
  const [gameHistory, setGameHistory] = useState<Array<{ userChoice: Choice, computerChoice: Choice, result: GameResult }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
  };

  const determineWinner = (user: Choice, computer: Choice): GameResult => {
    if (user === computer) return 'tie';
    
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) {
      return 'win';
    }
    
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setUserChoice(choice);
    setComputerChoice(null);
    setResult(null);
    
    // Simulate computer "thinking"
    setTimeout(() => {
      const computerSelection = getComputerChoice();
      setComputerChoice(computerSelection);
      
      const gameResult = determineWinner(choice, computerSelection);
      setResult(gameResult);
      
      // Update score
      setScore(prevScore => {
        const newScore = { ...prevScore };
        if (gameResult === 'win') newScore.user += 1;
        else if (gameResult === 'lose') newScore.computer += 1;
        else newScore.ties += 1;
        return newScore;
      });
      
      // Add to history
      setGameHistory(prevHistory => [
        { userChoice: choice, computerChoice: computerSelection, result: gameResult },
        ...prevHistory.slice(0, 9) // Keep only the last 10 games
      ]);
      
      setIsAnimating(false);
    }, 1000);
  };

  const resetGame = () => {
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
  };

  const resetScore = () => {
    setScore({ user: 0, computer: 0, ties: 0 });
    setGameHistory([]);
    resetGame();
  };

  const getChoiceIcon = (choice: Choice | null) => {
    if (!choice) return null;
    
    switch (choice) {
      case 'rock':
        return <CircleOff className="w-12 h-12" />;
      case 'paper':
        return <FileText className="w-12 h-12" />;
      case 'scissors':
        return <Scissors className="w-12 h-12" />;
      default:
        return null;
    }
  };

  const getResultMessage = () => {
    if (!result) return '';
    
    switch (result) {
      case 'win':
        return 'You win!';
      case 'lose':
        return 'You lose!';
      case 'tie':
        return "It's a tie!";
      default:
        return '';
    }
  };

  const getResultClass = () => {
    if (!result) return '';
    
    switch (result) {
      case 'win':
        return 'text-green-600';
      case 'lose':
        return 'text-red-600';
      case 'tie':
        return 'text-yellow-600';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Rock Paper Scissors</h1>
          <p className="text-xl text-blue-200">Choose your weapon!</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Game</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={resetGame} 
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  New Game
                </button>
                <button 
                  onClick={resetScore} 
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Reset Score
                </button>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mb-8">
              <div className="text-center">
                <p className="text-lg mb-2">You</p>
                <div className="bg-gray-700 rounded-lg p-4 h-32 w-32 flex items-center justify-center">
                  {userChoice ? (
                    getChoiceIcon(userChoice)
                  ) : (
                    <p className="text-gray-400">Choose</p>
                  )}
                </div>
              </div>
              
              <div className="text-center flex items-center">
                <p className="text-2xl font-bold">VS</p>
              </div>
              
              <div className="text-center">
                <p className="text-lg mb-2">Computer</p>
                <div className="bg-gray-700 rounded-lg p-4 h-32 w-32 flex items-center justify-center">
                  {isAnimating && !computerChoice ? (
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                  ) : computerChoice ? (
                    getChoiceIcon(computerChoice)
                  ) : (
                    <p className="text-gray-400">Waiting</p>
                  )}
                </div>
              </div>
            </div>

            {result && (
              <div className="text-center mb-8">
                <h3 className={`text-3xl font-bold ${getResultClass()}`}>
                  {getResultMessage()}
                </h3>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              {choices.map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleChoice(choice)}
                  disabled={isAnimating}
                  className={`
                    p-4 rounded-lg transition-all transform hover:scale-105
                    ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}
                    ${choice === 'rock' ? 'bg-red-600 hover:bg-red-700' : ''}
                    ${choice === 'paper' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                    ${choice === 'scissors' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                  `}
                >
                  <div className="flex flex-col items-center">
                    {getChoiceIcon(choice)}
                    <span className="mt-2 capitalize">{choice}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Score</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-300">You</p>
                  <p className="text-2xl font-bold text-green-500">{score.user}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Ties</p>
                  <p className="text-2xl font-bold text-yellow-500">{score.ties}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Computer</p>
                  <p className="text-2xl font-bold text-red-500">{score.computer}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Game History</h2>
            
            {gameHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No games played yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gameHistory.map((game, index) => (
                  <div key={index} className="bg-gray-700 rounded p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">#{gameHistory.length - index}</span>
                      <div className="flex items-center">
                        {getChoiceIcon(game.userChoice)}
                        <span className="ml-1 capitalize text-sm">{game.userChoice}</span>
                      </div>
                      <span>vs</span>
                      <div className="flex items-center">
                        {getChoiceIcon(game.computerChoice)}
                        <span className="ml-1 capitalize text-sm">{game.computerChoice}</span>
                      </div>
                    </div>
                    <div className={`
                      px-2 py-1 rounded text-xs font-semibold
                      ${game.result === 'win' ? 'bg-green-900 text-green-300' : ''}
                      ${game.result === 'lose' ? 'bg-red-900 text-red-300' : ''}
                      ${game.result === 'tie' ? 'bg-yellow-900 text-yellow-300' : ''}
                    `}>
                      {game.result === 'win' ? 'Win' : game.result === 'lose' ? 'Loss' : 'Tie'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Game Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-center mb-3">
                <CircleOff className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Rock</h3>
              <p className="text-sm text-gray-300">Rock crushes scissors but is covered by paper.</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-center mb-3">
                <FileText className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Paper</h3>
              <p className="text-sm text-gray-300">Paper covers rock but is cut by scissors.</p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex justify-center mb-3">
                <Scissors className="w-10 h-10 text-yellow-500" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Scissors</h3>
              <p className="text-sm text-gray-300">Scissors cut paper but are crushed by rock.</p>
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-400 text-sm">
          <p>© 2025 Rock Paper Scissors Game. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;