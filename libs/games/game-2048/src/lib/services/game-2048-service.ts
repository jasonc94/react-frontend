export function initializeBoard() {
  const board = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));
  return addTile(board);
}

export function addTile(board: number[][]) {
  const emptyCells: { row: number; col: number }[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 0) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  board[row][col] = Math.random() > 0.8 ? 4 : 2;
  return [...board];
}
