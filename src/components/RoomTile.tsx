import React from "react";
import { Link } from "react-router-dom";

import { User, Game } from "../reducer/types";
import "./RoomTile.css";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  style: { background: string };
  room: Game;
  user: User;
  userTurn: boolean;
};

function RoomTile(props: OwnProps) {
  const { id, maxPlayers, users, phase, language, turnOrder } = props.room;
  return (
    <Link to={`/game/${id}`}>
      <div className="room-tile" style={props.style}>
        <div className="description">
          {
            <p className="title">
              <TranslationContainer translationKey="game" /> {id} ({language})
            </p>
          }
          {props.userTurn && (
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
            ? turnOrder.map((userId) => (
                <p key={userId}>
                  {users.find((user) => user.id === userId)?.name}
                </p>
              ))
            : users.map((user) => <p key={user.id}>{user.name}</p>)}
        </div>
      </div>
    </Link>
  );
}

export default RoomTile;
