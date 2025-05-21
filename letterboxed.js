// Define game board
var topSide = ['W', 'M', 'Y'];
var leftSide = ['S', 'L', 'R'];
var bottomSide = ['H', 'N', 'D'];
var rightSide = ['T', 'O', 'I'];
const square = [topSide, leftSide, bottomSide, rightSide];
const square_order = ["Top", "Left", "Bottom", "Right"];


//Determine if a word is valid
async function isValidWord(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return response.ok; // true if found
}

function FindSide(letter) {
    // Iterate through each side
    for(let i = 0; i < square.length; i++) {
        const letterIndex = square[i].findIndex(l => l === letter);
        if (letterIndex !== -1) {
            return letterIndex;
        }
    }
}


// Usage:
isValidWord("apple").then(valid => console.log(valid)); // true

console.log(FindSide('I'));