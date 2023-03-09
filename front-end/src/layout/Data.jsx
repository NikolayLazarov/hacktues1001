import { useState } from 'react'
import './Data.css'
import Graph from '../components/Graph'

function Data() {
  
  const data = [
    {
    "hash": "",
    "temperature": 37,
    "oxygen": 25,
    "pulse": 90,
    "date": "2021-03-01"
    },
    {
    "hash": "",
    "temperature": 38,
    "oxygen": 30,
    "pulse": 95,
    "date": "2021-04-01"
    },
    {
    "hash": "",
    "temperature": 39,
    "oxygen": 35,
    "pulse": 100,
    "date": "2021-05-01"
    }
  ]

  return (
    <div className="Data">
      <div className="pfp"/>
      <div className="name">Josif Bezkosa</div>
      <div className="personal-id">1234567</div>
      <Graph className="graph-temperature" title="temperature" data={data}/>
      <Graph className="graph-oxygen" title="oxygen" data={data}/>
      <Graph className="graph-pulse" title="pulse" data={data}/>
    </div>
  )
}

export default Data

