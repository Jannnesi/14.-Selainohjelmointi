import PersonService from "../services/PersonService"

const addPerson = (event, persons, setPersons, newName, setNewName, newNumber, setNewNumber) => {
  event.preventDefault()

  const exists = persons.some(person => person.name === newName)
  if (exists) {
    alert(`${newName} is already added to phonebook`)
    return
  }

  const newPerson = { name: newName, number: newNumber }
  setPersons(persons.concat(newPerson))
  PersonService.create(newPerson)
  setNewName('')
  setNewNumber('')
  console.log(`Added ${newName}`)
}

export default addPerson
