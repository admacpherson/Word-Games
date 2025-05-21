// Define game board
var top = ['W', 'M', 'Y'];
var left = ['S', 'L', 'R'];
var bottom = ['H', 'N', 'D'];
var right = ['T', 'O', 'I'];
const square = [top, left, bottom, right];
const square_order = ["Top", "Left", "Bottom", "Right"];

//Determine if a word is valid
async function isValidWord(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return response.ok; // true if found
}