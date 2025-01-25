import React from 'react'
import Home from './pages/Home'
import Signin from './components/Signin';
import { BrowserRouter, Route, Routes} from "react-router-dom";
const App = () => {
  return (
    <div>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/signin" element={<Signin/>}></Route>
      </Routes>

      </BrowserRouter>
      
    </div>
  )
}

export default App