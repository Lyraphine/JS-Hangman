// Author: Lydia Asselstine

// *** KEYBOARD ***
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