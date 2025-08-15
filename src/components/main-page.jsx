import React, { useCallback } from "react"
import { useStore } from '../store/useStore'
import UserInfo from "./user-info.jsx"
import GenreChart from './pie-chart.jsx'
import Album from "./albums.jsx"
import AudioPlayer from "./audio-player.jsx"
import "../App.css"

const MainPage = () => {
  const { 
    currentDataSet, 
    setCurrentDataSet, 
    playStatus, 
    setPlayStatus, 
    previewURL, 
    setPreviewURL,
    getCurrentDataSet,
    accessToken
  } = useStore()

  const dataSet = getCurrentDataSet()

  const renderAlbums = useCallback((dataSet) => {
    if (!dataSet?.topTracks) return null
    
    const albumsToRender = dataSet.topTracks
    return (
      <div className="container">
        <div className="row">
          {albumsToRender.slice(0, 20).map((track, index) => (
            <div key={track.trackId} className="col-xl-3 col-lg-3 col-md-3 col-sm-6 col-6">
              <Album 
                trackInfo={track} 
                onClickHandler={onClickHandler_Album} 
                onClickOpenInSpotify={openSongInSpotify} 
                accessToken={accessToken}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }, [accessToken])

  const renderInfoAndGraphs = useCallback((dataSet) => {
    if (!dataSet) return null
    
    return (
      <div className="container" style={{paddingBottom: "20px", paddingTop: "20px"}}>
        <div className="row">
          <div className="col" style={{paddingBottom: "10px"}}>
            <UserInfo userDetails={dataSet.user} />
          </div>
          <div className="col" style={{paddingBottom: "10px"}}>
            <GenreChart genreData={dataSet.topArtists}/>
          </div>
        </div>
      </div>
    )
  }, [])

  const onClickHandler = useCallback((timeFrame) => {
    setCurrentDataSet(timeFrame)
  }, [setCurrentDataSet])

  const onClickHandler_Album = useCallback((soundURL) => {
    console.log(soundURL)
    console.log(playStatus)

    if (!(soundURL === previewURL)) {
      setPlayStatus('PLAYING')
    } else {
      if (playStatus === 'PLAYING') {
        setPlayStatus('STOPPED')
      } else {
        setPlayStatus('PLAYING')
      }
    }
    setPreviewURL(soundURL)
  }, [previewURL, playStatus, setPlayStatus, setPreviewURL])

  const openSongInSpotify = useCallback((trackURI) => {
    console.log(accessToken)
    fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {"Authorization": "Bearer " + accessToken},
      body: JSON.stringify({"uris": ["spotify:track:" + trackURI]})
    })
  }, [accessToken])

  const handleAudioEnded = useCallback(() => {
    setPlayStatus('STOPPED')
  }, [setPlayStatus])

  const handleAudioError = useCallback((error) => {
    console.error('Audio error:', error)
    setPlayStatus('STOPPED')
  }, [setPlayStatus])

  if (!dataSet) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your music data...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <AudioPlayer 
        url={previewURL} 
        isPlaying={playStatus === 'PLAYING'}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
      />
      
      <div className="container" style={{paddingBottom: "20px", paddingTop: "20px"}}>
        <div className="row">
          <div className="col">
            <div className="btn-group" role="group" aria-label="Time Range Selection">
              <button 
                type="button" 
                className={`btn ${currentDataSet === 'shortTerm' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onClickHandler('shortTerm')}
              >
                Last 4 Weeks
              </button>
              <button 
                type="button" 
                className={`btn ${currentDataSet === 'mediumTerm' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onClickHandler('mediumTerm')}
              >
                Last 6 Months
              </button>
              <button 
                type="button" 
                className={`btn ${currentDataSet === 'longTerm' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => onClickHandler('longTerm')}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      </div>

      {renderInfoAndGraphs(dataSet)}
      {renderAlbums(dataSet)}
    </div>
  )
}

export default MainPage
