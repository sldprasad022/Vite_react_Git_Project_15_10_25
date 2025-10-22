import React, { useState } from 'react'
import Header from '../layouts/Header'
import Sidebar from '../layouts/Sidebar'
import { Outlet } from 'react-router-dom'
import Footer from '../layouts/Footer'

const Homepage = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
        <Header toggleSidebar={()=>setIsSidebarOpen(!isSidebarOpen)}/>

        <div className='flex '>
            <div className={`${isSidebarOpen ? 'w-2/12':'hidden'}`}>
                <Sidebar/>
            </div>
            <div className={`${isSidebarOpen ? 'w-10/12' :'w-full'}`}>
                <Outlet/>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Homepage