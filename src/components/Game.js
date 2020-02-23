import React from "react";
import Board from "./Board";

function Game(props) {
  return (
    <div>
      <br />
      <br />
      <br />
      {props.room
        ? [
            props.room.users.find(user => user.id === props.user.id) && (
              <button name="exit" onClick={props.onClick}>
                Exit the game
              </button>
            ),
            props.user &&
              !props.room.users.find(user => user.id === props.user.id) &&
              props.room.users.length < props.room.maxPlayers && (
                <button name="join" onClick={props.onClick}>
                  Join the game
                </button>
              ),
            props.room.users.find(user => user.id === props.user.id) &&
              props.room.phase === "ready" && (
                <button name="start" onClick={props.onClick}>
                  Start game
                </button>
              ),
            <Board />
          ]
        : "Loading..."}
    </div>
  );
}

export default Game;
