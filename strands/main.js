/******************
**SETUP/VARIABLES**
*******************/

// Set grid size
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
//const validWords = ['APPLE', 'GRAPE', 'PEAR', 'MANGO'];
const validWords = [
  "APPLE",     // 5
  "GRAPE",     // 5
  "PEAR",      // 4
  "MANGO",     // 5
  "PLUM",      // 4
  "BERRY",     // 5
  "GUAVA",     // 5
  "LEMON",     // 5
  "OLIVE",     // 5
  "FIGS"       // 4
]; // Total = 48 letters


// Grid div element
const gridHTML = document.getElementById("grid");

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

/**************
**CREATE GRID**
***************/

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
            gridHTML.appendChild(createCell(letter, row, col));
        }
    }
}

// Create an empty row x cols 2D array
function createEmptyGrid(rows, cols) {
    return Array.from({ length: rows }, () => 
        Array.from({ length: cols}, () => null)
    );
}

// Shuffle letters in-place using Fisher-Yates algorithm
function shuffle(array) {
    // Start at the end of the array and work backwards
    for (let i = array.length -1; i > 0; i--) {
        // Get a random position (j) between 0 and i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the element at i with the element at j
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Get the neighbors of a given cell
function getNeighbors(row, col, grid) {
    // Initialize blank array
    const neighbors = [];
    // Check all 8 directions around the cell using delta row/col
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            // Skip the actual cell
            if (dr === 0 && dc === 0) continue;
            //Next position to move onto
            const newRow = row + dr;
            const newCol = col + dc;
            // Push to neighbors if a valid cell is null
            if(
                newRow >= 0 && newRow < grid.length &&
                newCol >= 0 && newCol < grid[0].length &&
                grid[newRow][newCol] === null
            ) {
                neighbors.push([newRow, newCol]);
            }
        }
    }
    return neighbors
}

// Use DFS search with backtracking at the word level
function dfsPlaceWord(grid, word, row, col, index, path) {
    // Stop once word is placed
    if (index === word.length) return true;
    
    // Get available neighbors
    const neighbors = getNeighbors(row, col, grid);
    
    // Iterate through each neighbor
    for (const [r, c] of neighbors) {
        // Check if neighboring cell is empty
        if (grid[r][c] === null) {
            // Fill in the next letter and store the path
            grid[r][c] = word[index];
            path.push([r, c]);
            
            //Recursively try to place the rest of the word
            if (dfsPlaceWord(grid, word, r, c, index + 1, path)) return true;
            
            //Backtrack if recursive call fails by undoing placement and removing path
            grid[r][c] = null;
            path.pop();
        }
    }
    // Return false is unable to place word
    return false;
}

function placeWord(grid, word) {
    //Create a 2D positions array
    const positions = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            positions.push([r, c]);
        }
    }
    // Shuffle positions
    shuffle(positions);
    
    // Iterate through shuffled positions
    for (const [r, c] of positions) {
        // If a cell is available, start placing the word
        if(grid[r][c] === null) {
            // Place the first letter
            grid[r][c] = word[0];
            // Store the first cell in the path
            const path = [[r, c]];
            // Recusrively place the rest of the cells
            if (dfsPlaceWord(grid, word, r, c, 1, path)) return true;
            
            // If unable to place word, undo placement and move on
            grid[r][c] = null;
        }
    }
    // Return false if unable to place word
    return false;
}

function placeAllWords(grid, words) {
    // Iterate through words
    for (const word of words) {
        if (!placeWord(grid, word)) {
            console.error(`Could not place word: ${word}`);
            return false;
        }
    }
    return true;
}

createGrid();
resetSelection();
updateBannerText("Test");
const grid = createEmptyGrid(numRows, numCols);
placeAllWords(grid, validWords);


/*******************
**HELPER FUNCTIONS**
********************/

// Helper function to get index
function getCellByIndex(i) {
    return grid.querySelector(`".cell[data-row="${row}"][data-col="${col}"]"`);
}

