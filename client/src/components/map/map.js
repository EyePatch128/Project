import React, { Component } from "react";
// import * as d3 from "d3";
import { geoPath }from "d3-geo";
import { geoAitoff }from "d3-geo-projection";
import { feature }from "topojson-client";
// import topojson from "topojson";

// Css
import "./map.css";


class Map extends Component{
	constructor(props){
		super(props);
		// console.log(props);
		this.state = {
			width: 0,
			height: 0,
			geographies : [],
			map: [],
			points: [],
			scale: 400
		};
	}
	
	componentDidMount(){
		// Get svg details
		this.setState({
			width: window.getComputedStyle(document.querySelector(".map"), null).getPropertyValue("width").replace("px", ""),
			height: window.getComputedStyle(document.querySelector(".map"), null).getPropertyValue("height").replace("px", "")
		}, ()=>{
			// Projection
		let projection;
		if(this.props.width <= 720){
			this.setState({
				scale: 200
			})
		}else if(this.props.width <= 1024 && this.props.width > 720){
			this.setState({
				scale: 300
			})
		};
		
			projection = geoAitoff()
								.translate([this.state.width / 1.9, this.state.height / 1.9]);
		
								
								
								
		// Fetch data
		fetch("http://localhost:8080/world")
			.then(res=>res.json())
			.then(data=>{
				// console.log(data);
				this.setState({
					geographies: (feature(data, data.objects.countries).features)
				});
			})
			.then(()=>{
				const countries = this.state.geographies.map((d, i)=>{
						return(
							<g key={`g-${i}`} className={`country-${this.props.info}`} onClick={()=>this.goCountry()}>
								<path 
									key={`path-${d.properties.name}`}
									className={`path-${d.properties.name}`}
									d={geoPath().projection(projection)(d)}
									fill="#fff"
									stroke="#000"
									strokeWidth={0.5}
								/>
							</g>
						);
					});
				this.setState({
					map: countries
				});
			})
			.then(()=>{
				setTimeout(this.animateCountry(), 100);
			})
			.catch(err=>{
				throw err;
			});
		});
	}
	
	goCountry(){
		let offset = document.body.scrollHeight;
		window.scrollTo(0,offset);
	}
	
	animateCountry(){
		const capitals = this.props.capitalsWeather;
		console.log(capitals)
		const targets = document.getElementsByClassName(`country-${this.props.info}`);
		for(let i =0; i < targets.length; i++){
			let elem = targets[i];
			elem.addEventListener("mouseover", async (e)=>{
				// console.log("yayaa");
				let x = e.clientX;
				let y = e.clientY - 10;
				let country = e.target.className.animVal.replace("path-", "");
				let countryInfo = await fetch("http://localhost:8080/findCapital?country="+country).then(res=>res.json());
				let city;
				let cityWeather;
				if(countryInfo.city){
					// console.log(countryInfo)
					capitals.forEach(elem=>{
						if(elem.city.findname == countryInfo.city.toUpperCase()){
							city = elem.city.name;
							if(this.props.info == "temp"){
								cityWeather = (Math.floor(elem.main.temp - 273.15)).toString() + "°C";
							}else if(this.props.info == "pressure"){
								capitals.forEach(elem=>{
									if(elem.city.findname == countryInfo.city.toUpperCase()){
										cityWeather = elem.main["pressure"] + "hPa";
									};
								});
							}else if(this.props.info == "humidity"){
								capitals.forEach(elem=>{
									if(elem.city.findname == countryInfo.city.toUpperCase()){
										cityWeather = elem.main["humidity"] + "%";
									};
								})
							};
						}
					});
				};
				
				document.querySelectorAll(".country-tracker").forEach(elem=>{
					elem.style.display = "block";
					elem.style.top = y.toString() + "px";
					elem.style.left = x.toString() + "px";
					elem.innerHTML = countryInfo.country;
					if(countryInfo.city) elem.innerHTML += "<br>" + countryInfo.city;
				});
				if(cityWeather)
					document.querySelector(`.${this.props.info}-tracker`).innerHTML += "<br>" + cityWeather;
			});
		}
	}
	
	render(){
		return(
		<div className="map-projection">
			<span className={`country-tracker ${this.props.info}-tracker`} onClick={()=>this.goCountry()}></span>
			<svg className="map">
				<g className="countries">
				{	
					this.state.map.map(elem=>elem)
				}
				</g>
				
				<g className="capitals">
				{
					this.state.points.map(elem=>elem)
				}
				</g>
			</svg>
		</div>
		);
	}
	
};

export default Map;