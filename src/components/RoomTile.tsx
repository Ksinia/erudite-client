import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./RoomTile.css";
import TranslationContainer from "./Translation/TranslationContainer";

type Props = {
  style;
  room;
  userTurn;
};

class RoomTile extends Component<Props> {
  render() {
    const { id, maxPlayers, users, phase, game } = this.props.room;
    return (
      <Link to={game ? `/game/${game.id}` : `/room/${id}`}>
        <div className="room-tile" style={this.props.style}>
          <div className="description">
            {phase !== "started" ? (
              <p className="title">
                <TranslationContainer translationKey="room" /> {id} (
                {this.props.room.language})
              </p>
            ) : (
              <p className="title">
                <TranslationContainer translationKey="game" /> {game.id} (
                {this.props.room.language})
              </p>
            )}
            {this.props.userTurn && (
              <h3>
                <TranslationContainer translationKey="your_turn" />
              </h3>
            )}
            {phase === "waiting" && (
              <p>
                <TranslationContainer translationKey="waiting" />
              </p>
            )}
            {phase === "ready" && (
              <p>
                <TranslationContainer translationKey="ready" />
              </p>
            )}
            {phase === "waiting" && (
              <p>
                {users.length} {<TranslationContainer translationKey="of" />}{" "}
                {maxPlayers}{" "}
                {<TranslationContainer translationKey="players_in_game" />}
              </p>
            )}
          </div>
          <div className="players">
            <p>
              <TranslationContainer translationKey="players" />{" "}
            </p>
            {users.length > 0 && phase === "started"
              ? game.turnOrder.map((id) => (
                  <p key={id}>{users.find((user) => user.id === id).name}</p>
                ))
              : users.map((user) => <p key={user.id}>{user.name}</p>)}
          </div>
        </div>
      </Link>
    );
  }
}

export default RoomTile;
