/**************
**CREATE GRID**
***************/

// Grid size
const numRows = 8;
const numCols = 6;

// Example 8x6 letter grid - scrambled letters including words: APPLE, GRAPE, PEAR, MANGO
const letters = [
    'A','P','P','L','E','X',
    'X','G','R','A','P','E',
    'X','X','P','E','A','R',
    'M','A','N','G','O','X',
    'X','X','X','X','X','X',
    'X','X','X','X','X','X',
    'X','X','X','X','X','X',
    'X','X','X','X','X','X',
];

// Valid words in this puzzle
const validWords = ['APPLE', 'GRAPE', 'PEAR', 'MANGO'];

// Grid div element
const grid = document.getElementById("grid");

// Create a div element with class "cell" and an index
function createCell(letter, row, col) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = letter;
    cell.dataset.row = row;
    cell.dataset.col = col;
    return cell
}

// Create a cell for each letter
function createGrid() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const letterIndex = row * col + col;
            const letter = letters[letterIndex];
            grid.appendChild(createCell(letter, row, col));
        }
    }
}

createGrid();

/*******************
**HELPER FUNCTIONS**
********************/

// Helper function to get index
function getCellByIndex(i) {
    return grid.querySelector(`".cell[data-row="${row}"][data-col="${col}"]"`);
}

/*************
**USER INPUT**
**************/