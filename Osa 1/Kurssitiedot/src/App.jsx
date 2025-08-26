const Header = ({ course }) => (
  <h1>{course}</h1>
)

const Part = ({ part, exercises }) => {
  return (
    <div>
      <p>
        {part} {exercises}
      </p>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((p, i) => (
        <Part key={i} part={p.name} exercises={p.exercises} />
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  return (
    <div>
      <p>
        Number of exercises {parts.reduce((sum, p) => sum + p.exercises, 0)}
      </p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'

  const parts = [
    {name: 'Fundamentals of React', exercises: 10},
    {name: 'Using props to pass data', exercises: 7},
    {name: 'State of a component', exercises: 14}
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App