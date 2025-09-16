const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form className="card form" onSubmit={addPerson}>
      <h2>Add new</h2>
      <div className="form-row">
        <span className="label">name</span>
        <input value={newName} onChange={handleNameChange} placeholder="Full name" />
      </div>
      <div className="form-row">
        <span className="label">number</span>
        <input value={newNumber} onChange={handleNumberChange} placeholder="Phone number" />
      </div>
      <div className="actions">
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default PersonForm
