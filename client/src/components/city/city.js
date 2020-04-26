import React, { Component } from "react";

// Css
import "./city.css";
import "../weather-icons/weather-icons.css";

// Components
import Search from "../search/search.js";
import Remove from "../remove/remove.js";
import Celsius from "../celsius/celsius.js";
import Humidity from "../humidity/humidity.js";
import Wind from "../wind/wind.js";
// >> Weather descriptions components
import Cloudy from "../weather-icons/animated/cloudy.js";
import CloudyDay1 from "../weather-icons/animated/cloudyday1.js";
import CloudyDay3 from "../weather-icons/animated/cloudyday3.js";
import CloudyNight1 from "../weather-icons/animated/cloudynight1.js";
import CloudyNight3 from "../weather-icons/animated/cloudynight3.js";
import Day from "../weather-icons/animated/day.js";
import Night from "../weather-icons/animated/night.js";
import RainyDay from "../weather-icons/animated/rainyday.js";
import RainyNight from "../weather-icons/animated/rainynight.js";
import ShowerRain from "../weather-icons/animated/showerrain.js";
import SnowyDay from "../weather-icons/animated/snowyday.js";
import SnowyNight from "../weather-icons/animated/snowynight.js";
import Thunder from "../weather-icons/animated/thunder.js";
import Weather from "../weather-icons/animated/weather.js";
// Object mapping weather description components to their name
// used to get component
const weatherDesc = {
	cloudy: Cloudy,
	cloudyday1: CloudyDay1,
	cloudyday3: CloudyDay3,
	cloudynight1: CloudyNight1,
	cloudynight3: CloudyNight3,
	day: Day,
	night: Night,
	rainyday: RainyDay,
	rainynight: RainyNight,
	showerrain: ShowerRain,
	snowyday: SnowyDay,
	snowynight: SnowyNight,
	thunder: Thunder,
	weather: Weather
};


class City extends Component{
	constructor(props){
		super(props);
		this.state = {
			data: null,
			results: false,
			city: "",
			country: "",
			error: false,
			errorMsg: null,
			success: null,
			description: "",
			temp: null,
			humidity: null,
			wind: null
		};
	}
	
	removeInfo(e){
		this.setState({
			results: false,
			success: null
		});
	}
	
	animateInfo(){
		setTimeout(()=>{
			document.querySelector(".onResults").classList.add("animated-info");
			document.querySelector(".onError").classList.add("animated-info");
		}, 1000);
	}
	
	animateForm(e){
		document.querySelector(".search-form-container form").classList.add("animated-search-form");
		
	}
	
	deanimateForm(e){
		if(!this.state.city)
			document.querySelector(".search-form-container form").classList.remove("animated-search-form");
	}
	
	showErrorModal(){
		this.setState({
			results: true,
			error: true
		});
	}
	
	closeErrorModal(){
		this.setState({
			error: false,
			results: false
		});
	}
	
	handleChange(e){
		if(!this.state.results){
			e.target.getAttribute("placeholder") === "City"?
				this.setState({
					city: e.target.value,
				})
				:
				this.setState({
					country: e.target.value,
				})
		};
		console.log(this.state.city, this.state.country);
	}
	
	getDescriptionIcon(data){
		// find icon name
		let desc;
		switch(data.weather[0].icon){
			case "01d":
				desc = "Day";
				break;
			case "01n":
				desc = "Night";
				break;
			case "02d":
				desc = "CloudyDay1";
				break;
			case "02n":
				desc = "CloudyNight1";
				break;
			case "03d":
				desc = "CloudyDay3";
				break;
			case "03n":
				desc = "CloudyNight3";
				break;
			case "04d":
			case "04n":
				desc = "Cloudy";
				break;
			case "09d":
			case "09n":
				desc = "ShowerRain";
				break;
			case "10d":
				desc = "RainyDay";
				break;
			case "10n":
				desc = "RainyNight";
				break;
			case "11d":
			case "11n":
				desc = "Thunder";
				break;
			case "13d":
				desc = "SnowyDay";
				break;
			case "13n":
				desc = "SnowyNight";
				break;
			default:
				desc = "Weather";
		};
		this.setState({
			description: desc.toLowerCase()
		});
	}
	
