import React, { Component } from "react";

class UserInfo extends Component {
  render() {
    return (
    <div className="card" style={{width: "280px", margin: "0 auto"}}>
      <img className="card-img-top" src={this.props.userDetails.profileImage} alt="Profile Picture"/> 
      <div className="card-body">
        <h5 className="card-title">{this.props.userDetails.userName}</h5>
        <p className="card-text">Followers: {this.props.userDetails.followers}</p>
      </div>
    </div>
    );
  }
}

export default UserInfo;
