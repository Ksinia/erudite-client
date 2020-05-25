import React from "react";

import { User, Game as GameType } from "../reducer/types";
import TranslationContainer from "./Translation/TranslationContainer";

type Props = {
  room: GameType | null | undefined;
  user: User;
  onClickStart: () => Promise<void>;
  onClickJoin: () => Promise<void>;
};

function Room(props: Props) {
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
              args={[String(props.room.maxPlayers)]}
            />{" "}
            ({props.room.language})
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
                args={[String(waitingFor)]}
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
                  <button key="join" onClick={props.onClickJoin}>
                    <TranslationContainer translationKey="join" />
                  </button>
                ),
              props.room.users.find((user) => user.id === props.user.id) &&
                props.room.phase === "ready" && (
                  <button key="start" onClick={props.onClickStart}>
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
