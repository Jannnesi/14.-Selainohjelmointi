import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const Statistics = ({stats}) => {
  return (
    <div>
      <h1>Statistics</h1>
      <p>Good {stats.good}</p>
      <p>Neutral {stats.neutral}</p>
      <p>Bad {stats.bad}</p>
      <p>All {stats.all}</p>
      <p>Average {(stats.all)/3}</p>
      <p>Positive {stats.good/stats.all} %</p>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good+bad+neutral
  let stats = {
    good: good,
    neutral: neutral,
    bad: bad,
    all: all,
    avg: all/3,
    positive: good/all
  }
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text={"Good"} />
      <Button onClick={() => setNeutral(neutral + 1)} text={"Neutral"} />
      <Button onClick={() => setBad(bad + 1)} text={"Bad"} />
      <Statistics stats={stats} />
    </div>
  )
}

export default App