const playerData = document.getElementById('player-data');
const menu = document.getElementById('menu');


playerData.addEventListener('submit',evt => {
    evt.preventDefault();
    const data = Object.fromEntries(new FormData(playerData));
    menu.classList.add('hide');
});

function startGame(){
    const boardWrapper = document.getElementById('board');
    //create 3 * 3 board
    const board = Array.from({length : 3},() => {
        const collumn = Array.from({length : 3},() => {
            const node =  document.createElement('div');
            boardWrapper.appendChild(node);
            return node;
        })   
    });

}