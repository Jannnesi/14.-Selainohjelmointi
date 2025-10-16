const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

const baseURL = "https://jannenkoti.com/api/bmp"

app.get('/api/bmp/latest', async (req, res) => {
  try {
    const response = await fetch(`${baseURL}/latest`)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch data from backend' })
  }
})

app.get('/api/bmp/today', async (req, res) => {
  try {
    const ts = new Date()
    const dateStr = ts.toISOString().split('T')[0] // "YYYY-MM-DD"
    console.log('Fetching data for date:', dateStr)

    const response = await fetch(`${baseURL}/date?date=${dateStr}`)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch data from backend' })
  }
})

app.get('/api/bmp/date', async (req, res) => {
  const dateStr = req.query.date
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return res.status(400).json({ error: 'Invalid or missing date parameter. Expected format: YYYY-MM-DD' })
  }

  try {
    console.log('Fetching data for date:', dateStr)
    const response = await fetch(`${baseURL}/date?date=${dateStr}`)
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch data from backend' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
