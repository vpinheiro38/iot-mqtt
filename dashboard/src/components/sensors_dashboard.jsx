import { useState } from "react"
import '../stylesheets/dashboard.css'
import Sensor from "./sensor"

function SensorsDashboard({ onAddSensor }) {
  const [sensors, setSensors] = useState([])
  const [addSensorText, setAddSensorText] = useState('')

  const onClickToAddSensor = () => {
    if (!addSensorText) return
    //onAddSensor(addSensorText)
    setSensors(sensors => [...sensors, addSensorText])
  }

  const renderAddSensor = () => (
    <form className='form'>
      <label>
        <input 
          className="input" type="text" placeholder='Nome do Sensor'
          onChange={e => setAddSensorText(e.target.value)}
        />
      </label>
      <div>
        <button 
          className="button is-primary is-fullwidth"
          onClick={onClickToAddSensor}
        >
          Adicionar Sensor
        </button>
      </div>
    </form>
  )

  const renderSensorList = () => (
    <div className='sensor-list'>
      {sensors.map(sensor => (
        <Sensor key={sensor} sensor={sensor} />
      ))}
    </div>
  )

  return (
    <div className='dashboard'>
      <h2 className='subtitle'>Sensores</h2>
      {renderAddSensor()}
      {renderSensorList()}
    </div>
  );
}

export default SensorsDashboard;
