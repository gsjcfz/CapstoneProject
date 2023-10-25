const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    "myAPI", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["start-game", "open-settings", "exit-game", "back-to-menu", "instructor-view"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        }
    }
);
