import { useState } from "react"
import '../stylesheets/dashboard.css'
import Sensor from "./sensor"

function SensorsDashboard({ onAddSensor, onRemoveSensor, sensors }) {
  const [addSensorText, setAddSensorText] = useState('')

  const onClickToAddSensor = (event) => {
    event.preventDefault()
    if (!addSensorText) return
    onAddSensor(addSensorText)
  }

  const renderAddSensor = () => (
    <form className='form'>
      <input
        className="input" type="text" placeholder='Nome do Sensor'
        onChange={e => setAddSensorText(e.target.value)}
      />
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
      {Object.values(sensors).map(sensor => (
        <Sensor key={sensor} sensor={sensor} onRemove={onRemoveSensor} />
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
