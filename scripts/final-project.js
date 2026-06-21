// Author: Lydia Asselstine

// ****************
// *** KEYBOARD ***
// ****************
const alphabet  = "abcdefghijklmnopqrstuvwxyz".split("");
const $keyboard = $("#keyboard");

// Create buttons for each letter of the alphabet
// Add a click event listener to each
alphabet.forEach(function(letter) 
{
    const $button = $("<button>");

    $button.text(letter);
    $button.addClass("keyboard-key");

    $button.click(function() 
    {
        disableGuess($button)
    });

    $keyboard.append($button);
});

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

    if($button)
    {
        disableGuess($button);
        $button.removeClass("active"); 
    }
});

// Finds the matching button for the letter that was pressed
function findKey(letter)
{
    let $match = null;

    $keyboard.children().each(function() 
    {
        const $button = $(this);

        if($button.text() === letter)
        {
            $match = $button;
        }
    });

    return $match;
}

// Disables the button
function disableGuess($button)
{
    $button.prop("disabled", true);
}


// ************
// *** DATA ***
// ************
const $word = $("#word");
const $hint = $("#hint");

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
        let randomIndex = Math.floor(Math.random() * data.length);
        let currentWord = data[randomIndex];
        let wordLetters = currentWord.word.split("");
        let hint        = currentWord.hint;

        wordLetters.forEach(function(letter)
        {
            const $letterTile = $("<span>");

            $letterTile.text("_");
            $letterTile.addClass("letter-tile");

            $word.append($letterTile);
        });

        $hint.text(hint);
    })
    .catch(function(error)
    {
        $word.text(error);
    });
