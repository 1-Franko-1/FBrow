const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close'),
  getSearchHistory: () => ipcRenderer.invoke('get-search-history'),
  saveSearchHistory: (history) => ipcRenderer.invoke('save-search-history', history),
});
