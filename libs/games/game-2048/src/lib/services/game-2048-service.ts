export function initializeBoard() {
  const board = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));
  return addTile(addTile(board));
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

  if (emptyCells.length === 0) {
    return board;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];

  board[row][col] = Math.random() > 0.8 ? 4 : 2;
  return [...board];
}

export function move(
  board: number[][],
  direction: 'up' | 'down' | 'left' | 'right'
) {
  let newBoard = board.map((row) => [...row]);

  const mergeRow = (row: number[]) => {
    // remove 0s from the row. [2, 2, 0, 4] => [2, 2, 4]
    row = row.filter((cell) => cell !== 0);
    // merge adjacent cells [2, 2, 4] => [4, 0, 4]
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }
    // remove new 0s from and fill 0s to maintin length of 4
    return row
      .filter((cell) => cell !== 0)
      .concat(Array(4).fill(0))
      .slice(0, 4);
  };

  if (direction === 'left') {
    newBoard = newBoard.map((row) => mergeRow(row));
  } else if (direction === 'right') {
    newBoard = newBoard.map((row) => mergeRow(row.reverse()).reverse());
  } else if (direction === 'up' || direction === 'down') {
    for (let col = 0; col < 4; col++) {
      let column = newBoard.map((row) => row[col]);
      column =
        direction === 'up'
          ? mergeRow(column)
          : mergeRow(column.reverse()).reverse();
      newBoard.forEach((row, rowIndex) => (row[col] = column[rowIndex]));
    }
  }

  return addTile(newBoard);
}
