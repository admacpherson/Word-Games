// Define game board
let topSide = ['W', 'M', 'Y'];
let rightSide = ['T', 'O', 'I'];
let bottomSide = ['H', 'N', 'D'];
let leftSide = ['S', 'L', 'R'];
const square = [topSide, rightSide, bottomSide, leftSide];
const square_order = ["Top", "Right", "Bottom", "Left"];

// Define player words and lines
let currentWord = [];
let wordsStored = [];
let drawnLines = [];

// Game board in HTML
const board = document.getElementById("game-board");

// Create 1D array of all possible letters
const letterMap = square.flat();

//Placeholder array for letter <div> elements
const letterDivs = [];

// 5 x 5 grid with empty corners
const positions = [
  // Top row 
  [1, 2], [1, 3], [1, 4],
  // Right column
  [2, 5], [3, 5], [4, 5],
  // Bottom row
  [5, 2], [5, 3], [5, 4],
  // Left column
  [2, 1], [3, 1], [4, 1],
];

// Create divs for each letter
positions.forEach(createLetterDiv);

// Create a <div> element for each letter
function createLetterDiv(pos, index) {
    // Create element for each letter
    const div = document.createElement('div');
    div.className = "letter";
    
    // Set position
    div.style.gridRow = pos[0];
    div.style.gridColumn = pos[1];
    
    // Display letter
    const letter = letterMap[index]
    div.innerText = letter;
    
    // Use data attribute to set metadata attribute
    const sideIndex = findSide(letter);
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

function showBanner(bannerText) {
    // Show banner
    const banner = document.getElementById('popup-banner');
    banner.innerText = bannerText;
    banner.classList.remove('hidden');
    banner.classList.add('visible');
    
    // Hide after 2 seconds
    setTimeout(() => {
        banner.classList.remove('visible');
        banner.classList.add('hidden');
    }, 2000)
}

// Gets previous letter in the word
function getPreviousLetter() {
    let previousLetter = '';
    // Get current letter to determine if next letter is valid
    if (currentWord.length > 0) {
        // Get last letter
        previousLetter = currentWord[currentWord.length-1];
    } else if (wordsStored.length > 0) {
        const lastWord = wordsStored.length - 1;
        previousLetter = wordsStored[lastWord][lastWord.length-1];
    }
    return previousLetter;
}

// Determine if a word is valid
async function isValidWord(word) {
    // Use dictionary API
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    // If word is valid return true
    if (response.ok) {
        return true;
    } else return false;
}

// Find which side (0-3) a letter is on
function findSide(letter) {
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
function getValidNextLetters(currentLetter) {
    // Create shallow copy of square
    let valid_letters = square.slice();
    
    // If no letters have been entered yet
    if (currentLetter === '') {
        valid_letters = valid_letters.flat();
    } else {
        // Find current side
        let currentSide = findSide(currentLetter);
        
        // Remove letters from current side
        valid_letters.splice(currentSide, 1);
        
        // Flatten into 1D array
        valid_letters = valid_letters.flat();
    }
    // Return
    return valid_letters;
}

// Check if the next letter in a word is valid
function nextLetterIsValid(currentLetter, nextLetter) {
    const validNextLetters = getValidNextLetters(currentLetter);
    
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
                    if (div.innerText === letter) {
                        div.classList.remove('used');
                    }
                }
            }
        }
    });
}


