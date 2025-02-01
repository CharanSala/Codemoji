import React from 'react'
import Home from './pages/Home'
import Signin from './components/Signin';
import About from './components/About';
import Events from './components/Events';
import { BrowserRouter, Route, Routes} from "react-router-dom";
const App = () => {
  return (
    <div>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/Events" element={<Events/>}></Route>
      </Routes>

      </BrowserRouter>
      
    </div>
  )
}

export default App