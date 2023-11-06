const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.handle('show-message-box', async (event, options) => {
    return await dialog.showMessageBox(mainWindow, options);
});

ipcMain.on('navigate', (event, page) => {
    if (mainWindow) {
        // Here we just load a different file based on the 'page' argument
        switch(page) {
            case 'main':
                mainWindow.loadFile('index.html');
                break;
            case 'game':
                mainWindow.loadFile('multiplechoice.html');
                break;
            case 'settings':
                mainWindow.loadFile('settings.html');
                break;
            case 'main_menu':
                mainWindow.loadFile('main_menu.html');
            default:
                console.error(`Unknown navigation target: ${page}`);
                break;
        }
    }
});

ipcMain.on('exit-game', (event, arg) => {
    app.quit();
});
