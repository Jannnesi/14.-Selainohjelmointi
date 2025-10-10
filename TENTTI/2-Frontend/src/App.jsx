import { useState, useEffect } from 'react'

import Employee from "./components/Employee"
import EmployeeForm from './components/EmployeeForm'
import AddEmployee from './components/AddEmployee'

import EmployeeService from "./services/EmployeeService"

const App = () => {

  const [employees, setEmployees] = useState([])
  const hook = () => {
    EmployeeService
      .getAll()
      .then(response => {
        setEmployees(response.data)
      })
  }
  useEffect(hook, [])

  const [newName, setNewName] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [newSalary, setNewSalary] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target, event.target.value)
    setNewName(event.target.value)
  }
  const handleDepartmentChange = (event) => {
    console.log(event.target, event.target.value)
    setNewDepartment(event.target.value)
  }
  const handleSalaryChange = (event) => {
    console.log(event.target, event.target.value)
    setNewSalary(event.target.value)
  }
  const handleAddEmployee = (event) => {
    AddEmployee(
      event, setEmployees, 
      newName, setNewName,
      newDepartment, setNewDepartment,
      newSalary, setNewSalary
    )
  }

  return (
    <div>
      <h1>Employees</h1>
      <EmployeeForm
        addEmployee={handleAddEmployee}
        newName={newName}
        handleNameChange={handleNameChange}
        newDepartment={newDepartment}
        handleDepartmentChange={handleDepartmentChange}
        newSalary={newSalary}
        handleSalaryChange={handleSalaryChange}
      />
      <ul>
        {employees.map(employee => <li key={employee.id}>
          <Employee employee={employee} />
        </li>)}
      </ul>
    </div>
  )
}

export default App