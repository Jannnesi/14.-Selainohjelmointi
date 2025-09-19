const NumbersDisplay = ({ personsToShow, onClick }) => {
  return (
    <div className="card numbers-list">
      {personsToShow.map((p) => (
        <div className="number-item" key={p.id}>
          <span className="name">{p.name}</span>
          <span className="number">{p.number}</span>
          <button className="delete" onClick={() => onClick(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default NumbersDisplay
