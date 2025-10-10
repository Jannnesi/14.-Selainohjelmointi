import ReactDOM from 'react-dom/client'

import React from 'react'
import App from './App'

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

ReactDOM.createRoot(document.getElementById('root')).render(<App/>)