// Helper function to check if cells are adjacent
function isAdjacent(cell1, cell2) {
    // Get row/col coordinates
    const row1 = cell1.dataset.row;
    const col1 = cell1.dataset.col;
    const row2 = cell2.dataset.row;
    const col2 = cell2.dataset.col;
    
    // Get distance in rows and columns
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    
    const isAdjacent = (rowDiff <= 1 && colDiff <= 1) && !(rowDiff === 0 && colDiff === 0);
    
    return isAdjacent;
}

/*********************
**GAMEPLAY FUNCTIONS**
**********************/

// Mark a cell/letter as selected
function selectCell(cell) {
    //Ensure it is not already selected
    if (selectedCells.includes(cell)) {
        return
    }
    
    // Only check adjacency if not the first selection
    if (selectedCells.length > 0) {
        const lastCell = selectedCells[selectedCells.length - 1];
        // Ignore non-adjacent selections
        if (!isAdjacent(lastCell, cell)) return;
    }
    
    cell.classList.add("selected");
    selectedCells.push(cell);
    drawLinesBetweenCells(selectedCells);
}

// Reset current selection of cells/letters
function resetSelection() {
    // De-select all incorrect cells
    selectedCells.forEach( cell => {
        if (!cell.classList.contains("confirmed")) {
            cell.classList.remove("selected");
        }
    });
    
    // Remove lines between all incorrect cells
    const svg = document.getElementById("line-layer");
    Array.from(svg.children).forEach(line => {
        if (!line.classList.contains("confirmed-line")) {
            svg.removeChild(line);
        }
    });
    
    // Reset selection variables
    selectedCells = [];
    selectedWord = "";
}

// Update the text in the top banner
function updateBannerText(message) {
    document.getElementById("message").innerText = message;
}

// Handle guesses to check for correct words
function handleGuess() {
    //Join all selected cells into an overall word
    selectedWord = selectedCells.map(cell => cell.textContent).join('');
    //Check if correct
    if (validWords.includes(selectedWord)) {
        // Display banner text
        updateBannerText("Correct");
        
        // Mark correct word cells permanently
        selectedCells.forEach(cell => {
            cell.classList.add("confirmed");
            drawLinesBetweenCells(selectedCells, true)
        })
    } else {
        // Display banner text
        updateBannerText("Incorrect");
    }
    resetSelection();
}

// Draw lines between cells
function drawLinesBetweenCells(cells, permanent = false) {
    // Get line layer and coordinates as JS element
    const svg = document.getElementById("line-layer");
    const svgRect = svg.getBoundingClientRect();
    
    for (let i = 0; i < cells.length - 1; i++) {
        // Get cooridnates of origin and destination cells
        const origin = cells[i].getBoundingClientRect();
        const dest = cells[i+1].getBoundingClientRect();
        
        // Calculate centers
        const x1 = origin.left + origin.width / 2 - svgRect.left;
        const y1 = origin.top + origin.height / 2 - svgRect.top;
        const x2 = dest.left + dest.width / 2 - svgRect.left;
        const y2 = dest.top + dest.height / 2 - svgRect.top;
        
        // SVG namespace
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        // Translate to SVG layer coordinates
        line.setAttribute("x1", x1 - svgRect.left);
        line.setAttribute("x2", x2 - svgRect.left);
        line.setAttribute("y1", y1 - svgRect.top);
        line.setAttribute("y2", y2 - svgRect.top);
        
        if (permanent) {
            line.classList.add("confirmed-line");
        }
        
        // Add to SVG layer
        svg.appendChild(line);
    }
}

/*****************
**INPUT HANDLERS**
******************/

// Pointer down event listener
gridHTML.addEventListener("pointerdown", (e) => {
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
gridHTML.addEventListener("pointermove", (e) => {
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
gridHTML.addEventListener("pointerup", () => {
    isDragging = false;
    // Only finalize guess if they are done dragging (ignore clicks)
    if (hasDragged) {
        handleGuess();
    }
    
    // Indicate that the user is no longer holding down
    hasDragged = false;
});

gridHTML.addEventListener("click", (e) => {
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
});