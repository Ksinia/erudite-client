import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RoomTile.css";

class RoomTile extends Component {
  render() {
    const { id, maxPlayers, users, phase, game } = this.props.room;
    return (
      <Link to={game ? `/game/${game.id}` : `/room/${id}`}>
        <div className="room-tile" style={this.props.style}>
          <div className="description">
            {phase !== "started" ? (
              <p className="title">Room {id}</p>
            ) : (
              <p className="title">Game {game.id}</p>
            )}
            {this.props.userTurn && <h3>It's your turn!</h3>}
            {phase === "waiting" && <p>Waiting for players</p>}
            {phase === "ready" && <p>Ready for the game</p>}
            <p>
              {phase === "waiting" &&
                `${users.length} of ${maxPlayers} players in the game`}
            </p>
          </div>
          <div className="players">
            <p>Players: </p>
            {users.length > 0 && phase === "started"
              ? game.turnOrder.map(id => (
                  <p key={id}>{users.find(user => user.id === id).name}</p>
                ))
              : users.map(user => <p key={user.id}>{user.name}</p>)}
          </div>
        </div>
      </Link>
    );
  }
}

export default RoomTile;
