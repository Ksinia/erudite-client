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

function getActiveUserName(game: Game): string {
  const { phase, users, turnOrder, turn } = game;
  if (phase === "turn") {
    const user = users.find((user) => user.id === turnOrder[turn]);
    if (user) {
      return user.name;
    }
  }
  if (phase === "validation") {
    const user = users.find(
      (user) => user.id === turnOrder[(turn + 1) % turnOrder.length]
    );
    if (user) {
      return user.name;
    }
  }
  return "";
}

function RoomTile(props: OwnProps) {
  const { id, maxPlayers, users, phase, language, turnOrder } = props.room;
  return (
    <Link to={`/game/${id}`}>
      <div className="room-tile">
        <div className="tile-header" style={props.style}>
          <p className="number">{id}</p>
          <p className="status">
            {phase === "waiting" && (
              <TranslationContainer
                translationKey="waiting_for"
                args={[String(maxPlayers - users.length)]}
              />
            )}
            {phase === "ready" && (
              <TranslationContainer translationKey="ready" />
            )}
            {props.userTurn ? (
              <TranslationContainer translationKey="your_turn" />
            ) : (
              getActiveUserName(props.room)
            )}
          </p>
          <p className="language">
            {language.toUpperCase()}
            <br />
            {maxPlayers}
          </p>
        </div>
        <div className="tile-body">
          <p>
            {turnOrder
              ? turnOrder
                  .map((userId) =>
                    users
                      .find((user) => user.id === userId)
                      ?.name.replace(" ", " ")
                  )
                  .join(" • ")
              : // replace space with U+00A0, non-breaking space
                users.map((user) => user.name.replace(" ", " ")).join(" • ")}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default RoomTile;
