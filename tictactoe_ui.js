import {game, gameBoard} from './tictactoe.js'

setHeightToProportionalWidth();
game.startNewGame();
assignButtonClickEvents();
assignResetButton();
addEventListener("resize", () => windowResized());


function spaceSelected(spaceIndex) {
    if (!game.isGameRunning()) {
        return;
    }

    if (!gameBoard.isSpaceOccupied(spaceIndex)) {
        markSpace("X", spaceIndex);
        game.playRound(spaceIndex);      
    }
}

function assignButtonClickEvents() {
    const buttons = document.querySelectorAll("button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() { spaceSelected(i - 1) });
    }
}

function assignResetButton() {
    document.getElementById("reset-button").addEventListener("click", resetGame);
}

function resetGame() {
    const victoryCard = document.getElementById("victory-card");
    victoryCard.style.display = "none";
    clearBoard();
    game.startNewGame();
}

function clearBoard() {
    const spaces = document.getElementsByClassName("space");
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].getElementsByClassName("space-inner")[0].textContent = "";
    }
}

export function markSpace(markingSymbol, spaceIndex) {
    const space = document.getElementsByClassName("space")[spaceIndex];
    space.getElementsByClassName("space-inner")[0].textContent = markingSymbol;
}

export function displayVictoryCard(message) {
    const victoryCard = document.getElementById("victory-card");
    victoryCard.style.display = "flex";
    const victoryText = victoryCard.getElementsByTagName("p")[0];
    victoryText.textContent = message;
}

export function increaseUserScoreText(scoreValue) {
    document.getElementById("user-score").textContent = scoreValue.toString();
}

export function increaseComputerScoreText(scoreValue) {
    document.getElementById("computer-score").textContent = scoreValue.toString();
}

function windowResized() {
    // get grid width, which changes by css and set it's height the same as width
    setHeightToProportionalWidth();
}

function setHeightToProportionalWidth() {
    const board = document.getElementById("game-board");
    const newHeight = `${board.clientWidth.toString()}px`;
    board.style.height = newHeight;
}