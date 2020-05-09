import React from "react";
import { Link } from "react-router-dom";

import { Room, User } from "../reducer/types";
import "./RoomTile.css";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  style: any;
  room: Room;
  user: User;
};

function RoomTile(props: OwnProps) {
  const { id, maxPlayers, users, phase, game } = props.room;
  return (
    <Link to={game ? `/game/${game.id}` : `/room/${id}`}>
      <div className="room-tile" style={props.style}>
        <div className="description">
          {phase !== "started" ? (
            <p className="title">
              <TranslationContainer translationKey="room" /> {id} (
              {props.room.language})
            </p>
          ) : (
            <p className="title">
              <TranslationContainer translationKey="game" /> {game.id} (
              {props.room.language})
            </p>
          )}
          {props.user && (
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
                <p key={id}>{users.find((user) => user.id === id)?.name}</p>
              ))
            : users.map((user) => <p key={user.id}>{user.name}</p>)}
        </div>
      </div>
    </Link>
  );
}

export default RoomTile;
