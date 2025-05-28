const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Base de datos
const db = new sqlite3.Database('./database.db');

app.use(cors());
app.use(bodyParser.json());

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS datos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temperatura REAL,
        humedad REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Ruta para recibir datos del sensor
app.post('/api/datos', (req, res) => {
    const { temperatura, humedad } = req.body;

    if (temperatura != null && humedad != null) {
        db.run('INSERT INTO datos (temperatura, humedad) VALUES (?, ?)', [temperatura, humedad], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error al guardar");
            }
            res.send("Datos guardados");
        });
    } else {
        res.status(400).send("Faltan datos");
    }
});

// Ruta para obtener datos históricos
app.get('/api/datos', (req, res) => {
    db.all('SELECT * FROM datos ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener datos");
        }
        res.json(rows.reverse());
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
