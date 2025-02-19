'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validation = solver.validate(puzzle);
      if (validation.error) {
      return res.json(validation);
      }

      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const result = solver.checkPlacement(puzzle, coordinate, value);
      return res.json(result);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;

      if (!puzzleString) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzleString);
      if (validation.error) {
        return res.json(validation);
      }

      const solution = solver.solve(puzzleString);
      if (solution.error) {
        return res.json(solution);
      }
      return res.json({ solution: solution });
    });
};
