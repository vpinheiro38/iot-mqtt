import { useEffect, useState } from "react"

function Sensor({ sensor }) {

  return (
    <div className='sensor-container'>
      <div className='sensor-header'>
        <h3 className='subtitle is-5 sensor-title'>Sensor: {sensor}</h3>
        <button
          className="button is-small"
        >
          Remover
        </button>
      </div>
      <p className='subtitle is-6'>Última Temperatura: 0 ºC</p>
      <p className='subtitle is-6'>Último Nível de Umidade: 0 u.m.</p>
    </div>
  );
}

export default Sensor;
