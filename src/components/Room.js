import React from "react";
import GameContainer from "./GameContainer";

function Room(props) {
  return (
    <div>
      <br />
      <br />
      {props.room
        ? [
            props.user &&
              props.room.phase === "waiting" &&
              !props.room.users.find(user => user.id === props.user.id) && (
                <button key="join" name="join" onClick={props.onClick}>
                  Join the game
                </button>
              ),
            props.user &&
              props.room.users.find(user => user.id === props.user.id) &&
              props.room.phase === "ready" && (
                <button key="start" name="start" onClick={props.onClick}>
                  Start game
                </button>
              ),
            props.user &&
              props.room.users.find(user => user.id === props.user.id) &&
              (props.room.phase === "started" ||
                props.room.phase === "finished") && (
                <GameContainer
                  roomId={props.room.id}
                  gameId={props.room.games[0].id}
                  key="gameContainer"
                />
              )
          ]
        : "Loading Room"}
    </div>
  );
}

export default Room;
