import PersonService from "../services/PersonService"

const addPerson = (
  event,
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  flash
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
          flash(`Person ${existingPerson.name} updated succesfully!`, 'success')
        })
        .catch(err => {
          if (err.status === 404) {
            flash(`Failed to update ${existingPerson.name}: Person doesn't exist.`, 'error')
          }
        })
    } else {
      flash(`${newName} is already in the phonebook with the same number.`, 'error')
    }
  } else {
    // Add new person
    const newPerson = { name: newName, number: newNumber }

    PersonService
      .create(newPerson)
      .then(response => {
        setPersons(prev => prev.concat(response.data))
        flash(`Person ${newPerson.name} added succesfully!`, 'success')
      })
      .catch(err => {
        alert(`Failed to add ${newName}: ${err.message}`)
        flash(`Failed to add ${newName}.`, 'error')
      })
  }

  // Reset inputs
  setNewName('')
  setNewNumber('')
}

export default addPerson
