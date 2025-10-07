import { useEffect } from "react";
import { useStore } from "../store/useStore";

export default function SpotifyEmbed({ trackID }) {
	console.log(trackID)
	return (
			<iframe style={{paddingTop: '10px', borderRadius: '12px', width: '80%'}} data-testid="embed-iframe" src={`https://open.spotify.com/embed/track/${trackID}?utm_source=generator`} height="300px" 
				frameBorder="0" allowfullscreen="yes" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
			</iframe>
	);
}