import React, { Component } from "react"
import MainPage from "./components/main-page.js"
import { defaults } from 'react-chartjs-2'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavBar from "./components/nav-bar"
import LoginPage from "./components/login-page";
import queryString from "query-string"
import AboutPage from "./components/about-page"
import AudioFeaturesPage from "./components/audio-features-page"

defaults.global.legend.labels.fontColor = "#EBEBEB";

class App extends Component {
  constructor() {
    super()
    this.state = {}
    this.onClickLogout = this.onClickLogout.bind(this)
  }

  componentDidMount() {
    let parsed = queryString.parse(window.location.search)
    let accessToken = parsed.access_token
    this.setState({accessToken: accessToken})
    this.getServerData(accessToken, "medium_term")
    this.getServerData(accessToken, "short_term")
    this.getServerData(accessToken, "long_term")
  }

  onClickLogout(e) {
    this.setState({accessToken: null})
  }

  getServerData(accessToken, timeRange) {
    let serverData = {}
    let topArtistsCall
    let topTracksAndAudioFeaturesCall
    let userCall
    const maxTopLine = 22
    const maxBottomLine = 25
    if(accessToken) {
      //Get UserInfo data
      if(!this.state.user) {
        console.log(timeRange + ": Making user api call")
        userCall = fetch("https://api.spotify.com/v1/me", {
          headers: {"Authorization": "Bearer " + accessToken}
        }).then((response) => {
          return(response.json())
        }).then((data) => {
          console.log(timeRange + ": User call complete")
          serverData.user = {
            userName: data.display_name,
            profileImage: data.images[0] ? data.images[0].url : null,
            followers: data.followers.total
          }
        })
      }

      //Get TopTracks data
      if(!this.state.topTracks) {
        console.log(timeRange + ": Making topTracks api call")
        topTracksAndAudioFeaturesCall = fetch("https://api.spotify.com/v1/me/top/tracks/?limit=50&time_range=" + timeRange, {
          headers: {"Authorization": "Bearer " + accessToken}
        }).then((response) => {
          return(response.json())
        }).then((data) => {
          console.log(timeRange + ": topTracks call complete")
          serverData.topTracks = data.items.map((trackObject) => {
            if (trackObject.name.length >= maxTopLine){
              trackObject.name = trackObject.name.slice(0, maxTopLine - 3) + "..."
            }
            if ((trackObject.artists[0].name + trackObject.album.name).length >= maxBottomLine) {
              trackObject.album.name = trackObject.album.name.slice(0, (maxBottomLine - trackObject.artists[0].name.length - 3)) + "..."
            }
            return({
              albumName: trackObject.album.name, 
              trackName: trackObject.name, 
              artistName: trackObject.artists[0].name, 
              image: trackObject.album.images[1].url,
              trackId: trackObject.id,
              previewURL: trackObject.preview_url,
              uri: trackObject.uri
            })
          })
        })
      }

      // Get topArtists data
      if(!this.state.topArists) {
        console.log(timeRange + ": Making topArtists call") 
        topArtistsCall = fetch("https://api.spotify.com/v1/me/top/artists/?limit=50&time_range=" + timeRange, {
          headers: {"Authorization": "Bearer " + accessToken}
        }).then((response) => {
          console.log(timeRange + ": topArtists call complete")
          return(response.json())
        }).then((data) => {
          serverData.topArtists = data.items.map((artistObject) => {
            return({
              artistName: artistObject.name,
              genres: artistObject.genres
            })
          })
        })
      }
      Promise.all([topArtistsCall, topTracksAndAudioFeaturesCall, userCall]).then(() => {
        this.setState({[timeRange]: serverData})
      })

    }
  }

  getPreviews(accessToken) {
    
  }

  render() { 
    return (
      <Router>
        <div className="App">
          <NavBar onClickLogout={this.onClickLogout}/>
          <Route exact path="/main" render={(props) => {
            return(
              <MainPage {...props} 
              mediumTerm={this.state.medium_term}
              shortTerm={this.state.short_term}
              longTerm={this.state.long_term}
              accessToken={this.state.accessToken} />
            )
          }} />
          <Route exact path="/" render={(props) => {
            return(
              <LoginPage {...props}
              accessToken={this.state.accessToken && this.state.accessToken} />
            )
          }}/>
          <Route exact path="/audiofeatures" render={(props) => {
            return(
              <AudioFeaturesPage {...props}
              mediumTerm={this.state.medium_term}
              shortTerm={this.state.short_term}
              longTerm={this.state.long_term} />
            )
          }} />
          <Route exact path="/about" component={AboutPage} />
        </div>
      </Router>
    );
  }
}

export default App;
