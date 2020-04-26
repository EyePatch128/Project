import React from 'react';

// css
import './navbar.css';

// Components
import Arrow from '../arrow/arrow.js';

function Navbar(props){
	
	function toggle(e){
		document.getElementsByClassName("navbar-div")[0].classList.toggle("navDown");
		document.getElementsByClassName("nav-toggle")[0].classList.toggle("arrow-rot");
	}
	function scrollToSection(bool){
		let offset = document.body.scrollHeight;
		if(bool)
			offset = offset - (offset/1.5);
		window.scrollTo(0, offset);
	}
	return(
		
			<nav className="navbar">
				<div className="navbar-div">
					<ul className="navbar-ul">
						<li className="nav-item">
							<div>
								<a onClick={()=>scrollToSection(false)}>COUNTRY</a>
								<span></span>
							</div>
						</li>
						<li className="nav-item world-item">
							<div>
								<a onClick={()=>scrollToSection(true)}>WORLD</a>
								<span></span>
							</div>
						</li>
						<li className="nav-item">
							<div>
								<a onClick={()=>scrollToSection(false)}>CITY</a>
								<span></span>
							</div>
						</li>
					</ul>
				</div>
				
				{/* Down Arrow */}
				<div className="nav-toggle">
					<button type="button" onClick={ e=>toggle(e) }>
						<Arrow />
					</button>
				</div>
			</nav>
		
	);
};

export default Navbar;