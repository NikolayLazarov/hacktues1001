
import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Data from './layout/Data'
import EntryForm from './components/EntryForm'


const router = createBrowserRouter([
  {
    path: "/Data",
    element: <Data />,
  },
  {
    path: "/",
    element: <EntryForm/>
  }
]);

function App() {

  return (
    <div className="App">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </div>
  )
}

export default App
