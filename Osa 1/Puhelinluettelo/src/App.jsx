import { useState, useEffect } from 'react'

import PersonForm from './components/personForm'
import Filter from './components/filter'
import NumbersDisplay from './components/numbersDisplay'
import addPerson from './components/addPerson'
import PersonService from './services/PersonService'
import Flash from './components/Flash'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const hook = () => {
    PersonService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }

  useEffect(hook, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [flash, setFlash] = useState({ message: '', type: '' })

  const showFlash = (message, type) => {
    setFlash({ message, type })
    setTimeout(() => {
      setFlash({ message: '', type: '' })
    }, 3000)
  }

  const handleNameChange = (event) => {
    console.log(event.target, event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target, event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )
  const handleAddPerson = (event) => {
    addPerson(event, persons, setPersons, newName, setNewName, newNumber, setNewNumber, showFlash)
  }

  const handleDeletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) {
      showFlash(`Couldn't find person from the server`, 'error')
    }

    if (!window.confirm(`Delete ${person.name}?`)) return

    PersonService
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
        showFlash(`${person.name} deleted successfully!`, 'success')
      })
      .catch(err => {
        showFlash(`Failed to delete ${person.name}: ${err.message}`, 'error')
      })
  }

  
  return (
    <div className="container">
      <h1>Phonebook</h1>
      {flash.message && <Flash message={flash.message} type={flash.type} />}
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <PersonForm 
        addPerson={handleAddPerson} 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}  />
      <h2>Numbers</h2>
      <NumbersDisplay personsToShow={personsToShow} onClick={handleDeletePerson} />
    </div>
  )

}

export default App
