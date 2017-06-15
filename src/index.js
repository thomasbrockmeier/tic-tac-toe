import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className='square' onClick={ props.onClick }>
      { (typeof props.value === 'string') ? props.value : '' }
    </button>
  );
}

function ResetButton(props) {
  return(
    <button className='reset' onClick={ props.onClick}>
      { 'RESET' }
    </button>
  );
}

class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: this.emptyArray(), 
    };
  }

  emptyArray() {
    return Array.apply(null, {length: 9}).map(Number.call, Number)
  }

  handleClick(i) {
    let bestMove;
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || typeof squares[i] === 'string') {
      return;
    }

    squares[i] = 'X'; 
    bestMove = minimax(squares, 'O');
    squares[bestMove.index] = 'O';

    this.setState({
      squares: squares,
    });
  }

  handleReset() {
    this.setState({
      squares: this.emptyArray(),
    });
  }

  renderSquare(i) {
    return (
      <Square
        onClick={ () => this.handleClick(i) }
        value={ this.state.squares[i] }
      />
    );
  }

  renderReset(winner) {
    if (winner) {
      return (
        <ResetButton onClick={ () => this.handleReset() } />
      );
    }
  }

  render() {
    const availableSquares = getEmptySquares(this.state.squares);
    const winner = calculateWinner(this.state.squares);
    const gameOver = availableSquares.length == 0 || winner;

    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else if (availableSquares.length === 0) {
      status = 'Draw';
    } else {
      status = ' ';
    }

    return (
      <div>
        <div className="status">{ status }</div>
        <div className="board-row">
          { this.renderSquare(0) }
          { this.renderSquare(1) }
          { this.renderSquare(2) }
        </div>
        <div className="board-row">
          { this.renderSquare(3) }
          { this.renderSquare(4) }
          { this.renderSquare(5) }
        </div>
        <div className="board-row">
          { this.renderSquare(6) }
          { this.renderSquare(7) }
          { this.renderSquare(8) }
        </div>
        <div className='reset-wrapper'>
          { this.renderReset(gameOver) }
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ========================================

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getEmptySquares(squares) {
  return squares.filter(s => s !== 'X' && s !== 'O');
}

function minimax(newSquares, playerSymbol) {
  function calculateBestMove(moves, playerSymbol) {
    let bestMove;
    let bestScore = (playerSymbol === 'X') ? 10000 : -10000;

    for (let i = 0; i < moves.length; i++) {
      if (playerSymbol === 'X' && moves[i].score < bestScore) {
        bestMove = i;
        bestScore = moves[i].score;
      } else if (playerSymbol === 'O' && moves[i].score > bestScore) {
        bestMove = i;
        bestScore = moves[i].score;
      }
    }
    return moves[bestMove];
  }

  const availableSquares = getEmptySquares(newSquares);
  const moves = [];

  if (calculateWinner(newSquares) === 'X') {        // Player wins
    return { score: -10 };
  } else if (calculateWinner(newSquares) === 'O') { // Computer wins
    return { score: 10 };
  } else if (availableSquares.length === 0) {       // Draw
    return { score: 0 };
  }

  for (let i = 0; i < availableSquares.length; i++) {
    let move = {};
    let result;

    move.index = newSquares[availableSquares[i]];

    newSquares[availableSquares[i]] = playerSymbol;     // Set square to playerSymbol

    result = (playerSymbol === 'O') ? minimax(newSquares, 'X') : minimax(newSquares, 'O');

    move.score = result.score;
    moves.push(move);

    // newSquares[availableSquares[i]] = move.index;       // Reset square
  }
  return calculateBestMove(moves, playerSymbol);
}

