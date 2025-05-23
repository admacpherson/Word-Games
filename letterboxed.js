// Define game board
let topSide = ['W', 'M', 'Y'];
let leftSide = ['S', 'L', 'R'];
let bottomSide = ['H', 'N', 'D'];
let rightSide = ['T', 'O', 'I'];
const square = [topSide, leftSide, bottomSide, rightSide];
const square_order = ["Top", "Left", "Bottom", "Right"];

// Define player words
let currentWord = [];
let wordsStored = [];

// Game board in HTML
const board = document.getElementById("game-board");

// Create 1D array of all possible letters
const letterMap = square.flat();

//Placeholder array for letter <div> elements
const letterDivs = [];

// 3 x 3 grid
const positions = [
    [0, 0], [0, 1], [0, 2],
    [1, 0],         [1, 2],
    [2, 0], [2, 1], [2, 2]
];

// Create a <div> element for each letter
function createLetterDiv(pos, index) {
    const div = document.createElement('div');
    div.className = "letter";
    // Set position
    div.style.gridRow = pos[0] + 1;
    div.style.gridColumn = pos[1] + 1;
    // Display letter
    div.innerText = letterMap[index];
    // Add to board
    board.appendChild(div);
    letterDivs.push(div);
}

// Update displayed word at the top of the page
function updateCurrentWord() {
    document.getElementById('word-banner').innerText = "Current Word: " + currentWord.join('');
}

// Add listener for user input
document.addEventListener('keydown', (event) => {
    // Standardize letters
    const letter = event.key.toUpperCase();
    // Check if input is a letter using Regex 
    if(/^[A-Z]$/.test(letter)) {
        currentWord.push(letter);
    // Input is backspace
    } else if (event.key === 'Backspace') {
        currentWord.pop();
    }
    // Update displayed word at the top
    updateCurrentWord();
})

// Determine if a word is valid
async function isValidWord(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return response.ok; // true if found
}

// Find which side (0-3) a letter is on
function FindSide(letter) {
    // Iterate through each side
    for(let i = 0; i < square.length; i++) {
        // Find the index of the letter (-1 if not found)
        const letterIndex = square[i].findIndex(l => l === letter);
        // Return the index after a match
        if (letterIndex !== -1) {
            return i;
        }
    }
}

// Given the current letter, determine what is allowed to come next
function ValidNextLetters(letter) {
    // Find current side
    currentSide = FindSide(letter);
    // Create shallow copy of square
    valid_letters = square.slice();
    // Remove letters from current side
    valid_letters.splice(currentSide, 1);
    // Flatten into 1D array
    valid_letters = valid_letters.flat();
    // Return
    return valid_letters;
}

// Check if the next letter in a word is valid
function NextLetterIsValid(currentLetter, nextLetter) {
    let validNextLetters = ValidNextLetters(currentLetter);
    if (validNextLetters.findIndex(l => l === nextLetter) !== -1) {
        return true;
    } else return false;
}


// Create divs for each letter
positions.forEach(createLetterDiv);

// Word lookup
isValidWord("apple").then(valid => console.log("Valid word:", valid));

// Find side
console.log("Side: ", FindSide('I'));

// Get valid next letters
console.log("Valid Next Letters: ", ValidNextLetters('I'));

// Determine if next letter is valid
console.log("Next letter is valid: ", NextLetterIsValid('I', 'W'));
console.log("Next letter is valid: ", NextLetterIsValid('I', 'J'));