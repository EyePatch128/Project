import React, { Component } from "react";
import { Carousel } from "react-bootstrap";

// Css
import "./world.css";

// Components
import Map from "../map/map.js";
// import TempMap from "../map/tempmap.js";
// import HumidityMap from "../map/humiditymap.js";
// import PressureMap from "../map/pressuremap.js";

const maps = ["Weather Map", "Humidity Map", "Pressure Map"];

class World extends Component{
	constructor(props){
		super(props);
		this.state = {
			index: 0,
			slide: true,
			indicators: true,
			interval: null,
			data: {},
			capitalsWeather: []
		};
	}
	
	handleSelect(selectedIndex, e){
		document.querySelector(`.itemCaptions${selectedIndex}`).classList.remove("hideIndicators");
		document.querySelector(".carousel-indicators").classList.remove("hideIndicators");
		
		this.setState({
			index: selectedIndex
		});
		this.handleFade(selectedIndex, 3000);
		
		// document.querySelectorAll(".maps").forEach(elem=>{
			// if(elem.id !== `map${this.state.index}`){
				// elem.style.display = "none";
			// }
		// })
	};
	
	handleFade(selectedIndex, delay){
		
		const fade = ()=>{
			setTimeout(function(){
			document.querySelector(`.itemCaptions${selectedIndex}`).classList.add("hideIndicators");
			document.querySelector(".carousel-indicators").classList.add("hideIndicators");

			}, delay);
		};
		fade();
		
		document.querySelector(`.itemCaptions${selectedIndex}`).addEventListener("mouseenter", function(e){
			document.querySelector(`.itemCaptions${selectedIndex}`).classList.remove("hideIndicators");
			document.querySelector(".carousel-indicators").classList.remove("hideIndicators");
		});
		document.querySelector(`.itemCaptions${selectedIndex}`).addEventListener("mouseout", function(e){
			fade();
		});
		
	}
	
	componentDidMount(){
		this.getCapitalsWeather();
	}
	
	getCapitalsWeather(){
		fetch("http://localhost:8080/capitals")
			.then(res=>res.json())
			.then(res=>{
				this.setState({
					capitalsWeather: res
				});
			})
			.catch(err=>{
				throw err;
			});
	}
	
	render(){
		let {index, indicators, interval} = this.state;
		return(
		<div className="world">
			<Carousel activeIndex={index} onSelect={(e)=>this.handleSelect(e)} slide={true} indicators={indicators} interval={interval}>
				{maps.map((elem, i)=>{
					return(
						<Carousel.Item className="CItem" key={i}>
							<div className="map" id={`map${0}`}>
								<Map className="maps" capitalsWeather={this.state.capitalsWeather} info={elem == "Weather Map"? "temp":(elem =="Humidity Map"?"humidity":"pressure")} />
								<Carousel.Caption className={`itemCaptions${i}`}>
									<h2 style={{letterSpacing: "0.1em"}}>{elem}</h2>
								</Carousel.Caption>
							</div>
						</Carousel.Item>
					);
				})}
			</Carousel>
		</div>
		);
	}
};

export default World;