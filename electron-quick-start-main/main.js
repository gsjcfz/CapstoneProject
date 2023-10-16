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

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
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

    gameWindow.loadFile('multiplechoice.html');

    gameWindow.on('closed', () => {
        gameWindow = null;
    });
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

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
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
    if (mainWindow) {
        mainWindow.close();
        mainWindow = null; // Explicitly set to null for clarity
    }
    if (!gameWindow) { // Only create a new game window if one doesn't already exist
        createGameWindow();
    }
});


ipcMain.on('open-settings', (event, arg) => {
    console.log('Opening settings...');
    createSettingsWindow();
});

ipcMain.on('back-to-menu', (event, arg) => {
    if (gameWindow) {
        gameWindow.close();
        gameWindow = null; // Explicitly set to null for clarity
    }
    if (settingsWindow) {
        settingsWindow.close();
        settingsWindow = null; // Explicitly set to null for clarity
    }
    createMainWindow();
});

ipcMain.on('exit-game', (event, arg) => {
    app.quit();
});
