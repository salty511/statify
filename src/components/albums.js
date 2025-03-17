import React, { Component } from "react"
import "./albums-style.css"
const spotifyPreviewFinder = require('./preview-finder.js');

class Album extends Component {
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
                    try {
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
                    }
                }}
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
