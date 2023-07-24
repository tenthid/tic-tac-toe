const playerData = document.getElementById('player-data');
const menu = document.getElementById('menu');
const markedBoard = [];
const board = [];
let boardLeft = 0; 
const boardWrapper = document.getElementById('board');
let turn = 'x';
const player = {
    x: {
        name: '',
        nodeDisplayer: document.getElementById('player1-score'),
        score: 0
    },
    o: {
        name: '',
        nodeDisplayer: document.getElementById('player2-score'),
        score: 0
    }
}

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
function displayTie() { }
function addLine(track) {
    const svg = document.getElementById('line');
    const lineType = track.lineType;
    console.log(track);
    const ns = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(ns, 'path');
    console.log(board);
    const rect = board[track.yMin][track.xMin].getBoundingClientRect();
    const rect2 = board[track.yMax][track.xMax].getBoundingClientRect();
    let svgPoint, svgPoint2;
    if (lineType === 'horizontal') {
        svgPoint = toSVGPoint(svg, rect.left, rect.top + rect.height / 2);
        svgPoint2 = toSVGPoint(svg, rect2.right, rect2.top + rect.height/ 2)
    }
    if (lineType === 'vertical') {
        svgPoint = toSVGPoint(svg, rect.left + rect.width / 2, rect.top);
        svgPoint2 = toSVGPoint(svg, rect2.right - rect2.width / 2, rect2.bottom);
    }
    if (lineType === 'diagonalLeft') {
        svgPoint = toSVGPoint(svg, rect.left, rect.top);
        svgPoint2 = toSVGPoint(svg, rect2.right, rect2.bottom);
    }
    if (lineType === 'diagonalRight') {
        console.log(rect.top,rect.bottom);
        svgPoint2 = toSVGPoint(svg, rect.right, rect.top);
        svgPoint = toSVGPoint(svg, rect2.left, rect2.bottom);
    }
    path.setAttribute('d', `M${svgPoint.x} ${svgPoint.y} L${svgPoint2.x} ${svgPoint2.y}`);
    console.log(path);
    path.setAttribute('stroke', 'red');
    path.setAttribute('stroke-linecap', 'square');
    path.setAttribute('stroke-width', '3');
    svg.appendChild(path);
}
function getWinLine(track,rowPos,colPos) {
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
    //horizontal
    if (track[maxRowIndex][0] === track[minRowIndex][0]) {
        return {
            xMin : track[minCollIndex][1] + colPos,
            yMin : rowPos,
            xMax : track[maxCollIndex][1] + colPos,
            yMax : rowPos,
            lineType : 'horizontal'
        };
    }
    //vertical
    if (track[maxCollIndex][1] === track[minCollIndex][1]) {
        return {
            xMin : colPos,
            yMin : track[minRowIndex][0] + rowPos,
            xMax : colPos,
            yMax : track[maxRowIndex][0] + rowPos,
            lineType : 'vertical'
        };
    }
    //diagonal from left
    if (track[maxCollIndex][0] > track[minCollIndex][0] && track[maxCollIndex][1] > track[minCollIndex][1]) {
        return {
            xMin : track[minCollIndex][1] + colPos,
            yMin : track[minCollIndex][0] + rowPos,
            xMax : track[maxCollIndex][1] + colPos,
            yMax : track[maxRowIndex][0] + rowPos,
            lineType : 'diagonalLeft'
        };
    }
    //diagonal from right
    if (track[maxCollIndex][0] < track[minCollIndex][0] && track[maxCollIndex][1] > track[minCollIndex][1]) {
        return {
            xMin : track[maxCollIndex][1] + colPos,
            yMin : track[minRowIndex][0] + rowPos,
            xMax : track[minCollIndex][1] + colPos,
            yMax : track[maxRowIndex][0] + rowPos,
            lineType : 'diagonalRight'
        };
    }
}
function toSVGPoint(svg, x, y) {
    const point = new DOMPoint(x, y);
    return point.matrixTransform(svg.getScreenCTM().inverse());
}
function handlerPlaced(rowPos, colPos, turn) {
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
    boardLeft -= 1;
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
                winBoard.push([currentRowPos,currentColPos]);
                isWin = true;
            }
        }
        if (isWin) {
            addLine(getWinLine(track[winIndex],rowPos,colPos));
            displayWin();
            console.log(player);
            player[turn].score += 1;
            player[turn].nodeDisplayer.innerText = player[turn].score;
            //remove all click event listener from child
            const clonedBoard = boardWrapper.cloneNode(true);
            boardWrapper.replaceWith(clonedBoard);
            return;
        }
        
    }
    if(boardLeft === 0){
        displayTie();
    }
}
function placeMark(rowPos, colPos, turn, node) {
    markedBoard[rowPos][colPos] = turn;
    node.classList.add(turn);
}
function toggleTurn() {
    if (turn === 'x') {
        turn = 'o';
    }
    else {
        turn = 'x';
    }
}
function startGame() {
    const addBoardClickListener = (i, j) => {
        const clickHandler = () => {
            placeMark(i, j, turn, board[i][j]);
            handlerPlaced(i, j, turn);
            toggleTurn();
        }
        board[i][j].addEventListener('click', clickHandler, { once: true });
    };
    //create 3 * 3 board
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        markedBoard.push([]);
        board.push([]);
        for (let j = 0; j < 3; j++) {
            boardLeft += 1;
            markedBoard[i].push(null);
            const node = document.createElement('div');
            row.appendChild(node);
            board[i].push(node);
            addBoardClickListener(i, j);
        };
        boardWrapper.appendChild(row);
    };
}
function init({ player1, player2 }) {
    const gamePlayer1Name = document.getElementById('player1-name');
    const gamePlayer2Name = document.getElementById('player2-name');
    gamePlayer1Name.innerText = `${player1}(x)`;
    gamePlayer2Name.innerText = `${player2}(o)`;
    player.x.name = player1;
    player.o.name = player2;
    startGame();
}
init({ player1: 'hello', player2: 'world' });