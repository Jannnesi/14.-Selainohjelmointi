const NumbersDisplay = ({personsToShow}) => {
    return (
      <div>
        {personsToShow.map(p => (
          <p key={p.name}>{p.name} {p.number}</p>
        ))}
      </div>
    )
}

export default NumbersDisplay