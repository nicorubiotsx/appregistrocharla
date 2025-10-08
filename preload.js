// preload.js
const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
obtenerUsuarios: () => ipcRenderer.invoke('obtenerUsuarios'),
obtenerCharlas: () => ipcRenderer.invoke('obtenerCharlas'),
agregarCharla: (charla) => ipcRenderer.invoke('agregarCharla', charla),
agregarAsistente: (asist) => ipcRenderer.invoke('agregarAsistente', asist),
obtenerAsistentes: () => ipcRenderer.invoke('obtenerAsistentes'),
filtrarCharlasPorFechas: (desde, hasta) => ipcRenderer.invoke('filtrarCharlasPorFechas', desde, hasta)
});