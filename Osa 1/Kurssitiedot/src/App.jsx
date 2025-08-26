const Header = (p) => {
  return (
    <div>
      <h1>{p.course}</h1>
    </div>
  )
}

const Part = (p) => {
  return (
    <div>
      <p>
        {p.part} {p.exercises}
      </p>
    </div>
  )
}

const Content = (p) => {
  return (
    <div>
      <Part part={p.part1} exercises={p.exercises1} />
      <Part part={p.part2} exercises={p.exercises2} />
      <Part part={p.part3} exercises={p.exercises3} />
    </div>
  )
}

const Total = (p) => {
  return (
    <div>
      <p>Number of exercises {p.exercises1 + p.exercises2 + p.exercises3}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content 
        part1={part1} exercises1={exercises1}
        part2={part2} exercises2={exercises2}
        part3={part3} exercises3={exercises3}
      />
      <Total 
        exercises1={exercises1}
        exercises2={exercises2}
        exercises3={exercises3}
      />
    </div>
  )
}

export default App