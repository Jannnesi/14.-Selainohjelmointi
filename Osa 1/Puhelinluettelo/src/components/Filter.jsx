const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div className="card filter">
      <h2>Filter</h2>
      <div className="form-row">
        <span className="label">search</span>
        <input value={filter} onChange={handleFilterChange} placeholder="Type a name" />
      </div>
    </div>
  )
}

export default Filter
