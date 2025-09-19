import { useState, useEffect } from 'react'

import PersonForm from './components/personForm'
import Filter from './components/filter'
import NumbersDisplay from './components/numbersDisplay'
import addPerson from './components/addPerson'
import PersonService from './services/PersonService'

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
    addPerson(event, persons, setPersons, newName, setNewName, newNumber, setNewNumber)
  }
  const handleDeletePerson = (id) => {
    if (!window.confirm('Delete this person?')) return

    PersonService
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
      })
      .catch(err => {
        alert(`Failed to delete: ${err.message}`)
      })
  }
  
  return (
    <div className="container">
      <h1>Phonebook</h1>
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
