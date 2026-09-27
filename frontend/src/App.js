import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Home from './pages/Home/home';
import Navbar from './components/Navbar/navbar';
import Game from './pages/game/Lobby'
import Form from './pages/Form/Form';
import Timer from './pages/Timer/timer'

function App() {

  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // }, []);

  return (
      <Router>
        <div className='App'>
          <Navbar />
          {/* <NavTimer /> */}
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/game' element={<Game/>} />
            <Route path='/form' element={<Form/>} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Router>
  );
}

export default App;
