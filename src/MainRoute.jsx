import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './components/Homepage'

const MainRoute = () => {
  return (
   <>
       <Routes>
            <Route path="/" element={<Homepage/>}/>
           <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
       </Routes>
   </>
  )
}

export default MainRoute