const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  });

  win.loadFile("login.html");
}

app.whenReady().then(createWindow);
