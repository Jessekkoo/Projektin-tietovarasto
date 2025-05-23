const { app, BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    autoHideMenuBar: true,
    resizable: true,
        movable: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
    icon: path.join(__dirname, './renderer/img/logo.png ')
  });

  win.loadFile('renderer/index.html');
  win.setMinimumSize(1200, 900);
  
}

app.whenReady().then(() => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
