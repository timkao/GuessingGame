function generateWinningNumber() {
    var temp = Math.random();

    if (temp !== 0) {
        return Math.floor(temp * 100 + 1);
    }
    else {
        return 1;
    }
}

// Fisher-Yates Shuffle
function shuffle(arr) {
    
    var endPoint = arr.length - 1;

    for (var i = 0; i < arr.length; i++) {
        
        // randomly select the element in the array
        var startPoint = Math.floor(Math.random() * (arr.length - i));

        // in-place swith, need to use extra memory to hold value    
        var temp = arr[endPoint - i];
        arr[endPoint - i] = arr[startPoint];
        arr[startPoint] = temp;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(guess) {

    if (isNaN(guess) || guess < 1 || guess > 100) {
        throw "That is an invalid guess.";
    }

    this.playersGuess = guess;
    return this.checkGuess();
};

Game.prototype.checkGuess = function() {

    if (this.pastGuesses.length >= 5) {
        return "You Lose.";
    }


    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    }
    else if (this.pastGuesses.includes(this.playersGuess)) {
        return "You have already guessed that number.";
    }
    else {
        this.pastGuesses.push(this.playersGuess);

        if (this.pastGuesses.length === 5) {
            return "You Lose.";
        }
        else if (this.difference() < 10) {
            return 'You\'re burning up!';
        }
        else if (this.difference() < 25) {
            return 'You\'re lukewarm.';
        }
        else if (this.difference() < 50) {
            return 'You\'re a bit chilly.';
        }
        else {
            return 'You\'re ice cold!';
        }

    }
}

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function() {
    var result = [this.winningNumber];
    var hintNumbers = 3

    for (var i = 1; i < hintNumbers; i++) {
        result[i] = generateWinningNumber();
    }

    return shuffle(result);
}

$(document).ready(function(){
    
    var game = new Game();
    var guessesList = $('#guesses ul').children();
    
    var attachGuesses = function(numStr) {
        var notReset = game.pastGuesses.length;
        for (var i = 0; i < guessesList.length; i++) {
            
            if (notReset === 0) {
                $(guessesList[i]).text("-");
            }
            
            else if ($(guessesList[i]).text() === "-") { /* from DOM element to JQuery element */
                $(guessesList[i]).text(numStr);
                break;
            }
        }
    };

    var submitResult = function() {
        var Gs = $('#player-input').val();
        $('#player-input').val("");
        var output = (game.playersGuessSubmission(parseInt(Gs)));
        
        if (output === 'You have already guessed that number.') {
            $('#headers h1').text('Guess Again!');
        }
        else if (output === 'You Win!' || output === 'You Lose.') {
            $('#headers h1').text(output);
            $('#headers h3').text('Click the reste button');
            attachGuesses(Gs);
            /* disable attribute => JQueryElement.prop('disabled', true) */
            $('#hints, #go').prop('disabled', true);

        }
        else {
            $('#headers h1').text(output);
            if (game.isLower()) {
                $('#headers h3').text('Guess Higher!');
            }
            else {
                $('#headers h3').text('Guess Lower!');
            }
            attachGuesses(Gs);
        }
    };


    // click button to submit the result
    $('#go').on('click', function(){
        submitResult();
    });

    // press enter to submit the result
    $('#player-input').on('keyup', function(e){
        if (e.keyCode === 13 && !$('#go').prop('disabled')) {
            submitResult();
        }
    });

    // reset button click event
    $('#resetAll').on('click', function() {
        game = new Game();
        attachGuesses(); // clear the guesses on the UI
        $('#player-input').val("");
        $('#hints, #go').prop('disabled', false); // enabled the buttons
        // reset headings
        $('#headers h1').text('Guessing Game');
        $('#headers h3').text('Guess a number between 0 and 100');
    });

    $('#hints').on('click', function(){
        console.log('hint is ready!');
        $('#headers h1').text('Winning Number coud be ' + game.provideHint());
    });

});

