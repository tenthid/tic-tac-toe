const playerData = document.getElementById('player-data');
const menu = document.getElementById('menu');
const markedBoard = [];
const board = []
let turn = 'x';

playerData.addEventListener('submit', evt => {
    evt.preventDefault();
    const data = Object.fromEntries(new FormData(playerData));
    startGame();
    menu.classList.add('hide');
});
function isIndexValid(i, j) {
    const isValid = typeof markedBoard[i] !== 'undefined' && typeof markedBoard[i][j] !== 'undefined';
    return isValid;
}
function displayWin() { }
function addLine(lineType, nodes) {
    const svg = document.getElementById('line');
    const ns = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < nodes.length; i++) {
        const path = document.createElementNS(ns, 'path');
        const rect = nodes[i].getBoundingClientRect();
        let svgPoint, svgPoint2;
        if (lineType === 'horizontal') {
            svgPoint = toSVGPoint(svg, rect.left, rect.top + rect.height / 2);
            svgPoint2 = toSVGPoint(svg, rect.right, rect.bottom - rect.height / 2)
        }
        if (lineType === 'vertical') {
            svgPoint = toSVGPoint(svg, rect.left + rect.width / 2, rect.top);
            svgPoint2 = toSVGPoint(svg, rect.right - rect.width / 2, rect.bottom);
        }
        if (lineType === 'vertical') {
            svgPoint = toSVGPoint(svg, rect.left + rect.width / 2, rect.top);
            svgPoint2 = toSVGPoint(svg, rect.right - rect.width / 2, rect.bottom);
        }
        if (lineType === 'diagonalRight') {
            svgPoint = toSVGPoint(svg, rect.left, rect.top);
            svgPoint2 = toSVGPoint(svg, rect.right, rect.bottom);
        }
        if (lineType === 'diagonalLeft') {
            svgPoint = toSVGPoint(svg, rect.right, rect.top);
            svgPoint2 = toSVGPoint(svg, rect.left, rect.bottom);
        }
        path.setAttribute('d', `M${svgPoint.x} ${svgPoint.y} L${svgPoint2.x} ${svgPoint2.y}`);
        path.setAttribute('stroke', 'red');
        path.setAttribute('stroke-linecap', 'square');
        path.setAttribute('stroke-width', '3');
        svg.appendChild(path);
    }
}
function checkWinLine(track) {
    let minRow = Infinity;
    let maxRow = -Infinity;
    let minColl = Infinity;
    let maxColl = -Infinity;
    let minRowIndex = 0, maxRowIndex = 0;
    let minCollIndex = 0, maxCollIndex = 0;
    for (let i = 0; i < track.length; i++) {
        if (track[i][0] > maxRow) {
            maxRow = track[i][0];
            maxRowIndex = i;
        }
        if (track[i][0] < minRow) {
            minRow = track[i][0];
            minRowIndex = i;
        }
        if (track[i][1] > maxColl) {
            maxColl = track[i][1];
            maxCollIndex = i;
        }
        if (track[i][1] < minColl) {
            minColl = track[i][1];
            minCollIndex = i;
        }
    }
    if (track[maxRowIndex][0] === track[minRowIndex][0]) {
        return 'horizontal';
    }
    if (track[maxCollIndex][1] === track[minCollIndex][1]) {
        return 'vertical';
    }
    if (track[maxCollIndex][0] > track[minCollIndex][0] && track[maxCollIndex][1] > track[minCollIndex][1]) {
        return 'diagonalRight';
    }
    if (track[maxCollIndex][0] < track[minCollIndex][0] && track[maxCollIndex][1] > track[minCollIndex][1]) {
        return 'diagonalLeft';
    }
}
function toSVGPoint(svg, x, y) {
    const point = new DOMPoint(x, y);
    return point.matrixTransform(svg.getScreenCTM().inverse());
}
function checkIsWin(rowPos, colPos, turn) {
    let isWin = false;
    const track = [
        [
            [-2, 0],
            [-1, 0],
            [0, 0]
        ],
        [
            [2, 0],
            [1, 0],
            [0, 0]
        ],
        [
            [0, -2],
            [0, -1],
            [0, 0]
        ],
        [
            [0, 2],
            [0, 1],
            [0, 0]
        ],
        [
            [2, -2],
            [1, -1],
            [0, 0]
        ],
        [
            [-2, 2],
            [-1, 1],
            [0, 0]
        ],
        [
            [-2, -2],
            [-1, -1],
            [0, 0]
        ],
        [
            [2, 2],
            [1, 1],
            [0, 0]
        ],
        [

            [-1, 0],
            [0, 0],
            [1, 0]
        ], [
            [0, -1],
            [0, 0],
            [0, 1]
        ], [
            [-1, -1],
            [0, 0],
            [1, 1]
        ], [
            [-1, 1],
            [0, 0],
            [1, -1]
        ]];
    let winIndex;
    let winBoard = [];
    for (let i = 0; i < track.length; i++) {
        for (let j = 0; j < 3; j++) {
            const currentRowPos = rowPos + track[i][j][0];
            const currentColPos = colPos + track[i][j][1];
            if (!isIndexValid(currentRowPos, currentColPos) || markedBoard[currentRowPos][currentColPos] !== turn) {
                isWin = false;
                winBoard = [];
                break;
            }
            else {
                winIndex = i;
                winBoard.push(board[currentRowPos][currentColPos]);
                isWin = true;
            }
        }
        if (isWin) {
            addLine(checkWinLine(track[winIndex]), winBoard);
            displayWin();
            console.log('win');
            return true
        }

    }
    return false;

}
function placeMark(rowPos, colPos, turn, node) {
    markedBoard[rowPos][colPos] = turn;
    node.classList.add(turn);
}
function startGame({ player1, player2 }) {
    const gamePlayer1Name = document.getElementById('player1-name');
    const gamePlayer2Name = document.getElementById('player2-name');
    gamePlayer1Name.innerText = `${player1}(x)`;
    gamePlayer2Name.innerText = `${player2}(o)`;
    const boardWrapper = document.getElementById('board');
    const makeBoardClickHandler = (i,j) => {
        const clickHandler = () => {
            placeMark(i, j, turn, board[i][j]);
            console.log(markedBoard);
            console.log(i,j)
            checkIsWin(i, j, turn);
            if (checkIsWin(i, j, turn)) {
                console.log('win');
                const clonedBoard = boardWrapper.cloneNode(true);
                boardWrapper.replaceWith(clonedBoard);
            }
            if (turn === 'o') {
                turn = 'x';
            }
            else {
                turn = 'o';
            }
        }
        return clickHandler;
    };
    //create 3 * 3 board
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        markedBoard.push([]);
        board.push([]);
        // makeBoardRow();
        for (let j = 0; j < 3; j++) {
            markedBoard[i].push(null);
            const node = document.createElement('div');
            row.appendChild(node);
            board[i].push(node);
            node.addEventListener('click', makeBoardClickHandler(i,j), { once: true });
        };
        boardWrapper.appendChild(row);
    };
}
startGame({ player1: 'hello', player2: 'world' });