// Puzzle data
const rows = 8;
const cols = 6;

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

const grid = document.getElementById("grid");

function createCell(letter, index) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = letter;
    cell.dataset.index = index;
    return cell
}

letters.forEach((letter, i) => {
    grid.appendChild(createCell(letter, i));
})