// Draw lines between dots of selected letters
function drawLineBetweenDots(dot1, dot2, className = "dashed-line") {
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
    
    // Set line class so it is styled
    line.classList.add(className);
    
    // Add to SVG layer
    document.getElementById("line-layer").appendChild(line);
    
    drawnLines.push(line);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Make lines solid after finishing a word
async function makeLinesSolid(wordLength) {
    // Get lines used in most recent word
    const numLines = wordLength - 1;
    const recentLines = drawnLines.slice(-numLines);
    
    // Turn solid
    for(const line of recentLines) {
        line.classList.remove("dashed-line");
        line.classList.add("solid-line");
        await delay(120);
    }
}

// Make lines solid after backspacing into a word
function makeLinesDashed(wordLength) {
    // Get lines used in most recent word
    const numLines = wordLength - 1;
    const recentLines = drawnLines.slice(-numLines);
    
    // Turn dashed
    recentLines.forEach(line => {
        line.classList.remove("solid-line");
        line.classList.add("dashed-line");
    })
}

// Color in dots when a new letter is added
function colorDots(prevDot, currDot) {
    // Set previous dot to be used but not active
    prevDot.classList.remove("current-dot");
    prevDot.classList.add("used-dot");
    
    // Set new dot to be active
    currDot.classList.add("current-dot");
}

// Update dot colors on backspace
function colorDotsOnBackspace(removedLetter, previousLetter) {
    // Get divs for previous and removed letters
    const removedDiv = letterDivs.find(div => div.innerText === removedLetter);
    const prevDiv = letterDivs.find(div => div.innerText === previousLetter);
    
    // If the removed div is found, remove the current dot styling and if not used otherwise remove the used styling
    if (removedDiv) {
        // Get removed dot div element
        const removedDot = removedDiv.querySelector('.dot');
        
        // Remove current dot styling
        removedDot.classList.remove('current-dot');
        
        // Check if letter is used previously in current word
        const countInCurrent = currentWord.filter(l => l === removedLetter).length;
        // Check if letter is used previously in previous words
        const countInStored = wordsStored.reduce((count, word) => {
            return count + [...word].filter(l => l === removedLetter).length;
        }, 0);
        
        // If not used othwerwise, remove used styling
        if (countInCurrent + countInStored === 0) {
            removedDot.classList.remove("used-dot")
        }
    }
    // If the previous div is found, make it the current dot
    if (prevDiv) {
        const prevDot = prevDiv.querySelector('.dot');
        prevDot.classList.add('current-dot');
    }
}

function handleLetter(event, letter) {
    
    // Get previous letter
    let previousLetter = getPreviousLetter();
    
    // Get div of input letter and previous letter
    const currentDiv = letterDivs.find(div => div.innerText === letter);
    const prevDiv = letterDivs.find(div => div.innerText === previousLetter);
    
    if (nextLetterIsValid(previousLetter, letter)) {
        // Make letters used
        grayLetters(letter, true);       

        // Draw line and update dots
        if (prevDiv && currentDiv) {
            //Get dot child for each letter div
            const prevDot = prevDiv.querySelector('.dot');
            const currDot = currentDiv.querySelector('.dot');

            // If children exist, draw lines and update coloring
            if(prevDot && currDot) {
                drawLineBetweenDots(prevDot, currDot);
                colorDots(prevDot, currDot);
            }
        }

        // Add the new letter to the current word
        currentWord.push(letter);
    } 
}

// Listener for user input
document.addEventListener('keydown', async (event) => {
    // Standardize letters
    const letter = event.key.toUpperCase();
    
    // Check if input is a letter using Regex 
    if (/^[A-Z]$/.test(letter)) {
        handleLetter(event, letter);
    // Input is backspace
    } else if (event.key === 'Backspace') {
        // Don't allow user to remove first letter of adjacent word
        if (wordsStored.length === 0 || currentWord.length > 1) {
            // Get removed letter
            const removedLetter = currentWord.pop();
            
            // Update coloring for removed letter
            grayLetters(removedLetter, false);
            
            // Get new previous letter after removal
            let previousLetter = getPreviousLetter();
            
            // Update active/used dots
            colorDotsOnBackspace(removedLetter, previousLetter);
            
            // Remove line
            if (drawnLines.length > 0) {
                const lastLine = drawnLines.pop();
                lastLine.remove();
            }
            
        // Backspace into last word
        } else if (wordsStored.length > 0 && currentWord.length === 1) {
            // Get removed letter
            const removedLetter = currentWord.pop();
            
            // Turn lastWord into currentWord
            const lastWord = wordsStored.pop();
            currentWord = lastWord.split('');
            
            // Change lines from solid to dashed
            makeLinesDashed(currentWord.length);
            
            // Remove color from backspaced letter (if not otherwise used)
            grayLetters(removedLetter, false);
            
            // Update previous letter after removal
            let previousLetter = getPreviousLetter();
            
            // Update active/used dots
            colorDotsOnBackspace(removedLetter, previousLetter);
        }
        
    // Input is enter
    } else if (event.key === 'Enter') {
        // Min word length of 3
        if (currentWord.length > 0 && currentWord.length < 3) {
            showBanner("Too short");
            
        // If at least 3 letters are entered
        } else if (currentWord.length >= 3) {
            //Convert array into a string
            const finishedWord = currentWord.join('');
            
            // Validate word
            const isValid = await isValidWord(finishedWord);
            
            // If word is valid
            if (isValid) {
                // Store finished word
                wordsStored.push(finishedWord);
                
                // Start next word with last letter
                currentWord = [finishedWord.slice(-1)]
                
                // Update display after async
                updateCurrentWord();
                
                // Update letter coloring
                grayLetters(finishedWord);
                
                // Turn lines solid
                await makeLinesSolid(finishedWord.length);
                
            } else {
                showBanner("Invalid word");
            }
        }
    }
    
    // Update displayed word(s) at the top
    updateCurrentWord();
})