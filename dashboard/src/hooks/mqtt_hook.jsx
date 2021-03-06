import { useEffect, useState } from "react"
import * as mqtt from "mqtt"

export const Connection = {
  DISCONNECTED: 0,
  CONNECTING: 1,
  RECONNECTING: 2,
  CONNECTED: 3
}

export const buttonText = [
  'Conectar',
  'Conectando...',
  'Reconnecting...',
  'Desconectar'
]

export const sensorTypes = {
  humiditySensor: { type: 'umidade', unit: 'kg/m³' },
  temperatureSensor: { type: 'temperatura', unit: 'ºC' }
}

function useMQTT(onConnect, onReconnect, onError, onMessage, options = { 
  clientId: 'mqttjs_dashboard', 
  host: 'localhost', 
  port: '9001' 
}) {
  const { clientId, host, port } = options
  const url = `ws://${host}:${port}`
  const mqttOptions = {
    keepalive: 60,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 1000
  }

  const [client, setClient] = useState()

  const connect = () => {
    if (client) client.end()

    const clientMqtt = mqtt.connect(url, mqttOptions)

    clientMqtt.on('error', (err) => {
      onError(err)
      clientMqtt.end()
    })
    
    clientMqtt.on('reconnect', () => {
      onReconnect()
    })

    clientMqtt.on('connect', () => {
      onConnect()
      //clientMqtt.subscribe('#', { qos: 0 })
    })

    clientMqtt.on('message', (topic, message, packet) => {
      onMessage(topic, JSON.parse(message.toString()))
    })

    setClient(clientMqtt)
  }

  const disconnect = () => {
    if (!client) return
    client.end()
  }

  const subscribe = (sensorTopic, errorOnSubscribe) => {
    if (!client) return
    client.subscribe(sensorTopic, { qos: 0 }, (err, granted) => errorOnSubscribe(sensorTopic, err, granted))
  }

  const unsubscribe = (sensorName) => {
    if (!client) return
    client.unsubscribe(sensorName)
  }

  return [connect, disconnect, subscribe, unsubscribe]
}

export default useMQTT;
