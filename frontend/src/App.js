import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import './output.css';
import Home from './pages/Home/home';
import Navbar from './components/Navbar/navbar';
import NavTimer from './components/Navbar/navtimer';
// import Departments from './pages/departments/departments';
// import Testimonials from './pages/testimonials/testimonials';
// import Loading from './pages/loading/loading';
import Game from './pages/game/Pilot'
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
            {/* <Route path='/departments' element={<Departments/>} />
            <Route path='/testimonials' element={<Testimonials/>} /> */}
            <Route path='/game' element={<Game/>} />
            <Route path='/timer' element={<Timer/>} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Router>
  );
}

export default App;
