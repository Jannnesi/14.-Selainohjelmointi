import PersonService from "../services/PersonService"

const addPerson = (
  event,
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber
) => {
  event.preventDefault()

  const existingPerson = persons.find(p => p.name === newName)

  if (existingPerson) {
    // Update number if it’s different
    if (newNumber !== existingPerson.number) {
      const updatedPerson = { ...existingPerson, number: newNumber }

      PersonService
        .update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(prev =>
            prev.map(p => p.id !== existingPerson.id ? p : response.data)
          )
        })
        .catch(err => {
          alert(`Failed to update ${existingPerson.name}: ${err.message}`)
        })
    } else {
      alert(`${newName} is already in the phonebook with the same number.`)
    }
  } else {
    // Add new person
    const newPerson = { name: newName, number: newNumber }

    PersonService
      .create(newPerson)
      .then(response => {
        setPersons(prev => prev.concat(response.data))
      })
      .catch(err => {
        alert(`Failed to add ${newName}: ${err.message}`)
      })
  }

  // Reset inputs
  setNewName('')
  setNewNumber('')
}

export default addPerson
