// Define game board
var topSide = ['W', 'M', 'Y'];
var leftSide = ['S', 'L', 'R'];
var bottomSide = ['H', 'N', 'D'];
var rightSide = ['T', 'O', 'I'];
const square = [topSide, leftSide, bottomSide, rightSide];
const square_order = ["Top", "Left", "Bottom", "Right"];


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
}


// Word lookup
isValidWord("apple").then(valid => console.log("Valid word:", valid));

// Find side
console.log("Side: ", FindSide('I'));

// Valid next letters
console.log("Valid Next Letters: ", ValidNextLetters('I'));