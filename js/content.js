var ScrabbleTiles = []; //Create an array from the .json file to store tile data
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  };
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 };
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  };
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  };
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  };
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  };
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  };
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  };
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  };
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  };

const boardSquares = [// Define the board squares and their types
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'double-word', label: 'DOUBLE<br>WORD', multiplier: '2×' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'double-letter', label: 'DOUBLE<br>LETTER', multiplier: '2×' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'double-letter', label: 'DOUBLE<br>LETTER', multiplier: '2×' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'double-word', label: 'DOUBLE<br>WORD', multiplier: '2×' },
    { type: 'normal', label: '', multiplier: '' },
    { type: 'normal', label: '', multiplier: '' }
];

let currentScore = 0;
let totalScore = 0;
let placedTiles = {};

function drawRandomTiles(count = 7) {// Draw random tiles from the bag
    const availableLetters = [];
    for (let letter in ScrabbleTiles) {
        for (let i = 0; i < ScrabbleTiles[letter]["number-remaining"]; i++) {
            availableLetters.push(letter); //Needed help understanding how to push multiple of the same letter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        }
    }
    const drawnTiles = [];
    for (let i = 0; i < count && availableLetters.length > 0; i++) {//Used this link to help understand how to implement random selection: https://www.w3schools.com/js/js_random.asp
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        const letter = availableLetters.splice(randomIndex, 1)[0];
        
        drawnTiles.push({//Create tile object with letter and value
            letter: letter,
            value: ScrabbleTiles[letter].value
        });
        ScrabbleTiles[letter]["number-remaining"]--;
    }
    return drawnTiles;
}

function returnTilesToBag(tiles) {// Return tiles to the bag (increase their count)
    tiles.forEach(tile => {
        if (ScrabbleTiles[tile.letter]) {
            ScrabbleTiles[tile.letter]["number-remaining"]++;
        }
    });
}

function initializeBoard() {// Initialize the game board and implement droppable functionality: https://api.jqueryui.com/droppable/
    const $boardRow = $('#board-row');
    $boardRow.empty();

    boardSquares.forEach((square, index) => {
        const $square = $('<div>').addClass(`board-square ${square.type}`).attr('data-index', index).attr('data-bonus-type', square.type);
        $boardRow.append($square);
    });

    $('.board-square').droppable({
        accept: '.tile',
        tolerance: 'pointer',
        drop: function(event, ui) {
            const $this = $(this);
            const squareIndex = $this.attr('data-index');
            const $tile = ui.draggable;
            const tileLetter = $tile.attr('data-letter');
            const tileValue = $tile.attr('data-value');
            const tileId = $tile.attr('data-tile-id');

            if ($this.find('.placed-tile').length > 0) {
                $tile.animate({ top: 0, left: 0 }, 200);
                return;
            }

            $tile.removeClass('ui-draggable-dragging')
            $tile.addClass('placed-tile')
            $tile.css({ position: 'relative', top: 0, left: 0 });
            $tile.appendTo($this);

            placedTiles[squareIndex] = {
                letter: tileLetter,
                value: parseInt(tileValue),
                tileId: tileId,
                bonusType: $this.attr('data-bonus-type')
            };

            updateWordDisplay();
            calculateScore();
        }
    });
}

function initializeTiles(tiles) {// Initialize the player's tile rack and implement draggable functionality: https://api.jqueryui.com/draggable/
    const $rack = $('#tile-rack');
    $rack.empty();

    tiles.forEach((tile, index) => {
        const $tile = $('<div>').addClass('tile').attr('data-letter', tile.letter).attr('data-value', tile.value).attr('data-tile-id', `tile-${index}`);
        if (tile.letter === '_') { // Handle blank tile differently
            $tile.css('background-image', `url('OneRowScrabble/graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg')`);
        } else {
            $tile.css('background-image', `url('OneRowScrabble/graphics_data/Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg')`);
        }
        $rack.append($tile);
    });

    $('.tile').draggable({
        revert: 'invalid',
        containment: '.game-container',
        cursor: 'crosshair',
    });
}

function updateWordDisplay() {// Update the displayed current word based on placed tiles
    const sortedIndices = Object.keys(placedTiles).sort((a, b) => a - b); // Used this link to understand object keys: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    let word = '';
    sortedIndices.forEach(index => {
        word += placedTiles[index].letter;
    });

    $('#current-word').text(word || '-');
}

function calculateScore() {// Calculate the current score based on placed tiles and their bonuses
    const sortedIndices = Object.keys(placedTiles).sort((a, b) => a - b);
    if (sortedIndices.length === 0) {
        $('#current-score').text(0);
        return;
    }
    let baseScore = 0;
    let wordMultiplier = 1;
    sortedIndices.forEach(index => {
        const tile = placedTiles[index];
        let letterScore = tile.value;
        switch (tile.bonusType) {
            case 'double-letter':
                letterScore *= 2;
                break;
            case 'double-word':
                wordMultiplier *= 2;
                break;
        }
        baseScore += letterScore;
    });

    currentScore = baseScore * wordMultiplier;
    $('#current-score').text(currentScore);
}


function resetBoard() {// Reset the board to its initial state
    $('.placed-tile').removeClass('placed-tile').appendTo('#tile-rack').css({ top: 0, left: 0 });
    $('#tile-rack .tile').show().css({ top: 0, left: 0 });
    placedTiles = {};
    currentScore = 0;
    totalScore = 0;
    updateWordDisplay();
    $('#current-score').text(currentScore);
    $('#total-score').text(totalScore);
}

function playWord() {// Finalize the played word, update scores, and draw new tiles
    totalScore += currentScore;
    $('#total-score').text(totalScore);
    const tilesPlayed = $('.placed-tile').length;
    $('.placed-tile').remove();
    placedTiles = {};
    currentScore = 0;
    $('#current-score').text(0);
    updateWordDisplay();
    const newTiles = drawRandomTiles(tilesPlayed);
    newTiles.forEach((tile, index) => {
        const $tile = $('<div>').addClass('tile').attr('data-letter', tile.letter).attr('data-value', tile.value).attr('data-tile-id', `tile-new-${index}`);
        if (tile.letter === '_') {
            $tile.css('background-image', `url('/graphics_data/Scrabble_Tiles/Scrabble_Tile_Blank.jpg')`);
        } else {
            $tile.css('background-image', `url('/graphics_data/Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg')`);
        }
        $('#tile-rack').append($tile);
        $tile.draggable({
            revert: 'invalid',
            containment: '.game-container',
            cursor: 'crosshair',
        });
    });
}

function getPlayedTiles() {
    return $('.placed-tile').length;
}

$(document).ready(function() {
    initializeBoard();
    const initialTiles = drawRandomTiles(7);
    initializeTiles(initialTiles);
    $('#reset-btn').on('click', resetBoard);
    $('#new-tiles-btn').on('click', playWord);
});
