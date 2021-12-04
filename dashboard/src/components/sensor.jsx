import { useEffect, useState } from "react"
import { sensorTypes } from "../hooks/mqtt_hook";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, registerables } from 'chart.js'

Chart.register(CategoryScale)
Chart.register(...registerables)

var data = []
var hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

var hour = 0
function Sensor({ sensor, onRemove }) {
  const renderLastValue = () => {

    const sensorType = sensorTypes[sensor.message.header.sensor].type
    const sensorValue = sensor.message.data[0]
    const sensorUnit = sensorTypes[sensor.message.header.sensor].unit
    data[hour] = sensorValue
    hour = (hour + 1) % 24
    
    return (
      <>
	      <p className='subtitle is-6'>
		Último valor de {sensorType}: {sensorValue} {sensorUnit}
	      </p>
	      
	      <Line
		  data = {{
	labels: hours,
	datasets:[{
		label: sensorType,
		data: data,
		fill: false,
		borderColor: 'rgb(75, 192, 192)',
		tension: 0.1
	}]
		
}}
		/>
	</>
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
