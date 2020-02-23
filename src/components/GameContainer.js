import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

import superagent from "superagent";
import { url } from "../url";
import "./Game.css";
import Game from "./Game";

class GameContainer extends Component {
  roomId = this.props.match.params.room;

  onClick = async event => {
    // when button name is join, we send current room id,
    // when button name is exit, we send room is as null
    let newRoomId = null;
    console.log(this.roomId);
    if (event.target.name === "join") {
      newRoomId = this.roomId;
    }
    if (event.target.name === "start") {
      console.log("request test: ", { roomId: this.roomId });
      try {
        const response = await superagent
          .put(`${url}/start`)
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
    const room = this.props.rooms.find(el => {
      return el.id == this.roomId;
    });

    //   this.props.user &&
    //   room.users.find(user => {
    //     return user.id == room.turn;
    //   });

    return <Game room={room} onClick={this.onClick} user={this.props.user} />;
  }
}
function MapStateToProps(state) {
  return {
    user: state.user,
    rooms: state.lobby
  };
}
export default connect(MapStateToProps)(GameContainer);
