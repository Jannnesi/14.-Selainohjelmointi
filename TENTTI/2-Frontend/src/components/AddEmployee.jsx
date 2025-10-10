import EmployeeService from "../services/EmployeeService"

const AddEmployee = (
  event,
  setEmployees,
  newName,
  setNewName,
  newDepartment,
  setNewDepartment,
  newSalary,
  setNewSalary,
) => {
    event.preventDefault()

    // Add new Employee
    const newEmployee = {
        name: newName,
        department: newDepartment,
        salary: newSalary
    }
    console.log(newEmployee)

    EmployeeService
        .create(newEmployee)
        .then(response => {
            setEmployees(prev => prev.concat(response.data))
        })
        .catch(err => {
            alert(`Failed to add ${newName}: ${err.message}`)
        })
  

    // Reset inputs
    setNewName('')
    setNewDepartment('')
    setNewSalary('')
}

export default AddEmployee
