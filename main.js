const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs'); // To interact with the file system
const searchHistoryFile = path.join(__dirname, 'searchHistory.json'); // File to store history

let win;

// Function to load search history from the file
function loadSearchHistory() {
  try {
    const data = fs.readFileSync(searchHistoryFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty array if file does not exist or error occurs
  }
}

// Function to save search history to the file
function saveSearchHistory(history) {
  fs.writeFileSync(searchHistoryFile, JSON.stringify(history, null, 2), 'utf-8');
}

function createWindow() {
    win = new BrowserWindow({
        width: 1600,
        height: 1000,
        minWidth: 600,
        minHeight: 800,
        frame: false,
        webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        webviewTag: true
        }
    });

    win.loadFile('index.html');

    // Set the window title
    win.setTitle('FBrow');
}

app.whenReady().then(createWindow);

// Handle minimize, maximize, and close events
ipcMain.on('minimize', () => {
  if (win) win.minimize();
});

ipcMain.on('maximize', () => {
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on('close', () => {
  if (win) win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('get-search-history', () => {
    return loadSearchHistory(); // Return the history when requested
});
  
ipcMain.handle('save-search-history', (event, history) => {
    saveSearchHistory(history); // Save the updated history to the file
});
  