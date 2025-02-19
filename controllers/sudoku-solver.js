class SudokuSolver {

  validate(puzzleString) {
    if ( puzzleString.length !== 81 ) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }

    if (/[^1-9.]/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const startIdx = (row - 1) * 9;
    const endIdx = startIdx + 9;
    const rowCells = puzzleString.slice(startIdx, endIdx);
    if (rowCells.includes(value)) {
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colIdx = column - 1; 
    let colCells = '';
    for (let i = colIdx; i < puzzleString.length; i += 9) {
    colCells += puzzleString[i];
    }
   if (colCells.includes(value)) {
    return false; 
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionStartRow = Math.floor((row - 1) / 3) * 3; 
    const regionStartCol = Math.floor((column - 1) / 3) * 3; 
    let regionCells = '';
    for (let r = regionStartRow; r < regionStartRow + 3; r++) {
    for (let c = regionStartCol; c < regionStartCol + 3; c++) {
      const idx = r * 9 + c; 
      regionCells += puzzleString[idx];
    }
    }
    if (regionCells.includes(value)) {
    return false; 
    }
    return true;
  }

  checkPlacement(puzzleString, coordinate, value) {
    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65; 
    const col = parseInt(coordinate[1], 10) - 1; 
    const index = row * 9 + col;

    if (puzzleString[index] === value) {
        return { valid: true };
    }

    let conflicts = [];

    if (!this.checkRowPlacement(puzzleString, row + 1, col + 1, value)) conflicts.push("row");
    if (!this.checkColPlacement(puzzleString, row + 1, col + 1, value)) conflicts.push("column");
    if (!this.checkRegionPlacement(puzzleString, row + 1, col + 1, value)) conflicts.push("region");

    return conflicts.length === 0 ? { valid: true } : { valid: false, conflict: conflicts };
}


  solve(puzzleString) {
    let puzzle = puzzleString.split('');
    
    function findEmptyCell() {
      for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] === '.') {
          return i;
        }
      }
      return -1;
    }
    const backtrack = () => {
      const emptyIndex = findEmptyCell();
      if (emptyIndex === -1) return true;

      const row = Math.floor(emptyIndex / 9) + 1;
      const col = (emptyIndex % 9) + 1;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();

        if (
           this.checkRowPlacement(puzzle.join(''), row, col, value) &&  
           this.checkColPlacement(puzzle.join(''), row, col, value) &&
           this.checkRegionPlacement(puzzle.join(''), row, col, value)
        ) {

          puzzle[emptyIndex] = value;
          if (backtrack()) {
            return true; 
          }

          puzzle[emptyIndex] = '.';
      }
    }

    return false;
    }
    const solved = backtrack();


    if (solved) {
      return puzzle.join('');
    } else {
      return { error: 'Puzzle cannot be solved' };
    }
  }
}

module.exports = SudokuSolver;

