import { useEffect, useState } from "react"
import { buttonText, Connection } from "../hooks/mqtt_hook";

function ConnectContainer({ status, onClickToConnect, error }) {

  return (
    <div className='content'>
      <button 
        className='button is-primary is-medium is-info' 
        onClick={onClickToConnect}
        //disabled={status !== Connection.DISCONNECTED}
      >
        {buttonText[status]}
      </button>
      {error && (
        <h2>{error}</h2>
      )}
    </div>
  );
}

export default ConnectContainer;
