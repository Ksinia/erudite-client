import React from "react";

function Room(props) {
  let waitingFor = 0;
  if (props.room) {
    waitingFor = props.room.maxPlayers - props.room.users.length;
  }

  return (
    <div>
      {props.room
        ? [
            <p key="room-for">Room for {props.room.maxPlayers} players</p>,
            props.room.users.length > 0 ? (
              [
                <p key="users">Players already in the room: </p>,
                props.room.users.map(user => (
                  <div key={user.id}>{user.name}</div>
                ))
              ]
            ) : (
              <p>No users in this room</p>
            ),
            waitingFor > 0 && (
              <p key="waiting">Waiting for {waitingFor} more players</p>
            ),
            !props.user ? (
              <p key="message">Please log in to join the game</p>
            ) : (
              [
                props.room.phase === "waiting" &&
                  !props.room.users.find(user => user.id === props.user.id) && (
                    <button key="join" name="join" onClick={props.onClick}>
                      Join the game
                    </button>
                  ),
                props.room.users.find(user => user.id === props.user.id) &&
                  props.room.phase === "ready" && (
                    <button key="start" name="start" onClick={props.onClick}>
                      Start game
                    </button>
                  )
              ]
            )
          ]
        : props.room === undefined
        ? "No such room"
        : "Loading Room"}
    </div>
  );
}

export default Room;
