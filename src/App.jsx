import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin, { UserContext } from "./components/Signin";
import About from "./components/About";
import Events from "./components/Events";

const App = () => {
  const [user, setUser] = useState(null); // Store user name globally

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin setUser={setUser} />} /> {/* Pass setUser */}
          <Route path="/about" element={<About />} />
          <Route path="/signin/events" element={<Events />} /> {/* Corrected path */}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
};

export default App;
