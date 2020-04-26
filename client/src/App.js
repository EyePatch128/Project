import React, { Component } from 'react';

import './App.css';

// Components
import Navbar from "./components/navbar/navbar.js";
import Logo from "./components/logo/logo.js";
import Wave from "./components/wave/wave.js";
import Container from "./components/container/container.js";


class App extends Component {
	
	// eslint-disable-next-line
	constructor(props){
		super(props);
		this.state = {
			key: "9f75f98f5f02906f0f57c6ede29cb1db"
		};
	}
	
	render(){
		return (
			<div className="app">
				
				<section className="intro">
					{ /* First 100vh: Navbar, Logo, Wave */ }
					{ /* Navbar //header tag included in Navbar component */ }
					<header className="header">
						<Navbar />
					</header>
					
					{ /* Background for 1st page: background-color:#222233; */ }
					<div className="fst-bg"></div>
					
					{ /* Logo and Wave Used as backgrounf image */}
					<Logo />
					<Wave />
				</section>
				
				{ /* End of First 100vh */ }
				
				<main className="main">
					<Container APIKEY={this.state.key}/>						
				</main>
			</div>
		);
	}
}


export default App;
