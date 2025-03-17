import React, { Component } from "react"
import "./albums-style.css"

import axios from "axios";
const cheerio = require('cheerio');
const SpotifyWebApi = require('spotify-web-api-node');


class Album extends Component {
  async getSpotifyLinks(url) {
    try {
      const response = await axios.get("/.netlify/functions/api/scrape", {
        headers: {
          url
        }
      })
      console.log(response)
      const html = response;
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
  async searchAndGetLinks(songName, limit = 5) {
    try {
      if (!songName) {
        throw new Error('Song name is required');
      }
  
      const spotifyApi = new SpotifyWebApi()
      spotifyApi.setAccessToken(this.props.accessToken);
      
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
      const previewUrls = await this.getSpotifyLinks(spotifyUrl);
        
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

  render() {
    return (
      <div style={{ paddingBottom: "10px" }}>
        <div className="card">
          <div className="img-preview-button">
            <img className="card-img-top" src={this.props.trackInfo.image} alt="Card cap" />
            <div className="preview-button">
              <span
                className="btn-success albumButton"
                style={{ padding: "10px" }}
                onClick={async () => {
                  console.log(await this.searchAndGetLinks(this.props.trackInfo.trackName, 1))
                    /* try {
                      // Search for multiple songs
                      
                      const previewURL = await spotifyPreviewFinder(this.props.trackInfo.trackName, 1)

                      if (previewURL.success && previewURL.results.length > 0) {
                        const song = previewURL.results[0]
                        console.log(`\nFound: ${song.name}`)
                        console.log(`Preview URL: ${song.previewUrls[0]}`)
                        this.props.onClickHandler(song.previewUrls[0])
                      }
                    } catch (error) {
                      console.error('Error:', error.message)
                    } */
                }
              }
              >
                Preview
              </span>
              <p style={{ padding: "10px" }}></p>
              <span
                className="btn-success albumButton"
                style={{ padding: "10px" }}
                onClick={() => {
                  this.props.onClickOpenInSpotify(this.props.trackInfo.trackId)
                }}
              >
                Open Spotify
              </span>
            </div>
          </div>
          <div className="card-body">
            <h5 className="card-title">{this.props.trackInfo.trackName}</h5>
            <h6 className="card-subtitle">
              {this.props.trackInfo.artistName} - {this.props.trackInfo.albumName}
            </h6>
          </div>
        </div>
      </div>
    )
  }
}

export default Album
