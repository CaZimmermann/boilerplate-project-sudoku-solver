const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');


suite('Unit Tests', () => {
    let solver = new Solver();

    test('Logic handles a valid puzzle string of 81 characters', () => {
        const puzzle = '.'.repeat(81);
        const validation = solver.validate(puzzle);
        assert.deepEqual(validation, {valid: true });
    });
    
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const puzzle = 'a'.repeat(81);
        const validation = solver.validate(puzzle);
        assert.deepEqual(validation, { error: 'Invalid characters in puzzle' });
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const puzzle = '.'.repeat(82);
        const validation = solver.validate(puzzle);
        assert.deepEqual(validation, { error: 'Expected puzzle to be 81 characters long' });
    });

    test('Logic handles a valid row placement', () => {
        const puzzle = '.'.repeat(81);
        const row = 1;
        const column = 5;
        const value = '5';
        const validation = solver.checkRowPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, true);
    });

    test('Logic handles an invalid row placement', () => {
        const puzzle = '.5.......'.repeat(9);
        const row = 1;
        const column = 5;
        const value = '5';
        const validation = solver.checkRowPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, false);
    });

    test('Logic handles a valid column placement', () => {
        const puzzle = '.2.......'.repeat(9);
        const row = 1;
        const column = 5;
        const value = '5';
        const validation = solver.checkColPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, true);
    });

    test('Logic handles a invalid column placement', () => {
        const puzzle = '2.........2.........2.........2.........2.........2.........2.........2.........2';
        const row = 1;
        const column = 3;
        const value = '2';
        const validation = solver.checkColPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, false);
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        const puzzle = '.2.......'.repeat(9);
        const row = 1;
        const column = 3;
        const value = '1';
        const validation = solver.checkRegionPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, true);
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        const puzzle = '.2.......'.repeat(9);
        const row = 1;
        const column = 3;
        const value = '2';
        const validation = solver.checkRegionPlacement(puzzle, row, column, value);
        assert.deepEqual(validation, false);
    });

    test('Valid puzzle strings pass the solver', () => {
        const puzzleString = "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
        const validation = solver.solve(puzzleString);
        assert.equal(validation.length, 81);
        assert.match(validation, /^[1-9\.]{81}$/);
    });

    test('Invalid puzzle strings pass the solver', () => {
        const puzzleString = "82...4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
        const validation = solver.solve(puzzleString);
        assert.deepEqual(validation, { error: 'Puzzle cannot be solved' });
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const puzzleString = "82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51";
        const validation = solver.solve(puzzleString);
        assert.deepEqual(validation, "827549163531672894649831527496157382218396475753284916962415738185763249374928651");
    });

});
