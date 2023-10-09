// Event listener for the "Back to Menu" button
document.getElementById('backToMenu').addEventListener('click', () => {
    window.myAPI.send('back-to-menu');
});
