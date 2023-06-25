import React from 'react'
import nav from './nav.css'
import logo from "../assets/giphy.gif"

const Nav = () => {
  return (
    <div className='nav'>

     <h1>Collision</h1>
      <img src={logo} height={100}width={100}/>
    </div>
  )
}

export default Nav
