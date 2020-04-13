import React, { Component } from "react";
import superagent from "superagent";
import { url } from "../url";
import Lobby from "./Lobby";
import { connect } from "react-redux";

class LobbyContainer extends Component {
  state = {
    maxPlayers: 2,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await superagent
        .post(`${url}/room`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send(this.state);
      console.log("response test: ", response);
      this.props.history.push(`/room/${response.body.id}`);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
    document.title = `Erudite`;
  }
  render() {
    const rooms = this.props.lobby.reduce(
      (allRooms, room) => {
        if (
          this.props.user &&
          room.users.find((user) => user.id === this.props.user.id) &&
          room.phase === "started"
        ) {
          if (
            (room.game.phase === "turn" &&
              this.props.user.id === room.game.turnOrder[room.game.turn]) ||
            (room.game.phase === "validation" &&
              room.game.validated === "unknown" &&
              this.props.user.id ===
                room.game.turnOrder[
                  (room.game.turn + 1) % room.game.turnOrder.length
                ]) ||
            (room.game.phase === "validation" &&
              room.game.validated === "no" &&
              this.props.user.id === room.game.turnOrder[room.game.turn])
          ) {
            allRooms.userTurn.push(room);
          } else {
            allRooms.otherTurn.push(room);
          }
        } else if (
          this.props.user &&
          (room.phase === "waiting" || room.phase === "ready") &&
          room.users.find((user) => user.id === this.props.user.id)
        ) {
          allRooms.userWaiting.push(room);
        } else if (room.phase === "waiting") {
          allRooms.otherWaiting.push(room);
        } else {
          allRooms.other.push(room);
        }
        return allRooms;
      },
      {
        userTurn: [],
        otherTurn: [],
        userWaiting: [],
        otherWaiting: [],
        other: [],
      }
    );

    return (
      <Lobby
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.state}
        userTurnRooms={rooms.userTurn}
        otherTurnRooms={rooms.otherTurn}
        userWaitingRooms={rooms.userWaiting}
        otherWaitingRooms={rooms.otherWaiting}
        otherRooms={rooms.other}
        user={this.props.user}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    lobby: state.lobby,
    user: state.user,
  };
}
export default connect(mapStateToProps)(LobbyContainer);
