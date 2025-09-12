
const Total = ({ parts }) => {
  return (
    <div className="total">
      <p>
        Number of exercises {parts.reduce((sum, p) => sum + p.exercises, 0)}
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

const Part = ({ name, exercises }) => {
  return (
    <div className="part">
      <p>
        {name} {exercises}
      </p>
    </div>
  )
}

const Header = ({ title }) => (
  <h1 className="title">{title}</h1>
)

const Course = ({ course }) => {
  return (
    <div className="app">
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <div>
      {courses.map(c => (
          <Course key={c.id} course={c} />
      ))}
    </div>
  )
}

export default App
