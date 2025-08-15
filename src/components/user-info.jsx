import React from "react"

const UserInfo = ({ userDetails }) => {
  if (!userDetails) {
    return (
      <div className="text-center">
        <p>Loading user information...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-body text-center">
        {userDetails.profileImage && (
          <img 
            src={userDetails.profileImage} 
            alt="Profile" 
            className="rounded-circle mb-3"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
        )}
        <h5 className="card-title">{userDetails.userName}</h5>
        <p className="card-text">
          <strong>{userDetails.followers}</strong> followers
        </p>
      </div>
    </div>
  )
}

export default UserInfo
