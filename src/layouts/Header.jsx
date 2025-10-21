import React from 'react'

const Header = ({toggleSidebar}) => {
  return (
    <>
        <div className='p-4 bg-blue-800 flex justify-between items-center' >
           <button onClick={toggleSidebar}>
                <h1 className='text-xl font-medium text-white'>Techpixe</h1>
           </button>
        </div>
    </>
  )
}

export default Header