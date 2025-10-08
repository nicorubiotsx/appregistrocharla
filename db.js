// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.sqlite');
let db = null;

// Inicializar base de datos
function inicializarDB() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Error al conectar con la BD:', err);
                reject(err);
            } else {
                console.log('Conectado a la base de datos SQLite.');
                crearTablas().then(resolve).catch(reject);
            }
        });
    });
}

// Crear tablas si no existen
function crearTablas() {
    return new Promise((resolve, reject) => {
        const queries = [
            `CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS charlas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                descripcion TEXT,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                ponente TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS asistentes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                charla_id INTEGER,
                usuario_id INTEGER,
                fecha_asistencia DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (charla_id) REFERENCES charlas (id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
            )`
        ];

        let completed = 0;
        queries.forEach(query => {
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                } else {
                    completed++;
                    if (completed === queries.length) {
                        resolve();
                    }
                }
            });
        });
    });
}

// Funciones de la base de datos
async function obtenerUsuarios() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM usuarios", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function obtenerCharlas() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM charlas ORDER BY fecha, hora", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function agregarCharla(charla) {
    return new Promise((resolve, reject) => {
        const { titulo, descripcion, fecha, hora, ponente } = charla;
        const sql = `INSERT INTO charlas (titulo, descripcion, fecha, hora, ponente) 
                     VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [titulo, descripcion, fecha, hora, ponente], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

async function agregarAsistente(asistente) {
    return new Promise((resolve, reject) => {
        const { charla_id, usuario_id } = asistente;
        const sql = `INSERT INTO asistentes (charla_id, usuario_id) VALUES (?, ?)`;
        
        db.run(sql, [charla_id, usuario_id], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

async function obtenerAsistentes() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT a.*, u.nombre as usuario_nombre, c.titulo as charla_titulo
                     FROM asistentes a
                     LEFT JOIN usuarios u ON a.usuario_id = u.id
                     LEFT JOIN charlas c ON a.charla_id = c.id`;
        
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function filtrarCharlasPorFechas(desde, hasta) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM charlas 
                     WHERE fecha BETWEEN ? AND ? 
                     ORDER BY fecha, hora`;
        
        db.all(sql, [desde, hasta], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Inicializar la base de datos al cargar el módulo
inicializarDB().catch(console.error);

// Exportar funciones
module.exports = {
    obtenerUsuarios,
    obtenerCharlas,
    agregarCharla,
    agregarAsistente,
    obtenerAsistentes,
    filtrarCharlasPorFechas
};