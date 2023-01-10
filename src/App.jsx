import { useState } from 'react'

import Dog from './components/dog'
import DogWithApi from './components/dogwithapi'

import './App.css'

function App() {
 
  return (
    <div className="App">
      <DogWithApi></DogWithApi>
    </div>
  )
}

export default App
