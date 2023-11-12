import React from 'react';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='home/:googleId' element={<Home />} />
        <Route path='login' element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
