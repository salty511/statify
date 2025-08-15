import React from "react"

const Album = ({ trackInfo, onClickHandler, onClickOpenInSpotify, accessToken }) => {
  const handlePlayClick = () => {
    if (trackInfo.previewURL) {
      onClickHandler(trackInfo.previewURL)
    }
  }

  return (
    <div className="card mb-3" style={{ height: '100%' }}>
      <div className="card-body d-flex flex-column">
        {trackInfo.image && (
          <div className="img-preview-button position-relative mb-3">
            <img 
              src={trackInfo.image} 
              alt={`${trackInfo.trackName} album cover`}
              className="card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
            />
            {trackInfo.previewURL && (
              <button 
                className="preview-button btn btn-sm btn-outline-primary"
                onClick={handlePlayClick}
              >
                Preview
              </button>
            )}
          </div>
        )}
        
        <div className="flex-grow-1">
          <h6 className="card-title" style={{ fontSize: '0.9rem' }}>
            {trackInfo.trackName}
          </h6>
          <p className="card-text text-muted" style={{ fontSize: '0.8rem' }}>
            {trackInfo.artistName}
          </p>
          <p className="card-text text-muted" style={{ fontSize: '0.8rem' }}>
            {trackInfo.albumName}
          </p>
        </div>
        
        <div className="mt-auto">
          {trackInfo.previewURL && (
            <button 
              className="btn btn-sm btn-outline-primary me-2"
              onClick={handlePlayClick}
            >
              ▶️ Preview
            </button>
          )}
        
        </div>
      </div>
    </div>
  )
}

export default Album
