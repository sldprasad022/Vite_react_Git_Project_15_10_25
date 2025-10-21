import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'
import About from './components/About'
import Home from './components/home'



const MainRoute = () => {
  return (
   <>
       <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path='/home' element={<Home/>} />
       </Routes>
   </>
  )
}

export default MainRoute