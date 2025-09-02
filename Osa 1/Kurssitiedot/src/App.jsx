const Header = ({ course }) => (
  <h1 className="title">{course}</h1>
)

const Part = ({ part, exercises }) => {
  return (
    <div className="part">
      <p>
        {part} {exercises}
      </p>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div className="parts">
      {parts.map((p, i) => (
        <Part key={i} part={p.name} exercises={p.exercises} />
      ))}
    </div>
  )
}

const Total = ({ total }) => {
  return (
    <div className="total">
      <p>
        Number of exercises {total}
      </p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
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
    ],
    sum_exercises: function() {
      return this.parts.reduce((sum, p) => sum + p.exercises, 0);
    }
  }

  return (
    <div className="app">
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={course.sum_exercises()} />
    </div>
  )
}

export default App
