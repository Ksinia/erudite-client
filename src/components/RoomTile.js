import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RoomTile.css";

class RoomTile extends Component {
  render() {
    const { id, name, maxPlayers, users, phase } = this.props.room;
    return (
      <Link to={`/room/${id}`}>
        <div className="room-tile" style={this.props.style}>
          <div className="description">
            <p className="title">{name}</p>
            {phase === "waiting" && <p>Waiting for players</p>}
            {phase === "ready" && <p>Ready for the game</p>}
            {phase === "started" && <p>Game started</p>}
            {phase === "finished" && <p>Game finished</p>}
            {/* {maxPlayers > users.length ? (
              <p>Waiting for players</p>
            ) : (
              <p>Ready for the game</p>
            )} */}
            <p>
              {users.length} of {maxPlayers} players in the game
            </p>
          </div>
          <div className="players">
            <p>Current players: </p>
            {users.length > 0 &&
              users.map(user => {
                return <p key={user.id}>{user.name}</p>;
              })}
          </div>
        </div>
      </Link>
    );
  }
}

export default RoomTile;
