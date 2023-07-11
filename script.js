const playerData = document.getElementById('player-data');

playerData.addEventListener('submit',evt => {
    evt.preventDefault();
    const data = Object.fromEntries(new FormData(playerData));
});