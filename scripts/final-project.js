// Author: Lydia Asselstine

// *****************
// *** VARIABLES ***
// **** CLASSES ****
// *****************

const alphabet         = "abcdefghijklmnopqrstuvwxyz".split("");
const $image           = $("#image");
const $keyboard        = $("#keyboard");
const $incorrect       = $("#incorrect");
const $word            = $("#word");
const $hint            = $("#hint");
const $hintButton      = $("#hint-btn");
const $reset           = $("#reset");
const instructionsText = $("#instructions p").html();

const game = {
    wrongGuesses:  0,
    wrongGuessMax: 6,

    reset: function()
    {
        this.wrongGuesses = 0;
    },

    addWrongGuess: function()
    {
        this.wrongGuesses++;
    },

    isLost: function()
    {
        return this.wrongGuesses > this.wrongGuessMax;
    }
};


// ****************
// *** KEYBOARD ***
// ****************

// Create buttons for each letter of the alphabet
// Add a click event listener to each
function createKeyboard()
{
    alphabet.forEach(function(letter) 
    {
        const $button = $("<button>");

        $button.text(letter);
        $button.addClass("keyboard-key");

        $button.click(function() 
        {
            handleGuess($button, letter);
        });

        $keyboard.append($button);
    });
}

// Keyboard input events
$(document).keydown(function(event) 
{
    const letter  = event.key.toLowerCase();
    const $button = findKey(letter);

    if($button)
    {
        $button.addClass("active"); 
    }
});

$(document).keyup(function(event) 
{
    const letter  = event.key.toLowerCase();
    const $button = findKey(letter);

    if($button && !$button.prop("disabled"))
    {
        handleGuess($button, letter); 
    }
    
    if($button)
    {
        $button.removeClass("active");
    }
});

// Finds the matching button for the letter that was pressed
function findKey(letter)
{
    let $match = null;

    $keyboard.children().each(function() 
    {
        const $key = $(this);

        if($key.text() === letter)
        {
            $match = $key;
        }
    });

    return $match;
}

// Disables the button
function disableKey($button)
{
    $button.prop("disabled", true);
}


// ************
// *** DATA ***
// ************

// Fetch random JSON data from file and display it
function fetchData()
{  
    fetch("../data/words.json")
        .then(function(response)
        {
            if(response.ok)
            {
                return response.json();
            }
            else
            {
                throw new Error("Failed to fetch words");
            }
        })
        .then(function(data)
        {
            let randomIndex  = Math.floor(Math.random() * data.length);
            let currentWord  = data[randomIndex];
            let wordLetters  = currentWord.word.split("");
            let hint         = currentWord.hint;

            // Display each letter of the new word
            wordLetters.forEach(function(letter)
            {
                const $letterTile = $("<span>");

                $letterTile.data("letter", letter);
                $letterTile.text("_");
                $letterTile.addClass("letter-tile");

                $word.append($letterTile);
            });

            // Display the hint
            $hint.text(hint);
        })
        .catch(function(error)
        {
            $word.text(error);
        });
}


// ******************
// *** START GAME ***
// ******************

// Click listener for Start button
$reset.click(function()
{
    startGame();
});

// Start game by resetting all game elements, 
// showing all relevant elements, 
// and fetching new data
function startGame()
{
    game.reset();

    $keyboard.empty();
    $word.empty();
    $hint.empty();
    $hint.hide();

    createKeyboard();
    fetchData();

    $keyboard.show();
    $incorrect.show();
    $word.show();
    $hintButton.show();

    $reset.text("Reset Game");
    $incorrect.text("Wrong guesses: " + game.wrongGuesses);
    $("#instructions p").html(instructionsText);

    transitionImage("../images/start.jpg", 
                    "Start image");
}


// ***************
// *** GUESSES ***
// ***************

// Click listener for Hint button
$hintButton.click(function()
{
    $hint.show();
    $hintButton.hide();
})

// Display the tile letter when there is a matching letter guess
// Returns true for match, false otherwise
function revealLetter(letter)
{   
    let match = false;

    $word.children().each(function()
    {
        const $letterTile = $(this);
        
        if ($letterTile.data("letter") === letter)
        {
            $letterTile.text(letter.toUpperCase());
            match = true;
        }
    });

    return match;
}

// Checking for win or lose conditions
function checkGameState()
{
    if(game.isLost())
    {
        loseCondition();
    }
    else
    {
        let win = true;

        $word.children().each(function()
        {
            const $letterTile = $(this);
        
            if ($letterTile.text() === "_")
            {
                win = false;
            }
        });

        if(win)
        {
            winCondition();
        }
    }
}

// Handles revealing letters, 
// disabling keys,
// checking game state on each guess
function handleGuess($button, letter)
{
    let match = revealLetter(letter);

    if(match === false)
    {
        game.addWrongGuess();

        transitionImage(`../images/state${game.wrongGuesses}.jpg`, 
                        `Wrong guess ${game.wrongGuesses}`);
    }

    disableKey($button);
    checkGameState();
    $incorrect.text("Wrong guesses: " + game.wrongGuesses);
}

// Image fade in and out
function transitionImage(newSrc, newAlt)
{
    $image.fadeOut(300, function()
    {
        $image.attr("src", newSrc);
        $image.attr("alt", newAlt);
        $image.fadeIn(300);
    });
}


// ****************
// *** END GAME ***
// ****************

function winCondition()
{
    transitionImage("../images/win.jpg", 
                    "Win image");

    $keyboard.hide();
    $word.hide();
    $hint.hide();
    $hintButton.hide();
    $incorrect.hide();

    $reset.text("Play Again");
    $("#instructions p").text("Congratulations! Hammy couldn't steal all your seeds!!");
}

function loseCondition()
{
    transitionImage("../images/lose.jpg", 
                    "Lose image");

    $keyboard.hide();
    $word.hide();
    $hint.hide();
    $hintButton.hide();
    $incorrect.hide();

    $reset.text("Play Again");
    $("#instructions p").text("Oh no!! All your seeds were stolen. Better luck next time. :(");
}