	createDescriptionIcon(icon){
		if(icon){
			const component = weatherDesc[icon];
			return React.createElement(component, {});
		};
	}
	
	handleSubmit(e){
		e.preventDefault();
		
		// Get input fields values
		this.setState({
			results: true,
			city: document.querySelector(".search-form-input[placeholder='City']").value,
			country: document.querySelector(".search-form-input[placeholder='Country']").value
		}, async ()=>{
			
			// Get data
			const data = await this.getData(this.state.city, this.state.country);
		
			// Update Info
			this.updateResults(data);	
		});
		
	}
	
	async getData(city, country){
		// Get city Id
		let Status;
		const response = await fetch(`http://localhost:8080/city?city=${city}&country=${country}`)
									.then(res=>{
										Status = res.status;
										return res.json()
									});
		
		// If Location not found
		if(Status !== 200){
			return {
				success: false,
				data: response
			};
		};
		
		// If Location found
		const id = response.id;
		
		// Request data from OpenWeatherApi
		const url = `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${this.props.APIKEY}`;
		const weather = await fetch(url).then(res=>res.json());
		
		return {
			success: true,
			data: weather
		};
	}
	
	updateResults(data){
		const onError = ()=>{
			this.setState({
				results: true,
				success: false,
				error: true,
				errorMsg: data.data.message
			});
		};
		
		const onSuccess = ()=>{
			// this.closeErrorModal();
			this.setState({
				results: true,
				success: true,
				error: false,
				temp: Math.floor(data.data.main.temp - 273.15),
				humidity: data.data.main.humidity,
				wind: data.data.wind.speed
			});
			this.getDescriptionIcon(data.data);
		};
		if(!data.success){
			// If location not found
			onError();
		}else{
			// If Location found
			// Check OpenWeatherApi response
			if(data.data.cod === 200){
				// On success
				onSuccess();
			}else{
				// On error
				onError();
			};		
		};
	}
	
	render(){
	
		return(
			<div className="city">
				{/* Form */}
				<div className={this.state.results ? "search-form-container onResults-search-form-container": "search-form-container" }>
					<form onSubmit={e=>this.handleSubmit(e)} onFocus={e=>this.animateForm(e)} onBlur={e=>this.deanimateForm(e)}>
						<input className="search-form-input" type="text" placeholder="Country" required/>
						<input className="search-form-input" type="text" placeholder="City" required/>
						<button className="search-form-btn" type="submit">
							<Search />
						</button>
					</form>
				</div>
				
				{/* If searched and success */}
				{(this.state.results && this.state.success)?
					<div className="onResults animated-success-info">
						<div className="searched-city">
							<h2>Weather at {this.state.city.toUpperCase()}, {this.state.country.toUpperCase()}</h2>
						</div>
						{/* Div containing delete button */}
						<div className="delete-btn-container">
							<button type="button" onClick={e=>this.removeInfo(e)}><Remove /></button>
						</div>
						<div className="info-container">
						<div className="info info-desc">{this.createDescriptionIcon(this.state.description)}</div>
							<div className="info info-temp"><span>{this.state.temp} <Celsius /></span></div>
							<div className="info info-humd"><span><Humidity /> {this.state.humidity}%</span></div>
							<div className="info info-wind"><span><Wind /> {this.state.wind}</span></div>
						</div>
					</div>
					:
					null
				}
				{/* If error */}
				{ (this.state.results && this.state.error)?	
					<div className="onError">
						<div className="error-modal animated-error-info">
							<div className="error-modal-header">
								<h3 className="error-modal-body text-danger">{this.state.errorMsg}</h3>
								<button type="button" className="close" onClick={()=>this.closeErrorModal()}>
									<span aria-hidden="true">&times;</span>
									<span className="sr-only">Close</span>
								</button>
							</div>
							<div className="error-modal-body">
								<span>
									Please make sure to input a valid location
								</span>
							</div>
						</div>
					</div>
					:
					null
				}
				
			</div>
		);
	}
};

export default City;