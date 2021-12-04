import React, { useEffect, useState } from "react"
import useMQTT, { Connection } from './hooks/mqtt_hook';
import ConnectContainer from "./components/connect";
import SensorsDashboard from "./components/sensors_dashboard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bulma/css/bulma.min.css';
import './stylesheets/App.css';


function App() {
  const [connectionStatus, setConnectionStatus] = useState(Connection.DISCONNECTED)
  const [sensors, setSensors] = useState({})

  const onConnect = () => {
    toast.success("Conectado com sucesso!")
    setConnectionStatus(Connection.CONNECTED)
  }

  const onReconnect = () => {
    setConnectionStatus(Connection.RECONNECTING)
  }

  const onError = (error) => {    
    toast.error(error)
    setConnectionStatus(Connection.DISCONNECTED)
  }

  const onMessage = (topic, message) => {
    const sensor = { topic, message }
    console.log(message)
    setSensors({ ...sensors, [topic]: sensor })
  }
  
  const [connect, disconnect, subscribe, unsubscribe] = useMQTT(onConnect, onReconnect, onError, onMessage)

  const onClickToConnect = () => {
    setConnectionStatus(Connection.CONNECTING)
    connect()
  }

  const errorOnSubscribe = (topic, error, granted) => {
    if (!error) return
    setSensors({
      ...sensors,
      [topic]: { topic, message: 'error'}
    })
  }

  const onAddSensor = (sensorName) => {
    const sensorTopic = `dev/${sensorName}/RES`
    subscribe(sensorTopic, errorOnSubscribe)
    setSensors({ ...sensors, [sensorTopic]: { topic: sensorTopic } })
  }

  const onRemoveSensor = (sensorTopic) => {
    const newSensor = { ...sensors }
    delete newSensor[sensorTopic]
    setSensors(newSensor)
    unsubscribe(sensorTopic)
  }

  console.log(sensors)

  const renderContent = () => {
    return (connectionStatus === Connection.CONNECTED)
      ? (
        <SensorsDashboard
          onAddSensor={onAddSensor}
          onRemoveSensor={onRemoveSensor}
          sensors={sensors}
        />
      ) : (
        <ConnectContainer
          status={connectionStatus}
          onClickToConnect={onClickToConnect}
        />
      )
  }
    
  console.log(connectionStatus)
  return (
    <div className="App">
      <div className='card'>
        <h1 className='title is-4 is-bold'>Dashboard MQTT - Monitoramento de Estufa Experimental</h1>
        {renderContent()}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
