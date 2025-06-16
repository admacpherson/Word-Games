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
            const letterIndex = row * numCols + col;
            const letter = letters[letterIndex];
            grid.appendChild(createCell(letter, row, col));
        }
    }
}

// Keep track of whether user is dragging/swiping
let isDragging = false;
// Keep track of whether user has been dragging/swiping
let hasDragged = false;
let dragStartX = 0;
let dragStartY = 0;
const dragThreshold = 10;
// Store letters that have been selected
let selectedCells = [];
// Keep track of current word
let selectedWord = "";

createGrid();
resetSelection();
updateBannerText("Test");

/*******************
**HELPER FUNCTIONS**
********************/

// Helper function to get index
function getCellByIndex(i) {
    return grid.querySelector(`".cell[data-row="${row}"][data-col="${col}"]"`);
}

// Mark a cell/letter as selected
function selectCell(cell) {
    //Ensure it is not already selected
    if (selectedCells.includes(cell)) {
        return
    }
    
    cell.classList.add("selected");
    selectedCells.push(cell);
}

// Reset current selection of cells/letters
function resetSelection() {
    selectedCells.forEach(cell => cell.classList.remove("selected"));
    selectedCells = [];
    selectedWord = "";
}

// Update the text in the top banner
function updateBannerText(message) {
    document.getElementById("message").innerText = message;
}

function handleGuess() {
    //Join all selected cells into an overall word
    selectedWord = selectedCells.map(cell => cell.textContent).join('');
    //Check if correct
    if (validWords.includes(selectedWord)) {
        updateBannerText("Correct");
    } else {
        updateBannerText("Incorrect");
    }
    resetSelection();
}

/*************
**USER INPUT**
**************/

// Pointer down event listener
grid.addEventListener("pointerdown", (e) => {
    //Ignore clicks outside of the grid
   if (!e.target.classList.contains("cell")) {
       return;
   }
    // Note that the user is holding down
    isDragging = true;
    // Reset drag status
    hasDragged = false;
    
    // Keep track of dragging
    dragStartX = e.clientX;
    dragStartY = e.clientY;
});

// Pointer movement event listener
grid.addEventListener("pointermove", (e) => {
    // Ignore if the user isn't holding down or on the grid
    if (!isDragging || !e.target.classList.contains("cell")) return;
    
    // Calculate distance moved in drag
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only register drag after threshold to prevent small movements
    if (distance < dragThreshold) return;
    
    if(!selectedCells.includes(e.target) && distance >= dragThreshold) {
        //Select the cell the user moves over
        selectCell(e.target);
        // Note the user has been dragging
        hasDragged = true;
    }
});

// Pointer up event listener
grid.addEventListener("pointerup", () => {
    isDragging = false;
    // Only finalize guess if they are done dragging (ignore clicks)
    if (hasDragged) {
        handleGuess();
    }
    
    // Indicate that the user is no longer holding down
    hasDragged = false;
})

grid.addEventListener("click", (e) => {
    //Ignore clicks outside of the grid
   if (!e.target.classList.contains("cell")) {
       return;
   }
    
    // Check if the selected element is the same as the last cell selected (i.e. double tapped)
    const isLastSelected = selectedCells[selectedCells.length - 1] === e.target;
    
    // If already selected, confirm word, else add to word
    if (isLastSelected && selectedCells.includes(e.target)) {
        handleGuess();
    } else {
        selectCell(e.target);
    }
})