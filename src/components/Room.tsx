import React from "react";
import TranslationContainer from "./Translation/TranslationContainer";

function Room(props) {
  let waitingFor = 0;
  if (props.room) {
    waitingFor = props.room.maxPlayers - props.room.users.length;
  }

  return (
    <div>
      {props.room ? (
        [
          <p key="room-for">
            <TranslationContainer
              translationKey="room_for"
              args={[props.room.maxPlayers]}
            /> ({props.room.language})
          </p>,
          props.room.users.length > 0 ? (
            [
              <p key="users">
                <TranslationContainer translationKey="players_in_room" />
              </p>,
              props.room.users.map((user) => (
                <div key={user.id}>{user.name}</div>
              )),
            ]
          ) : (
            <p>
              <TranslationContainer translationKey="no_players" />
            </p>
          ),
          waitingFor > 0 && (
            <p key="waiting">
              <TranslationContainer
                translationKey="waiting_for"
                args={[waitingFor]}
              />
            </p>
          ),
          !props.user ? (
            <p key="message">
              <TranslationContainer translationKey="please_log_in" />
            </p>
          ) : (
            [
              props.room.phase === "waiting" &&
                !props.room.users.find((user) => user.id === props.user.id) && (
                  <button key="join" name="join" onClick={props.onClick}>
                    <TranslationContainer translationKey="join" />
                  </button>
                ),
              props.room.users.find((user) => user.id === props.user.id) &&
                props.room.phase === "ready" && (
                  <button key="start" name="start" onClick={props.onClick}>
                    <TranslationContainer translationKey="start" />
                  </button>
                ),
            ]
          ),
        ]
      ) : props.room === undefined ? (
        <TranslationContainer translationKey="no_room" />
      ) : (
        <TranslationContainer translationKey="loading" />
      )}
    </div>
  );
}

export default Room;
