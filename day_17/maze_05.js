'use strict';

// A maze is a two dimensional array of cells.
// Each cell describes which passage is possible.
// Each passage direction is encoded by a numeric value.
//  passage directions:

const TOP    = 1;
const BOTTOM = 2;
const RIGHT  = 4;
const LEFT   = 8;

//  combination examples, these ways are possible ('|' is bitwise or):
//
//    14 == BOTTOM | RIGHT | LEFT
//    12 == RIGHT | LEFT
//     7 == TOP | BOTTOM | RIGHT

// print '   ' if cell has no top wall, else print ' __'
function printTop(cell) {
    process.stdout.write(cell & TOP ? '   ' : ' __');
}

// print '|' if cell has left wall and '__' if it has a bottom wall
function printLeftBottom(cell) {
    process.stdout.write(cell & LEFT ? ' ' : '|');
    process.stdout.write(cell & BOTTOM ? '  ' : '__');
}

// print '|' if cell has right wall, else print ' '
function printRight(cell) {
    process.stdout.write(cell & RIGHT ? ' ' : '|');
}

// print maze described by passages on console
function printMaze(s) {
    // print top walls of top row
    for (let j = 0; j < s[0].length; j++) {
        printTop(s[0][j]);
    }
    process.stdout.write("\n"); // print new line

    // iterate over each row
    for (let i = 0; i < s.length; i++ ) {
        // print left and bottom wall for each cell of current row
        for (let j = 0; j < s[i].length; j++) {
            printLeftBottom(s[i][j]);
        }

        // print right wall for last cell of row
        printRight(s[i][s[i].length - 1]);
        process.stdout.write("\n"); // print new line
    }
}

// initialize maze with walls at every cell
function initializeMaze(rows, columns) {
    let s = [];
    for (let z = 0; z < rows; z++) {
        let t = [];
        for (let x = 0; x < columns; x++) {
            t.push(0);
        }
        s.push(t);
    }
    return s;
}

// starting with cell s[i][j] carve a passage to s[i + 1][j] if possible
function carveBottom(s, i, j) {
    if (i + 1 < (s.length)) {
        s[i][j] = s[i][j] + BOTTOM;
        s[i+1][j] = s[i+1][j] + TOP;
    }
}

// starting with cell s[i][j] carve a passage to s[i][j + 1] if possible
function carveRight(s, i, j) {
    if (j + 1 < s[i].length) {
        s[i][j] = s[i][j] + RIGHT;
        s[i][j+1] = s[i][j+1] + LEFT;
    }
}


// create maze by randomly carving passages for each cell
function createBinaryTreeMaze(rows, columns) {
    let s = initializeMaze(rows, columns);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let randomized  = Math.floor(Math.random() + 0.5);
            if (randomized === 1) {
                carveBottom(s, i, j);
            } else {
                carveRight(s, i, j);
            }
        }
    }
    return s;
}

// check if for the cells in *s* the row *i* and column *j* are valid values
function notValid(s, i, j) {
    return !(i >= 0 && i < s.length && j >= 0 && j < s[i].length);
}

// starting with cell s[i][j] carve a passage to s[i + 1][j] if possible and
// if s[i + 1][j] has still all walls
// returns array of new coordinates
function goBottomAndCarveIfSolid(s, i, j) {
    if (notValid(s, i + 1, j)) return [i, j];
    // TODO carve if still solid ..
    return [i + 1, j];
}

// starting with cell s[i][j] carve a passage to s[i - 1][j] if possible and
// if s[i - 1][j] has still all walls
// returns array of new coordinates
function goTopAndCarveIfSolid(s, i, j) {
    if (notValid(s, i - 1, j)) return [i, j];
    // TODO carve if still solid ..
    return [i - 1, j];
}

// starting with cell s[i][j] carve a passage to s[i][j + 1] if possible and
// if s[i][j + 1] has still all walls
// returns array of new coordinates
function goRightAndCarveIfSolid(s, i, j) {
    if (notValid(s, i, j + 1)) return [i, j];
    // TODO carve if still solid ..
    return [i, j + 1];
}

// starting with cell s[i][j] carve a passage to s[i][j - 1] if possible and
// if s[i][j - 1] has still all walls
// returns array of new coordinates
function goLeftAndCarveIfSolid(s, i, j) {
    if (notValid(s, i, j - 1)) return [i, j];
    // TODO carve if still solid ..
    return [i, j - 1];
}

// create maze by randomly carving passages for each cell a là Aldous Broder
// In a nutshell the original algorithm works like this:
//  Starting at an arbitrary location in the grid, move randomly from cell to cell.
//  If moving to a previously unvisited cell, carve a passage to it. End when all
//  cells have been visited.
function createAldousBroderMaze(rows, columns) {
    let s = initializeMaze(rows, columns);
    let i = 0; // current row
    let j = 0; // current column
    for (let n = 0; n < 1000; n++) {
        // TODO randomly choose a value from {0, 1, 2, 3}
        let choice = 0;
        switch (choice) {
            case 0:
                [i, j] = goBottomAndCarveIfSolid(s, i, j);
                break;
            case 1:
                [i, j] = goTopAndCarveIfSolid(s, i, j);
                break;
            case 2:
                [i, j] = goRightAndCarveIfSolid(s, i, j);
                break;
            case 3:
                [i, j] = goLeftAndCarveIfSolid(s, i, j);
                break;
        }
    }
    return s;
}

let maze = createBinaryTreeMaze(10, 10);
printMaze(maze);


maze = createAldousBroderMaze(10, 40);
printMaze(maze);
