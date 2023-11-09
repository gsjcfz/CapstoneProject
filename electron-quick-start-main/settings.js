document.getElementById('back').addEventListener('click', () => {
    window.myAPI.send('navigate', 'main_menu');
});
