import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const StatisticsLine = ({value, text}) => {
  return (
    <div>
      <p>{text} {value}</p>
    </div>
  )
}

const Statistics = ({stats, total}) => {
  if (total != 0) {
    return (
      <div>
        <h1>Statistics</h1>
        {stats.map(({name, value}) => (
          <StatisticsLine text={name} value={value} />
        ))}
      </div>
    )
  } else {
    return (
      <div>
        <h1>Statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  let all = good+bad+neutral
  let stats = [
    { name: "Good", value: good },
    { name: "Neutral", value: neutral },
    { name: "Bad", value: bad },
    { name: "All", value: all },
    { name: "Average", value: all / 3 },
    { name: "Positive", value: good / all }
  ]
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text={"Good"} />
      <Button onClick={() => setNeutral(neutral + 1)} text={"Neutral"} />
      <Button onClick={() => setBad(bad + 1)} text={"Bad"} />
      <Statistics stats={stats} total={all} />
    </div>
  )
}

export default App