import React, { Component } from "react";
import { connect } from "react-redux";

import superagent from "superagent";
import { url } from "../url";
import "./Game.css";
import Room from "./Room";

class RoomContainer extends Component {
  roomId = parseInt(this.props.match.params.room);

  state = { room: null };

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
        const gameId = response.body.id;
        console.log(gameId);
        this.props.history.push(`/game/${gameId}`);
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

  componentDidMount() {
    if (this.props.rooms && this.props.rooms.length > 0) {
      const room = this.props.rooms.find(el => el.id === this.roomId);
      this.setState({ room: room });
      if (room && room.phase === "started") {
        // backend sends only unfinished game from db
        this.props.history.push(`/game/${room.game.id}`);
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.rooms !== prevProps.rooms) {
      if (this.props.rooms && this.props.rooms.length > 0) {
        const room = this.props.rooms.find(el => el.id === this.roomId);
        this.setState({ room: room });
        if (room && room.phase === "started") {
          this.props.history.push(`/game/${room.game.id}`);
        }
      }
    }
  }

  render() {
    return (
      <div>
        <Room
          room={this.state.room}
          onClick={this.onClick}
          user={this.props.user}
        />
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
