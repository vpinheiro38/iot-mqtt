import { useEffect, useState } from "react"
import { sensorTypes } from "../hooks/mqtt_hook";

function Sensor({ sensor, onRemove }) {
  const renderLastValue = () => {

    const sensorType = sensorTypes[sensor.message.header.sensor].type
    const sensorValue = sensor.message.data[0]
    const sensorUnit = sensorTypes[sensor.message.header.sensor].unit

    return (
      <p className='subtitle is-6'>
        Último valor de {sensorType}: {sensorValue} {sensorUnit}
      </p>
    )
  }

  return (
    <div className='sensor-container'>
      <div className='sensor-header'>
        <h3 className='subtitle is-5 sensor-title'>
          Sensor: {sensor.topic.slice(4, -4)}
        </h3>
        <button
          className="button is-small"
          onClick={() => onRemove(sensor.topic)}
        >
          Remover
        </button>
      </div>
      {!sensor.message ? (
        <p className='subtitle is-6'>Esperando envio de dados...</p>
      ) : (
        sensor.message === 'error' ? (
          <p className='subtitle is-6'>Não foi possível conectar-se a esse sensor</p>
        ) : (
          renderLastValue()
        )
      )}
    </div>
  );
}

export default Sensor;
