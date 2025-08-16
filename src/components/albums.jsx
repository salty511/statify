import React from "react"
import axios from "axios";
import * as cheerio from "cheerio";
import SpotifyWebApi from "spotify-web-api-node";

const Album = ({ trackInfo, onClickHandler, accessToken }) => {
  async function getSpotifyLinks(url) {
    const scraper = process.env.VITE_SCRAPER_URL || "http://localhost:9000/.netlify/functions/api/scrape"
    try {
      const response = await axios.get(scraper, {
        headers: {
          url
        }
      })
      const html = response.data;
      const $ = cheerio.load(html);
      const scdnLinks = new Set();
  
      $('*').each((i, element) => {
        const attrs = element.attribs;
        Object.values(attrs).forEach(value => {
          if (value && value.includes('p.scdn.co')) {
            scdnLinks.add(value);
          }
        });
      });
  
      return Array.from(scdnLinks);
    } catch (error) {
      throw new Error(`Failed to fetch preview URLs: ${error.message}`);
    }
  }
  
  /**
   * Search for songs and get their preview URLs
   * @param {string} songName - The name of the song to search for
   * @param {number} [limit=5] - Maximum number of results to return
   * @returns {Promise<Object>} Object containing success status and results
   */
  async function searchAndGetLinks(songName, limit = 5) {
    try {
      if (!songName) {
        throw new Error('Song name is required');
      }
  
      const spotifyApi = new SpotifyWebApi()
      spotifyApi.setAccessToken(accessToken);
      
      const searchResults = await spotifyApi.searchTracks(songName);
      
      if (searchResults.body.tracks.items.length === 0) {
        return {
          success: false,
          error: 'No songs found',
          results: []
        };
      }
  
      const tracks = searchResults.body.tracks.items.slice(0, limit);
      const results = await Promise.all(tracks.map(async (track) => {
        const spotifyUrl = track.external_urls.spotify;
        const previewUrls = await getSpotifyLinks(spotifyUrl);
        return {
          name: `${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`,
          spotifyUrl: spotifyUrl,
          previewUrls: previewUrls
        };
      }));
  
      return {
        success: true,
        results: results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  return (
    <div style={{ paddingBottom: "10px" }}>
      <div className="card">
      {trackInfo.image && (
        <div className="img-preview-button">
          <img className="card-img-top" src={trackInfo.image} alt={`${trackInfo.trackName} album cover`} />
          <div className="preview-button">
            <span
              className="btn-success albumButton"
              style={{ padding: "10px" }}
              onClick={async () => {
                  try {
                    // Search for multiple songs
                    const previewURL = await searchAndGetLinks(trackInfo.trackName, 1)
                    if (previewURL.success && previewURL.results.length > 0) {
                      const song = previewURL.results[0]
                      console.log(`\nFound: ${song.name}`)
                      console.log(`Preview URL: ${song.previewUrls[0]}`)
                      onClickHandler(song.previewUrls[0])
                    }
                  } catch (error) {
                    console.error('Error:', error.message)
                  }
              }
            }
            >
              Preview
            </span>
          </div>
        </div>)}
        <div className="card-body">
          <h5 className="card-title">{trackInfo.trackName}</h5>
          <h6 className="card-subtitle">
            {trackInfo.artistName} - {trackInfo.albumName}
          </h6>
        </div>
      </div>
    </div>
  )
}

export default Album
