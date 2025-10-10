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

const EMPLOYEES = [
    {
        id: 1,
        name: "Mattila Mika",
        department: "Sales",
        salary : 2435
    },
    {
        id: 2,
        name: "Anttila Sanna",
        department: "Administration",
        salary : 1123
    },
    {
        id: 3,
        name: "Hakkarainen Maria",
        department: "Administration",
        salary : 3451
    },
    {
        id: 4,
        name: "Mattila Mika",
        department: "Sales",
        salary : 2454
    },
    {
        id: 5,
        name: "Maunula Tiina",
        department: "Sales",
        salary : 1542
    },
    {
        id: 6,
        name: "Sepponen Jaana",
        department: "Production",
        salary : 5342
    },
    {
        id: 7,
        name: "Juvonen Janne",
        department: "Production",
        salary : 3252
    },
    {
        id: 8,
        name: "Andersson Ritva",
        department: "Administration",
        salary : 1254
    }
]

app.get('/api/employees', (request, response) => {
  response.json(EMPLOYEES)
})

app.get('/api/administration', (request, response) => {
    const admins = EMPLOYEES.filter(e => 
        e.department.match("Administration")
    )
    response.json(admins)
})

app.post('/api/employees', (request, response) => {
    const e = request.body
    console.log(e)
    if (!e.name || !e.department || !e.salary) {
        return response.status(400).json({error: "Invalid request body"})
    }
    e.id = (Math.random() * 1000000).toFixed(0)
    EMPLOYEES.push(e)
    response.status(201).json(e)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
