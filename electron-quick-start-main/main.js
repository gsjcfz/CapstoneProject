const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let gameWindow;
let settingsWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
}

function createGameWindow() {
    gameWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    gameWindow.loadFile('game.html');
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });

    settingsWindow.loadFile('settings.html');
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

ipcMain.on('start-game', (event, arg) => {
    mainWindow.close();
    createGameWindow();
});

ipcMain.on('open-settings', (event, arg) => {
    console.log('Opening settings...');
    createSettingsWindow();
});

ipcMain.on('back-to-menu', (event, arg) => {
    if (gameWindow && !gameWindow.isDestroyed()) gameWindow.close();
    if (settingsWindow && !settingsWindow.isDestroyed()) settingsWindow.close();
    createMainWindow();
});


ipcMain.on('exit-game', (event, arg) => {
    app.quit();
});
