import React from "react";
import Svg, { Path } from "react-native-svg";

// Css
import "./wave.css";

function Wave (props){
	return (
		<div className="wave-bg">
			<Svg viewBox="0 0 1440 320">
				<Path
					d="M0 64l30 16c30 16 90 48 150 42.7 60-5.7 120-47.7 180-32C420 107 480 181 540 176S660 85 720 58.7c60-26.7 120 5.3 180 48 60 42.3 120 96.3 180 112 60 16.3 120-5.7 180-48C1320 128 1380 64 1410 32l30-32v320H0z"
				/>
			</Svg>
		</div>
	);
};

export default Wave;