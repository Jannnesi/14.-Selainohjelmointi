const EmployeeForm = ({
  addEmployee, newName, handleNameChange, 
  newDepartment, handleDepartmentChange, 
  newSalary, handleSalaryChange
}) => {
  return (
    <form onSubmit={addEmployee}>
      <h2>Add new</h2>
      <div>
        <span>Name </span>
        <input type="text" 
          value={newName} 
          onChange={handleNameChange} 
          placeholder="Full name"
        />
      </div>
      <div>
        <span>Department </span>
        <input type="text"
          value={newDepartment}
          onChange={handleDepartmentChange}
          placeholder="Department"
        />
      </div>
      <div>
        <span>Salary </span>
        <input type="number" 
          value={newSalary} 
          onChange={handleSalaryChange} 
          placeholder="Monthly Salary"
        />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

export default EmployeeForm

