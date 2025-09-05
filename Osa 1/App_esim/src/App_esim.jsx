import { useState } from 'react'

const App = () => {
  const [ counter, setCounter ] = useState(0)
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]
  console.log(parts.reduce())
  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>

      <button onClick={() => setCounter(0)}> 
        zero
      </button>
    </div>
  )
}

export default App