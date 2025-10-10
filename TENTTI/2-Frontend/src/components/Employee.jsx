const Employee = ({employee}) => {
  const e = employee
  return (
    <div>{e.name} {e.department} {e.salary}</div>
  )
}

export default Employee