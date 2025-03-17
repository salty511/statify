import React, { Component } from "react";
import UserInfo from "./user-info";
import GenreChart from './pie-chart';
import AudioFeaturesChart from './radar-chart';
import Album from "./albums";
import "../App.css"
import Sound from "react-sound"

class MainPage extends Component {
    constructor(){
      super()
      this.state = {
        currentDataSet: "mediumTerm",
        playStatus: Sound.status.STOPPED,
        previewURL: null
      }
      this.onClickHandler = this.onClickHandler.bind(this)
      this.onClickHandler_Album = this.onClickHandler_Album.bind(this)
      this.openSongInSpotify = this.openSongInSpotify.bind(this)
    }

    renderAlbums(dataSet) {
      let albumsToRender = dataSet.topTracks
      return(
        <div className="container">
          <div className="row">
            {albumsToRender.slice(0, 20).map((track) => {
              return (<div className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6"><Album trackInfo={track} onClickHandler={this.onClickHandler_Album} onClickOpenInSpotify={this.openSongInSpotify}/></div>)
            })}
          </div>
        </div>
      )
    }

    renderInfoAndGraphs(dataSet) {
      return(
        <div className="container" style={{paddingBottom: "20px", paddingTop: "20px"}}>
          <div className="row">
            <div className="col" style={{paddingBottom: "10px"}}>
              <UserInfo userDetails={dataSet.user} />
            </div>
            <div className="col" style={{paddingBottom: "10px"}}>
              <GenreChart genreData={dataSet.topArtists}/>
            </div>
            {/* <div className="col">
              <AudioFeaturesChart audioFeaturesData={dataSet.audioFeatures}/>
            </div> */}
          </div>
        </div>
      )
    }

    setCurrentDataSet() {
      switch(this.state.currentDataSet) {
        case "mediumTerm": 
          return(this.props.mediumTerm ? this.props.mediumTerm : null)
        case "shortTerm": 
          return(this.props.shortTerm)
        case "longTerm": 
          return(this.props.longTerm)
        default: break
      }
    }

    onClickHandler(timeFrame) {
      this.setState({currentDataSet: timeFrame})
    }

    onClickHandler_Album(soundURL) {
      if (!(soundURL === this.state.previewURL)) {
        this.setState({playStatus: Sound.status.PLAYING})
      }
      else {
        if(this.state.playStatus === Sound.status.PLAYING) {
          this.setState({playStatus: Sound.status.STOPPED})
        }
        else {
          this.setState({playStatus: Sound.status.PLAYING})
        }
      }
      this.setState({previewURL: soundURL})
    }

    openSongInSpotify(trackURI) {
      console.log(this.props.accessToken)
      fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {"Authorization": "Bearer " + this.props.accessToken},
        body: JSON.stringify({"uris": ["spotify:track:" + trackURI]})
      })
    }
    
    render() {
      let dataSetToRender = this.setCurrentDataSet()
      return (
        <div className="App">
          <Sound 
            url={this.state.previewURL} 
            playStatus={this.state.playStatus} 
            onFinishedPlaying={() => this.setState({playStatus: Sound.status.STOPPED})}
            volume={50}
          />
          <h3 style={{paddingTop: "20px"}}>Main Stats</h3>
          <div className="container" style={{paddingTop: "5px"}}>
            <div>
              <button className="btn btn-outline-info" onClick={() => this.onClickHandler("shortTerm")} style={{margin: "10px"}}>Short Term</button>
              <button className="btn btn-outline-info" onClick={() => this.onClickHandler("mediumTerm")} style={{margin: "10px"}}>Medium Term</button>
              <button className="btn btn-outline-info" onClick={() => this.onClickHandler("longTerm")} style={{margin: "10px"}}>Long Term</button>
            </div>
          </div>
          {!this.props.accessToken ? <p className="text-warning">Error: can't get server data, you may not be logged in or auth token has expired, try loggin in again</p> :
            <div>
              {dataSetToRender ?
                <div>
                  {this.renderInfoAndGraphs(dataSetToRender)}
                  <h3>Your Top 20 Tracks</h3>
                  <div style={{paddingTop: "15px"}}>{this.renderAlbums(dataSetToRender)}</div>
                </div> : <p>Loading</p>}
            </div>}
        </div>
      );
    }
  }
  
  export default MainPage;