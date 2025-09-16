const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>
      <h2>Filter</h2>
      Filter: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter