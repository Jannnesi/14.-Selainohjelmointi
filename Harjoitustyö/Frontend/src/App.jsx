import { useState, useEffect } from 'react'

import DualClimateGauge from "./components/DualClimateGauge"
import TemperatureTodayChart from "./components/TemperatureChart"
import SensorService from './services/SensorService';

const App = () => {
  const [sensorData, setSensorData] = useState(null)

  const hook = () => {
    SensorService
      .getLatest()
      .then(response => {
        console.log(response.data)
        setSensorData(response.data)
      })
  }
  useEffect(hook, [])

  if (!sensorData) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 24, padding: 16 }}>
      <DualClimateGauge
        temperature={sensorData.temperature}   // °C
        pressure={sensorData.pressure}         // hPa
        altitude={sensorData.altitude}         // m
        size={500}
      />
      <TemperatureTodayChart width={720} height={300} title="Temperature Graph" />
    </div>
  );
}

export default App
