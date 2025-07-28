const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const aiBtn = document.getElementById('aiBtn');

let currentPlayer = 'X';
let gameActive = true;
let vsAI = false;

const WIN_COMBINATIONS = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];


twoPlayerBtn.addEventListener('click', () => {
  vsAI = false;
  twoPlayerBtn.classList.add('active');
  aiBtn.classList.remove('active');
  restartGame();
});

aiBtn.addEventListener('click', () => {
  vsAI = true;
  aiBtn.classList.add('active');
  twoPlayerBtn.classList.remove('active');
  restartGame();
});


function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== '') return;

  makeMove(cell, currentPlayer);

  if (checkGameOver(currentPlayer)) return;

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  if (vsAI && currentPlayer === 'O' && gameActive) {
    setTimeout(() => {
      const bestMove = findBestMove();
      makeMove(cells[bestMove], 'O');
      if (checkGameOver('O')) return;
      currentPlayer = 'X';
      statusText.textContent = "Player X's Turn";
    }, 400); 
  }
}


function makeMove(cell, player) {
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
}


function checkGameOver(player) {
  if (checkWinner(player)) {
    statusText.textContent = `Player ${player} Wins!`;
    highlightWin(player);
    gameActive = false;
    return true;
  } else if (isDraw()) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return true;
  }
  return false;
}


function checkWinner(player) {
  return WIN_COMBINATIONS.some(combo =>
    combo.every(i => cells[i].textContent === player)
  );
}

function isDraw() {
  return [...cells].every(cell => cell.textContent !== '');
}


function highlightWin(player) {
  WIN_COMBINATIONS.forEach(combo => {
    if (combo.every(i => cells[i].textContent === player)) {
      combo.forEach(i => {
        cells[i].style.backgroundColor = '#d4edda'; 
      });
    }
  });
}


function restartGame() {
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
    cell.style.backgroundColor = '#fff';
  });
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = "Player X's Turn";
}


function findBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  cells.forEach((cell, index) => {
    if (cell.textContent === '') {
      cell.textContent = 'O';
      let score = minimax(0, false);
      cell.textContent = '';
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
}


function minimax(depth, isMaximizing) {
  if (checkWinner('O')) return 10 - depth;
  if (checkWinner('X')) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    cells.forEach(cell => {
      if (cell.textContent === '') {
        cell.textContent = 'O';
        let score = minimax(depth + 1, false);
        cell.textContent = '';
        maxEval = Math.max(maxEval, score);
      }
    });
    return maxEval;
  } else {
    let minEval = Infinity;
    cells.forEach(cell => {
      if (cell.textContent === '') {
        cell.textContent = 'X';
        let score = minimax(depth + 1, true);
        cell.textContent = '';
        minEval = Math.min(minEval, score);
      }
    });
    return minEval;
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);
