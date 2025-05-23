// Define game board
let topSide = ['W', 'M', 'Y'];
let rightSide = ['T', 'O', 'I'];
let bottomSide = ['H', 'N', 'D'];
let leftSide = ['S', 'L', 'R'];
const square = [topSide, rightSide, bottomSide, leftSide];
const square_order = ["Top", "Right", "Bottom", "Left"];

// Define player words
let currentWord = [];
let wordsStored = [];

// Game board in HTML
const board = document.getElementById("game-board");

// Create 1D array of all possible letters
const letterMap = square.flat();

//Placeholder array for letter <div> elements
const letterDivs = [];

// 5 x 5 grid with empty corners
const positions = [
  // Top row (W M Y)
  [1, 2], [1, 3], [1, 4],
  // Right column (T O I)
  [2, 5], [3, 5], [4, 5],
  // Bottom row (D N H — reversed)
  [5, 4], [5, 3], [5, 2],
  // Left column (R L S — reversed)
  [4, 1], [3, 1], [2, 1],
];

// Create divs for each letter
positions.forEach(createLetterDiv);

// Create a <div> element for each letter
function createLetterDiv(pos, index) {
    const div = document.createElement('div');
    div.className = "letter";
    // Set position
    div.style.gridRow = pos[0];
    div.style.gridColumn = pos[1];
    // Display letter
    const letter = letterMap[index]
    div.innerText = letter;
    
    // Use data attribute to set metadata attribute
    const sideIndex = FindSide(letter);
    const sideName = square_order[sideIndex];
    div.setAttribute('data-side', sideName);
    
    // Create a dot on the inner border
    const dot = document.createElement('div');
    dot.className = 'dot';
    div.appendChild(dot);
    
    // Add to board
    board.appendChild(div);
    letterDivs.push(div);
}

// Update displayed word at the top of the page
function updateCurrentWord() {
    // Update current word display
    document.getElementById('word-banner').innerText = currentWord.join('');
    // Updated stored word display
    document.getElementById('stored-words').innerText = wordsStored.join(' - ');
    
}

// Gets previous letter in the word
function getPreviousLetter() {
    let previousLetter = '';
    // Get current letter to determine if next letter is valid
    if (currentWord.length > 0) {
        // Get last letter
        previousLetter = currentWord[currentWord.length-1];
    } else if (wordsStored.length > 0) {
        lastWord = wordsStored.length - 1;
        previousLetter = wordsStored[lastWord][lastWord.length-1];
    }
    return previousLetter;
}


// Determine if a word is valid
async function isValidWord(word) {
    console.log(word);
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.ok) {
        return true;
    } else return false;
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
function ValidNextLetters(currentLetter) {
    // Create shallow copy of square
    let valid_letters = square.slice();
    // If no letters have been entered yet
    if (currentLetter === '') {
        valid_letters = valid_letters.flat();
    } else {
        // Find current side
        let currentSide = FindSide(currentLetter);
        // Remove letters from current side
        valid_letters.splice(currentSide, 1);
        // Flatten into 1D array
        valid_letters = valid_letters.flat();
    }
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

// Grays out used letters
function grayLetters(letter, addgray) {
    letterDivs.forEach((div) => {
        // If the letter matches the current <div>
        if (div.innerText === letter) {
            // Mark the letter as used
            if (addgray) {
                div.classList.add('used');
            // Remove the gray if the letter hasn't been used previously
            } else {
                // Check how many times the letter is used in the current word
                const countInCurrent = currentWord.filter(l => l === letter).length;
                //Check how many times the letter is used in stored words using .reduce (initial value is 0)
                const countInStored = wordsStored.reduce((count, word) => {
                    return count + [...word].filter(l => l === letter).length
                }, 0)
                
                // Get total count of used letters
                const totalCount = countInCurrent + countInStored;
                
                // Only gray out letters not used anywhere
                if (totalCount === 0) {
                    letterDivs.forEach((div) => {
                        if (div.innerText === letter) {
                            div.classList.remove('used');
                        }
                    });
                }
            }
        }
    });
}

// Add listener for user input
document.addEventListener('keydown', async (event) => {
    // Standardize letters
    const letter = event.key.toUpperCase();
    // Get previous letter
    const previousLetter = getPreviousLetter();
    
    // Check if input is a letter using Regex 
    if (/^[A-Z]$/.test(letter)) {
        if (NextLetterIsValid(previousLetter, letter)) {
            grayLetters(letter, true);
            
            // Get div of input letter and previous letter
            const currentDiv = letterDivs.find(div => div.innerText === letter);
            const prevDiv = letterDivs.find(div => div.innerText === previousLetter);
            //Draw line
            if (prevDiv && currentDiv) {
                //Get dot child for each letter div
                const prevDot = prevDiv.querySelector('.dot');
                const currDot = currentDiv.querySelector('.dot');
                if(prevDot && currDot) {
                    drawLineBetweenDots(prevDot, currDot);
                }
            }
            
            currentWord.push(letter);
        } 
    // Input is backspace
    } else if (event.key === 'Backspace') {
        // Don't allow user to remove first letter of adjacent word
        if (wordsStored.length === 0 || currentWord.length > 1) {
            console.log(currentWord);
            const removedLetter = currentWord.pop();
            grayLetters(removedLetter, false);
        // Backspace into last word
        } else if (wordsStored.length > 0 && currentWord.length === 1) {
            const lastWord = wordsStored.pop();
            console.log(lastWord);
            currentWord = lastWord.split('');
            const removedLetter = currentWord.pop();
            grayLetters(removedLetter, false);
            console.log(currentWord);
        }
        
    // Input is enter
    } else if (event.key === 'Enter') {
        // Min word length of 3
        if (currentWord.length > 0 && currentWord.length < 3) {
            console.log("Too short");
        // If at least 3 letters are entered
        } else if (currentWord.length >= 3) {
            //Convert array into a string
            const finishedWord = currentWord.join('');
            // Validate word
            const isValid = await isValidWord(finishedWord);
            if (isValid) {
                // Store finished word
                wordsStored.push(finishedWord);
                console.log("Word stored: ", finishedWord);
                // Start next word with last letter
                currentWord = [finishedWord.slice(-1)]
                // Update display after async
                updateCurrentWord();
                // gray 
                grayOutLetters(finishedWord);
                
            } else {
                console.log("Invalid word");
            }
            
        }
    }
    // Update displayed word(s) at the top
    updateCurrentWord();
})


// Draw lines between dots of selected letters
function drawLineBetweenDots(dot1, dot2) {
    //Get positions of dots relative to viewport
    const rect1 = dot1.getBoundingClientRect();
    const rect2 = dot2.getBoundingClientRect();
    
    // Get board position to offset coordinates
    const boardRect = document.getElementById('game-board').getBoundingClientRect();
    
    // Compute center coordinates of dots relative to board
    const x1 = (rect1.left + rect1.width / 2) - boardRect.left;
    const y1 = (rect1.top + rect1.height / 2) - boardRect.top;
    const x2 = (rect2.left + rect2.width / 2) - boardRect.left;
    const y2 = (rect2.top + rect2.height / 2) - boardRect.top;
    
    // Create the <line> element in SVG using W3 namespace
    const line  = document.createElementNS("http://www.w3.org/2000/svg", "line");
    
    // Set line coordinates
    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    
    // Set line stroke
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "2");

    
    // Add to SVG layer
    document.getElementById("line-layer").appendChild(line);
}