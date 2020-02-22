import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Board from "./Board";
// import superagent from "superagent";
// import { url } from "../url";
import "./RoomDetailsPage.css";

class RoomDetailsPage extends Component {
  roomId = this.props.match.params.room;

  render() {
    const room = this.props.rooms.find(room => room.id == this.roomId);
    console.log("room:", room);
    const turnUser =
      this.props.user &&
      room.users.find(user => {
        return user.id == room.turn;
      });

    return <Board />;
  }
}
function MapStateToProps(state) {
  return {
    user: state.user,
    rooms: state.lobby
  };
}
export default connect(MapStateToProps)(RoomDetailsPage);
