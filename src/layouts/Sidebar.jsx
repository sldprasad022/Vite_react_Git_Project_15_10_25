import React from 'react'
import { TbLogout } from "react-icons/tb";
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { FaRegNewspaper } from 'react-icons/fa6';
import { Link, NavLink } from 'react-router-dom';

const Sidebar = () => {

    const sidebarData =[
        {
           id :1,
           label :'Home Page',
           icon: <FaHome className='text-xl lg:text-2xl' />,   // ✅ just the component reference
           path:'/' 
        },
        {
           id :2,
           label :'About',
           icon: <FaRegNewspaper className='text-xl lg:text-2xl' />,   // ✅ just the component reference
           path:'/about' 
        },
        {
           id :3,
           label :'Home',
           icon: <TbLogout className='text-xl lg:text-2xl' />,   // ✅ just the component reference
           path:'/home' 
        },
    ]


  return (
    <>
        <div className='h-screen p-2 bg-gray-400'>
            {
                sidebarData.map((eachObject)=>(
                    <div key={eachObject.id} className='p-2 flex items-center'>
                        {
                            eachObject.label==='Log out'?(
                                <button className='flex items-center gap-2 p-2'>
                                    {eachObject.icon}
                                    {eachObject.label}  
                                </button>
                            ):(
                               <NavLink to={eachObject.path} className='flex items-center gap-2 p-2' >
                                    {eachObject.icon}
                                    {eachObject.label}    
                               </NavLink> 
                            )
                        }

                    </div>
                ))
            }
        </div>
    </>
  )
}

export default Sidebar