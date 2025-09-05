const Header = ({ title }) => (
  <h1 className="title">{title}</h1>
)

const Part = ({ name, exercises }) => {
  return (
    <div className="part">
      <p>
        {name} {exercises}
      </p>
    </div>
  )
}

const Content = ({ parts }) => {
  return (
    <div className="parts">
      {parts.map((p, i) => (
        <Part key={i} name={p.name} exercises={p.exercises} />
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
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total total={course.sum_exercises()} />
    </div>
  )
}

export default App
