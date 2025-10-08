// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('./db'); // nuestro módulo de BD (promesas)


function createWindow() {
const win = new BrowserWindow({
width: 1200,
height: 800,
webPreferences: {
preload: path.join(__dirname, 'preload.js'),
contextIsolation: true,
nodeIntegration: false
}
});


win.loadFile('Profile.html');
// win.webContents.openDevTools(); // descomenta para depurar
}


app.whenReady().then(() => {
createWindow();


app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
});


app.on('window-all-closed', () => {
if (process.platform !== 'darwin') app.quit();
});


// ---------------------------
// IPC handlers (exponer funciones de db)
// ---------------------------


ipcMain.handle('obtenerUsuarios', async () => {
return await db.obtenerUsuarios();
});


ipcMain.handle('obtenerCharlas', async () => {
return await db.obtenerCharlas();
});


ipcMain.handle('agregarCharla', async (event, charla) => {
const res = await db.agregarCharla(charla);
return res; // { id }
});


ipcMain.handle('agregarAsistente', async (event, asistente) => {
const res = await db.agregarAsistente(asistente);
return res; // { id }
});


ipcMain.handle('obtenerAsistentes', async () => {
return await db.obtenerAsistentes();
});


ipcMain.handle('filtrarCharlasPorFechas', async (event, desde, hasta) => {
return await db.filtrarCharlasPorFechas(desde, hasta);
});


// Si necesitas otras funciones (insertar usuario, editar, eliminar), agrégalas aquí y en db.js