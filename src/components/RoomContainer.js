import React, { Component } from "react";
import { connect } from "react-redux";

import superagent from "superagent";
import { url } from "../url";
import "./Game.css";
import Room from "./Room";

class RoomContainer extends Component {
  roomId = this.props.match.params.room;

  onClick = async event => {
    let newRoomId = null;
    if (event.target.name === "join") {
      newRoomId = this.roomId;
    }
    if (event.target.name === "start") {
      try {
        const response = await superagent
          .post(`${url}/start`)
          .set("Authorization", `Bearer ${this.props.user.jwt}`)
          .send({ roomId: this.roomId });
        console.log("response test: ", response);
      } catch (error) {
        console.warn("error test:", error);
      }
    } else {
      try {
        const response = await superagent
          .put(`${url}/join`)
          .set("Authorization", `Bearer ${this.props.user.jwt}`)
          .send({ newRoomId });
        console.log("response test: ", response);
      } catch (error) {
        console.warn("error test:", error);
      }
    }
  };

  render() {
    return (
      <div>
        {/* {this.props.rooms && this.props.user ? ( */}
        <Room
          room={this.props.rooms.find(room => room.id == this.roomId)}
          onClick={this.onClick}
          user={this.props.user}
        />
        {/* // ) : (
        //   "Loading Room Container"
        // )} */}
      </div>
    );
  }
}

function MapStateToProps(state) {
  return {
    user: state.user,
    rooms: state.lobby
  };
}
export default connect(MapStateToProps)(RoomContainer);
