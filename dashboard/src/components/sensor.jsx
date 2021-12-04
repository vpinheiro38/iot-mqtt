import { useEffect, useState } from "react"
import { sensorTypes } from "../hooks/mqtt_hook";
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, registerables } from 'chart.js'

Chart.register(CategoryScale)
Chart.register(...registerables)

const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

function Sensor({ sensor, onRemove }) {
  const [data, setData] = useState(Array.from({ length: 24 }).map((_, i) => undefined))

  useEffect(() => {
    if (!sensor || !sensor.message) return

    const sensorValue = sensor.message.data[0]

    setData(data => {
      const tempData = [...data].slice(1)
      tempData.push(sensorValue)
      return tempData
    })
  }, [sensor])

  const renderLastValue = () => {
    const sensorType = sensorTypes[sensor.message.header.sensor].type
    const sensorValue = sensor.message.data[0]
    const sensorUnit = sensorTypes[sensor.message.header.sensor].unit
    
    return (
      <div className='chart-div'>
	      <p className='subtitle is-6'>
		      Último valor de {sensorType}: {sensorValue} {sensorUnit}
	      </p>	      
	      <Line
          datasetIdKey={sensor.message.header.sensor}
          data = {{
            labels: hours,
            datasets:[{
              animation: false,
              label: sensorType,
              data: data,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]              
          }}
        />
	    </div>
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
