import {markSpace, displayVictoryCard, increaseUserScoreText, increaseComputerScoreText} from "./tictactoe_ui.js"

export const Occupier = {
    Empty: 0,
    Player: 1,
    Computer: 2,
}

export const game = (()=>{
    let playerScore = 0;
    let computerScore = 0;
    let _isGameRunning = false;

    const increasePlayerScore = () => {
        playerScore++;
    }

    const increaseComputerScore = () => {
        computerScore++;
    }

    const isGameRunning = () => { return _isGameRunning; }

    const startNewGame = () => {
        gameBoard.setNewBoard();
        ai.resetAi();
        _isGameRunning = true;
    }

    const playRound = (spaceSelected) => {

        gameBoard.fillSpace(spaceSelected, Occupier.Player);

        if (gameBoard.isWin(Occupier.Player)) {
            displayVictoryCard("You Won!!!");
            increasePlayerScore();
            increaseUserScoreText(playerScore);
            _isGameRunning = false;
            return;
        }

        if (!gameBoard.areAllSpacesFilled()) {
            ai.chooseSpace();

            if (gameBoard.isWin(Occupier.Computer)) {
                displayVictoryCard("You lost!!!")
                increaseComputerScore();
                increaseComputerScoreText(computerScore);
                _isGameRunning = false;
                return;
            }
        }

        if (gameBoard.areAllSpacesFilled()) {
            displayVictoryCard("It's A Draw!!");
            _isGameRunning = false;
            return;
        }
    };

    return {
        increasePlayerScore,
        increaseComputerScore,
        startNewGame,
        playRound,
        isGameRunning
    }
})();

export const gameBoard = (()=>{
    const spaces = []
    const numberOfSpaces = 9;
    
    const setNewBoard = () => { 
        if (spaces.length > 0) {
            clearBoard();
        }

        for (let i = 0; i < numberOfSpaces; i++) {
            const position = positionConverter.indexToPoint(i);
            spaces.push(space(position.x, position.y));
        }
    };

    const clearBoard = () => {
        while (spaces.length > 0) {
            spaces.pop();
        }
    }

    const areAllSpacesFilled = () => {
        let isASpaceEmpty = false;

        for (let i = 0; i < numberOfSpaces; i++) {
            if (!isSpaceOccupied(i)) {
                isASpaceEmpty = true;
            }
        }

        return !isASpaceEmpty;
    }

    const getNumberOfSpaces = () => { return spaces.length; }

    const fillSpace = (spaceIndex, occupier) => { spaces[spaceIndex].occupier = occupier; };

    const clearSpace = (spaceIndex) => { spaces[spaceIndex].occupier = Occupier.Empty; };

    const isSpaceOccupied = (spaceIndex) => { 
        if (spaces[spaceIndex].occupier == Occupier.Empty) { 
            return false;
        } else {
            return true;
        } 
    };

    const isWin = (occupierToCheck) => {
        let hasWon = false;

        for (let i = 0; i < 9; i++) {
            if (spaces[i].occupier == occupierToCheck) {
                for (let direction = 0; direction < 8; direction++) {
                    if (_isWinInDirection(occupierToCheck, spaces[i].position, _getDirection(direction))) {
                        hasWon = true;
                        break;
                    }
                }
            }
        }

        return hasWon;
    };

    const _getDirection = (i) => {
        const direction = point(0,0);

        switch (i) {
            case 0: // UP
                direction.x = 0;
                direction.y = -1;
                break;
            case 1: // UP-Right
                direction.x = 1;
                direction.y = -1;
                break;
            case 2: // Right
                direction.x = 1;
                direction.y = 0;
                break;
            case 3: // Right-Down
                direction.x = 1;
                direction.y = 1;
                break;
            case 4: // Down
                direction.x = 0;
                direction.y = 1;
                break;
            case 5: // Down-Left
                direction.x = -1;
                direction.y = 1;
                break;
            case 6: // Left
                direction.x = -1;
                direction.y = 0;
                break;
            case 7: // Up-Left
                direction.x = -1;
                direction.y = -1;
                break;
        }

        return direction;
    };

    const _isWinInDirection = (occupierToCheck, initialPosition, checkDirection) => {
        let isWin = false;
        let winningSpots = 0;
        let currentPosition = initialPosition;

        for (let i = 0; i < 3; i++) {
            const positionIndex = positionConverter.pointToIndex(currentPosition);

            if (_isOutOfGridBounds(currentPosition)) {
                break;
            }

            if (spaces[positionIndex].occupier == occupierToCheck) {
                winningSpots++;
            } else {
                break;
            }

            currentPosition = currentPosition.add(checkDirection.x, checkDirection.y);
        }

        if (winningSpots == 3) {
            isWin = true;
        }

        return isWin;
    };

    const _isOutOfGridBounds = (position) => {
        let isOutOfBounds = false;
        const positionIndex = positionConverter.pointToIndex(position);

        if (positionIndex < 0 || positionIndex > 8 || 
            position.x < 0 || position.x > 2 ||
            position.y < 0 || position.y > 2) {
            isOutOfBounds = true;
        }

        return isOutOfBounds;
    };

    const getOpenSurroundingSpaces = (spaceIndex) => {
        const openSurroundingSpaces = [];

        const spacePosition = positionConverter.indexToPoint(spaceIndex);

        for (let i = 0; i < 9; i++) {
            const direction = _getDirection(i);
            const positionToCheck = spacePosition.add(direction.x, direction.y);
    
            if (!_isOutOfGridBounds(positionToCheck)) {
                if (!isSpaceOccupied(positionConverter.pointToIndex(positionToCheck))) {
                    openSurroundingSpaces.push(positionToCheck);
                }
            }
        }

        return openSurroundingSpaces;
    }

    return {
        fillSpace,
        clearSpace,
        clearBoard,
        getNumberOfSpaces,
        setNewBoard,
        isWin,
        isSpaceOccupied,
        areAllSpacesFilled,
        getOpenSurroundingSpaces,
    }
})();

