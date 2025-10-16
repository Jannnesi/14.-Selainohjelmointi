const Database = require('better-sqlite3')

let db
try {
    db = new Database('sensor_data.db')
    console.log('Connected to SQLite database')
} catch (err) {
    console.error('Could not connect to database', err)
    throw err
}

db.exec(`
CREATE TABLE IF NOT EXISTS bmp_sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    temperature REAL NOT NULL,
    pressure REAL NOT NULL,
    altitude REAL NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_bmp_timestamp ON bmp_sensor_data(timestamp);
`)


function insertSensorData(temperature, pressure, altitude) {
    const timestamp = new Date().toISOString()
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO bmp_sensor_data (timestamp, temperature, pressure, altitude) VALUES (?, ?, ?, ?)`
    )
    try {
        stmt.run(timestamp, temperature, pressure, altitude)
        console.log('Sensor data inserted (or ignored if duplicate timestamp)')
    } catch (err) {
        console.error('Could not insert sensor data', err)
    }
}

// Save a reading object. If timestamp is omitted, uses current time.
function saveSensorReading({ temperature, pressure, altitude, timestamp }) {
    const ts = timestamp || new Date().toISOString()
    const stmt = db.prepare(
        `INSERT OR IGNORE INTO bmp_sensor_data (timestamp, temperature, pressure, altitude) VALUES (?, ?, ?, ?)`
    )
    try {
        stmt.run(ts, temperature, pressure, altitude)
        console.log('Sensor data saved (or ignored if duplicate timestamp)')
    } catch (err) {
        console.error('Could not insert sensor data', err)
    }
}

function getLatestSensorData(callback) {
    try {
        const row = db.prepare(`SELECT * FROM bmp_sensor_data ORDER BY timestamp DESC LIMIT 1`).get()
        callback(null, row)
    } catch (err) {
        console.error('Could not retrieve latest sensor data', err)
        callback(err, null)
    }
}

function getSensorDataByDate(date, callback) {
    try {
        const rows = db
            .prepare(`SELECT * FROM bmp_sensor_data WHERE date(timestamp) = ? ORDER BY timestamp`)
            .all(date)
        callback(null, rows)
    } catch (err) {
        console.error('Could not retrieve sensor data for date', err)
        callback(err, null)
    }
}

module.exports = {
    insertSensorData,
    saveSensorReading,
    getLatestSensorData,
    getSensorDataByDate,
};
