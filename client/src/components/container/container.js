import React from 'react';

// css
import "./container.css";

// Components
import World from "../world/world.js";
import City from "../city/city.js";

function Container (props){
	return(
		<div>
			<section className="content-section world-section">
				<World />
			</section>
			<section className="content-section city-section">
				<City APIKEY={props.APIKEY}/>
			</section>
		</div>
	);
};

export default Container;