const space = (x, y) => {
    let occupier = Occupier.Empty;
    let position = point(x, y);

    return {
        occupier,
        position
    }
};

const point = (x, y) => {
    const add = (x2, y2) => { return point(x + x2, y + y2); }
    const subtract = (x2, y2) => { return point(x - x2, y - y2); }
    return { x, y, add, subtract };
};

const ai = (() => {
    let lastChosenSpot = -1;

    const chooseSpace = () => {
        let isSpotChosen = false;
        const computerWinningSpot = _checkOpenSpotsForWins(Occupier.Computer);
        const playerWinningSpot = _checkOpenSpotsForWins(Occupier.Player);
        const willMakeDumbChoice = _willMakeDumbChoice();

        if (computerWinningSpot >= 0 && !isSpotChosen && !willMakeDumbChoice) {
            _fillSpace(computerWinningSpot);
            isSpotChosen = true;
        }

        if (playerWinningSpot >= 0 && !isSpotChosen && !willMakeDumbChoice) {
            _fillSpace(playerWinningSpot);
            isSpotChosen = true;
        }

        if (lastChosenSpot >= 0 && !isSpotChosen) {
            const chosenSurroundingSpace = _chooseSurroundingSpaces();

            if (chosenSurroundingSpace >= 0) {
                _fillSpace(chosenSurroundingSpace);
                isSpotChosen = true;
            }
        }

        if (!isSpotChosen) {
            const randomSpace = _chooseRandomSpace();

            _fillSpace(randomSpace);
            isSpotChosen = true;
        }
    };

    const _willMakeDumbChoice = () => {
        const randomChoice = Math.floor(Math.random() * 5);
        return randomChoice == 0;
    }

    const _fillSpace = (spaceIndex) => {
        gameBoard.fillSpace(spaceIndex, Occupier.Computer);
        markSpace("O", spaceIndex);
        lastChosenSpot = spaceIndex;
    }

    const _chooseSurroundingSpaces = () => {
        const surroundingSpaces = gameBoard.getOpenSurroundingSpaces(lastChosenSpot);
        return surroundingSpaces[Math.floor(Math.random() * surroundingSpaces.length)];
    };

    const _checkOpenSpotsForWins = (occupierToCheck) => {
        let winningSpot = -1;

        for (let i = 0; i < 9; i++) {
            if (!gameBoard.isSpaceOccupied(i)) {
                gameBoard.fillSpace(i, occupierToCheck);
                const isWin = gameBoard.isWin(occupierToCheck);
                gameBoard.clearSpace(i);

                if (isWin) {
                    winningSpot = i;
                    break;
                }
            }
        }

        return winningSpot;
    }

    const _chooseRandomSpace = () => {
        let isSpaceFound = false;
        let chosenSpace = -1;

        while (!isSpaceFound) {
            const randomSpace = Math.floor(Math.random() * 9);

            if (!gameBoard.isSpaceOccupied(randomSpace)) {
                chosenSpace = randomSpace;
                isSpaceFound = true;
            }
        }

        return chosenSpace;
    };

    const resetAi = () => {
        lastChosenSpot = -1;
    };

    return {
        chooseSpace,
        resetAi
    }
})();

const positionConverter = (() => {
    const gridWidth = 3;

    const indexToPoint = (index) => { return point(index % gridWidth, Math.floor(index / gridWidth)); } 
    const pointToIndex = (point) => { return point.x + gridWidth * point.y; } 

    return {
        indexToPoint,
        pointToIndex
    }
})();

// For tests
// module.exports = {};
// module.exports.game = game;
// module.exports.point = point;
// module.exports.gameBoard = gameBoard;
// module.exports.positionConverter = positionConverter;
// module.exports.Occupier = Occupier;

// gameBoard.setNewBoard();
// gameBoard.fillSpace(0, Occupier.Player);
// gameBoard.fillSpace(4, Occupier.Player);
// gameBoard.fillSpace(8, Occupier.Player);
// console.log(gameBoard.isWin(Occupier.Player));