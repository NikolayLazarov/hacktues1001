import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Data from './layout/Data'
import './index.css'
import EntryForm from './components/EntryForm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EntryForm />
    <Data />

  </React.StrictMode>,
)
