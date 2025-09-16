const NumbersDisplay = ({ personsToShow }) => {
  return (
    <div className="card numbers-list">
      {personsToShow.map((p) => (
        <div className="number-item" key={p.name}>
          <span className="name">{p.name}</span>
          <span className="number">{p.number}</span>
        </div>
      ))}
    </div>
  )
}

export default NumbersDisplay
