const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { saveSensorReading, getLatestSensorData, getSensorDataByDate } = require('./database')

morgan.token('body', (req) => {
  if (req.method === 'POST' && req.body && Object.keys(req.body).length) {
    return JSON.stringify(req.body)
  }
  return ''
})

const app = express()
app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

// Background fetch configuration
// Default to direct sensor endpoint; override with BMP_SOURCE_URL env var.
const SENSOR_SOURCE_URL = process.env.BMP_SOURCE_URL || 'http://192.168.10.123/bmp'
const POLL_INTERVAL_MS = Number(process.env.BMP_POLL_INTERVAL_MS || 10 * 60 * 1000)

// Fetch the latest reading directly from the sensor endpoint
async function fetchSensorReading() {
  const response = await fetch(SENSOR_SOURCE_URL)
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)
  const data = await response.json()

  const reading = {
    temperature: data.temperature ?? data.temp,
    pressure: data.pressure,
    altitude: data.altitude,
    timestamp: data.timestamp || new Date().toISOString(),
  }

  if (
    typeof reading.temperature !== 'number' ||
    typeof reading.pressure !== 'number' ||
    typeof reading.altitude !== 'number'
  ) {
    throw new Error('Incomplete reading from sensor')
  }

  return reading
}

let isFetching = false
async function fetchAndStore() {
  if (isFetching) return
  isFetching = true
  try {
    const reading = await fetchSensorReading()
    // Persist valid reading
    saveSensorReading(reading)
  } catch (err) {
    console.error('Background fetch error:', err)
  } finally {
    isFetching = false
  }
}

app.get('/api/latest', async (req, res) => {
  try {
    // Fetch live reading so refresh always returns the latest
    const reading = await fetchSensorReading()
    return res.json(reading)
  } catch (liveErr) {
    console.error('Live fetch failed for /api/latest:', liveErr)
    // Fallback to latest stored reading from DB
    getLatestSensorData((err, row) => {
      if (err) {
        console.error('DB error fetching latest sensor data:', err)
        return res.status(500).json({ error: 'Failed to read from database' })
      }
      if (!row) return res.status(503).json({ error: 'Sensor unavailable and no cached data' })
      res.json(row)
    })
  }
})

app.get('/api/today', (req, res) => {
  const ts = new Date()
  const dateStr = ts.toISOString().split('T')[0] // "YYYY-MM-DD"
  console.log('Fetching DB data for date:', dateStr)
  getSensorDataByDate(dateStr, (err, rows) => {
    if (err) {
      console.error('DB error fetching data for today:', err)
      return res.status(500).json({ error: 'Failed to read from database' })
    }
    res.json(rows || [])
  })
})

app.get('/api/date', (req, res) => {
  const dateStr = req.query.date
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ error: 'Invalid or missing date parameter. Expected format: YYYY-MM-DD' })
  }

  console.log('Fetching DB data for date:', dateStr)
  getSensorDataByDate(dateStr, (err, rows) => {
    if (err) {
      console.error('DB error fetching data for date:', err)
      return res.status(500).json({ error: 'Failed to read from database' })
    }
    res.json(rows || [])
  })
})

const PORT = 3001
// Kick off the periodic background fetcher
fetchAndStore().catch(() => {})
setInterval(() => {
  fetchAndStore().catch(() => {})
}, POLL_INTERVAL_MS)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
