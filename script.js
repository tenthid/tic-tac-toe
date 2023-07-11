const playerData = document.getElementById('player-data');
const menu = document.getElementById('menu');


playerData.addEventListener('submit',evt => {
    evt.preventDefault();
    const data = Object.fromEntries(new FormData(playerData));
    menu.classList.add('hide');
});