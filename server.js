
const fs = require("fs");
const path = require("path")
const cors = require("cors");
const express = require("express");

const readline = require('readline');


const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors());

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/capitals", (req, res)=>{
	
	// Open file with capitals' weather data
	fs.readFile("./client/src/data/capitals.weather.json", (err, data)=>{
		if(err)throw err;
		
		// Parse file
		const response = JSON.parse(data);
		
		// Send response
		res.json(response);
	});
});

app.get("/world", (req, res)=>{
	// Open World GeoJSON file
	fs.readFile("./client/src/data/geo-world.json", (err, data)=>{
		if(err) throw err;
		
		//Parse file
		const response = JSON.parse(data);
		// Send response

		res.json(response);
	});
});

app.get("/city", (req, res, next)=>{
	
	const { city, country } = req.query;

	fs.readFile("./client/src/data/countries.list.json", (err, countries)=>{
		if(err)throw err;
		
		countries = JSON.parse(countries);
		
		let code;
		try{
			code = countries.filter(elem=>{
				if(country.toUpperCase() == elem["Name"].toUpperCase() || country.toUpperCase() == elem["Code"]){
					return elem;
				};
			})[0].Code;
			if(code == undefined || !code){
					throw "Oops... Location was not found";
			};
		}catch(err){
			// The error caused here is a runtime error
			// Error sent using string not err
			res.status(404).json({
				message: "Oops... Location was not found"
			});
			next();
			return;
		};
		
		fs.readFile("./client/src/data/city.list.json", (err, cities)=>{
			if(err)throw err;
		
			cities = JSON.parse(cities);
			
			let response;
			try{
				response = cities.filter(elem=>{
					if(elem["country"].toUpperCase() == code.toUpperCase() && elem["name"].toUpperCase() == city.toUpperCase()){
						return elem;
					};
				})[0];
				if(response == undefined || !response){
					throw "Oops... Location was not found";
				};
				
			}catch(err){
				res.status(404).json({
					message: err
				});
				next();
				return;
			};
			res.status(200).json(response);
		});
	});
});

app.get("/findCapital", (req, res)=>{
		fs.readFile("./client/src/data/city.capitals.list.json", (err, data)=>{
			if(err)throw err;
			
			const country = req.query.country;
			// console.log(country)
			
			data = JSON.parse(data);
			const response = data.filter(elem=>{
				if (elem.country.toUpperCase().indexOf(country.toUpperCase()) > -1){
					return elem;
				};
			})[0];

			if(response != undefined) res.send(response);
		})
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
	console.log("Server listening...");
})