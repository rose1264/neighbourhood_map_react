import React from 'react'

const Header = props => {
  return (
    <div>
      <h1>Manhattan Downtown Drinks & around</h1>
      <a
        id="menu"
        role="button"
        aria-label="Hamburger Menu Icon"
        className="header_menu"
        onClick ={e => {props.handleSideBarToggle(e)}}
        >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
        </svg>
      </a>
    </div>
  )
}

export default Header
