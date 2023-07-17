const playerData = document.getElementById('player-data');
const menu = document.getElementById('menu');
const markedBoard = [];
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
function checkPos(rowPos, colPos, turn) {
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
    for (let i = 0; i < track.length; i++) {
        for (let j = 0; j < 3; j++) {
            const currentRowPos = rowPos + track[i][j][0];
            const currentColPos = colPos + track[i][j][1];
            if (!isIndexValid(currentRowPos, currentColPos) || markedBoard[currentRowPos][currentColPos] !== turn) {
                isWin = false;
                break;
            }
            else {
                isWin = true;
            }
        }
        if (isWin) {
            console.log('win')
            return isWin;
        }
    }

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
    //create 3 * 3 board
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('div');
        markedBoard.push([]);
        for (let j = 0; j < 3; j++) {
            markedBoard[i].push(null);
            const node = document.createElement('div');
            row.appendChild(node);
            node.remove
            node.addEventListener('click', () => {
                placeMark(i, j, turn, node);
                checkPos(i, j,turn);
                if(turn === 'o'){
                    turn = 'x';
                }
                else{
                    turn = 'o';
                }
            }, { once: true });
        };
        boardWrapper.appendChild(row);
    };

}
startGame({ player1: 'hello', player2: 'world' });