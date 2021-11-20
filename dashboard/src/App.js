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

  }
  
  const [connect, disconnect, subscribe] = useMQTT(onConnect, onReconnect, onError, onMessage)

  const onClickToConnect = () => {
    setConnectionStatus(Connection.CONNECTING)
    connect()
  }

  const onAddSensor = (sensorName) => {
    subscribe(sensorName)
  }

  const renderContent = () => {
    return (connectionStatus === Connection.CONNECTED)
      ? (
        <SensorsDashboard
          onAddSensor={onAddSensor}
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
