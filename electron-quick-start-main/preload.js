const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'myAPI', {
        send: (channel, data) => {
            // Add new channels as needed
            const validChannels = [
                "start-game",
                "open-settings",
                "exit-game",
                "back-to-menu",
                "instructor-view",
                // "show-message-box" channel removed as we are going to use invoke for this
                "navigate",
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        // Add a new function to handle dialog invocation
        invoke: (channel, data) => {
            // Add new channels as needed
            const validChannels = [
                "show-message-box" // This is the new channel for invoking message boxes
                // Add other channels here if needed for invoke
            ];
            if (validChannels.includes(channel)) {
                // ipcRenderer.invoke returns a promise
                return ipcRenderer.invoke(channel, data);
            }
        }
    }
);
