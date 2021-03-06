import React, { Component } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { Web3ReactProvider, useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import {Card} from 'react-bootstrap'
import {TokenLogo} from './../../utils/TokenIcon'
import './style.css'

import { useEagerConnect, useInactiveListener } from '../../hooks'
import {
    injected,
    network,
    walletconnect,
    walletlink,
    ledger,
    trezor,
    frame,
    authereum,
    fortmatic,
    portis,
    squarelink,
    torus
  } from './../../connectors'

 const isMetamaskInstalled=()=>{ if (!(window.web3 || window.ethereum)) {
    return false;} else {
      return true 
    }
  }
export default function Connections(props) {

    const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

 

  const isMetamask = window.ethereum && window.ethereum.isMetaMask

  
  
  
  // const connectorsByName = {
  //   Metamask: injected,
  //   Network: network,
  //   WalletConnect: walletconnect,
  //   WalletLink: walletlink,
  //   Ledger: ledger,
  //   Trezor: trezor,
  //   Frame: frame,
  //   Authereum: authereum,
  //   Fortmatic: fortmatic,
  //   Portis: portis,
  //   Squarelink: squarelink,
  //   Torus: torus
  // }

   const connectorsByName = {
    Metamask: injected,    
    WalletConnect: walletconnect,
    Coinbase: walletlink,
    Ledger: ledger,
    Trezor: trezor,
  }

 
  
  
        return (
            <React.Fragment>
              <div class="wallets">
              <div className="row">  
                 {Object.keys(connectorsByName).map(name => {
          const currentConnector = connectorsByName[name]
          currentConnector.name=name;
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled = !triedEager || !!activatingConnector || connected || !!error

          return (
<div key={name} className="col-lg-5 col-md-5 col-sm-12">
      
  
<Card body>

       <a className="btn" onClick={() => {
                if(name=='Metamask' && !isMetamaskInstalled()){
                  window.open("https://metamask.io/");
                }
                else{
                  //deactivate();
                  //connector.close();
                setActivatingConnector(currentConnector)
                
                activate(connectorsByName[name])
                
                sessionStorage.setItem('connection','0x0');
                setTimeout(()=>{
                  props.connectCallback();
                },1000)

                }
              }}>
                 {activating && <span></span>}
                {connected && !error && (
                  <span style={{marginRight:'5px'}} role="img" aria-label="check">
                    ✅
                  </span>
                )}
                 {(name=='Metamask' && !isMetamaskInstalled())?"Install "+name:name}               
                {name=='WalletConnect' && <img className="pull-right"  height="24" width="24" src={`./assets/${name}.svg`}/>}
                {name!='WalletConnect' && <img className="pull-right"  height="24" width="24" src={`./assets/${name}.png`}/>}
              </a>
         
</Card>
</div>
           
          
          )
        })}
        </div>
            </div>
            </React.Fragment>
        )
    
}
