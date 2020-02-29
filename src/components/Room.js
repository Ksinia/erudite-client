import React from "react";

function Room(props) {
  return (
    <div>
      {props.room
        ? [
            props.room.users.length > 0 ? (
              [
                <p key="users">Users in this room: </p>,
                props.room.users.map(user => (
                  <div key={user.id}>{user.name}</div>
                ))
              ]
            ) : (
              <p>No users in this room</p>
            ),
            !props.user ? (
              <p key="message">Please log in to join the game</p>
            ) : (
              props.room.phase === "waiting" &&
              !props.room.users.find(user => user.id === props.user.id) && (
                <button key="join" name="join" onClick={props.onClick}>
                  Join the game
                </button>
              )
            ),
            props.room.users.find(user => user.id === props.user.id) &&
              props.room.phase === "ready" && (
                <button key="start" name="start" onClick={props.onClick}>
                  Start game
                </button>
              )
          ]
        : "Loading Room"}
    </div>
  );
}

export default Room;
