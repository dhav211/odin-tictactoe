
const ticTacToe = require('./tictactoe');

describe("point add", () => {
    test("point(2,4) + point(1,1)", () => {
        const p = ticTacToe.point(2,4);
        const expectedP = ticTacToe.point(3,5);
        const addedP = p.add(1,1);

        expect(expectedP.x).toEqual(addedP.x);
        expect(expectedP.y).toEqual(addedP.y);
    });

    test("point(11,2) + point(6,3)", () => {
        const p = ticTacToe.point(11,2);
        const expectedP = ticTacToe.point(17,5);
        const addedP = p.add(6,3);

        expect(expectedP.x).toEqual(addedP.x);
        expect(expectedP.y).toEqual(addedP.y);
    });
});

describe("point subtract", () => {
    test("point(3,2) - point(1,1)", () => {
        const p = ticTacToe.point(3,2);
        const expectedP = ticTacToe.point(2,1);
        const subP = p.subtract(1,1);

        expect(expectedP.x).toEqual(subP.x);
        expect(expectedP.y).toEqual(subP.y);
    });

    test("point(7,5) - point(8,5)", () => {
        const p = ticTacToe.point(7,5);
        const expectedP = ticTacToe.point(-1,0);
        const subP = p.subtract(8,5);

        expect(expectedP.x).toEqual(subP.x);
        expect(expectedP.y).toEqual(subP.y);
    });
});

describe("index to point", () => {
    test("index 3 to point(0,1)", () => {
        const p = ticTacToe.positionConverter.indexToPoint(3);
        const expected = ticTacToe.point(0,1);

        expect(expected.x).toEqual(p.x);
        expect(expected.y).toEqual(p.y);
    });

    test("index 8 to point(2,2)", () => {
        const p = ticTacToe.positionConverter.indexToPoint(8);
        const expected = ticTacToe.point(2, Math.floor(2));

        expect(expected.x).toEqual(p.x);
        expect(expected.y).toEqual(p.y);
    });
});

describe("point to index", () => {
    test("point(1,2) to index 7", () => {
        const i = ticTacToe.positionConverter.pointToIndex(ticTacToe.point(1,2));
        const expected = 7;

        expect(expected).toEqual(i);
    });

    test("point(0,2) to index 2", () => {
        const i = ticTacToe.positionConverter.pointToIndex(ticTacToe.point(2,0));
        const expected = 2;

        expect(expected).toEqual(i);
    });
});

describe("set and clear board", () => {
    test("fill board", () => {
        ticTacToe.gameBoard.setNewBoard();
        
        expect(ticTacToe.gameBoard.getNumberOfSpaces()).not.toEqual(0);
    });

    test("clear", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.clearBoard();

        expect(ticTacToe.gameBoard.getNumberOfSpaces()).toEqual(0);
    });
});

describe("is game won", () => {
    test("striaght right win", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.fillSpace(0, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(1, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(2, ticTacToe.Occupier.Player);

        expect(ticTacToe.gameBoard.isWin(ticTacToe.Occupier.Player)).toEqual(true);
    });

    test("striaght down win", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.fillSpace(1, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(4, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(7, ticTacToe.Occupier.Player);

        expect(ticTacToe.gameBoard.isWin(ticTacToe.Occupier.Player)).toEqual(true);
    });

    test("striaght down left win", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.fillSpace(2, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(4, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(6, ticTacToe.Occupier.Player);

        expect(ticTacToe.gameBoard.isWin(ticTacToe.Occupier.Player)).toEqual(true);
    });

    test("striaght down right win", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.fillSpace(0, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(4, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(8, ticTacToe.Occupier.Player);

        expect(ticTacToe.gameBoard.isWin(ticTacToe.Occupier.Player)).toEqual(true);
    });

    test("loss for computer, win for player", () => {
        ticTacToe.gameBoard.setNewBoard();
        ticTacToe.gameBoard.fillSpace(0, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(1, ticTacToe.Occupier.Player);
        ticTacToe.gameBoard.fillSpace(2, ticTacToe.Occupier.Player);

        expect(ticTacToe.gameBoard.isWin(ticTacToe.Occupier.Computer)).toEqual(false);
    });
});
