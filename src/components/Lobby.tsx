import React from "react";

import { User, Game } from "../reducer/types";
import RoomTile from "./RoomTile";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  onChange: (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSubmit: (event: React.SyntheticEvent) => Promise<void>;
  values: { maxPlayers: number; language: string };
  userTurnGames: Game[];
  otherTurnGames: Game[];
  userWaitingGames: Game[];
  otherWaitingGames: Game[];
  otherGames: Game[];
  user: User;
  sendingFormEnabled: boolean;
};

function Lobby(props: OwnProps) {
  return (
    <div>
      <p>
        <TranslationContainer translationKey="create_room" />
      </p>
      {props.user && (
        <form onSubmit={props.onSubmit}>
          <label htmlFor="maxPlayers">
            {" "}
            <TranslationContainer translationKey="qty" />
          </label>
          <input
            id="maxPlayers"
            type="number"
            min="2"
            max="8"
            name="maxPlayers"
            onChange={props.onChange}
            value={props.values.maxPlayers}
          ></input>
          <label htmlFor="language">
            {" "}
            <TranslationContainer translationKey="language" />
          </label>
          <select
            name="language"
            onChange={props.onChange}
            value={props.values.language}
          >
            <option value="ru">ru</option>
            <option value="en">en</option>
          </select>

          <button disabled={!props.sendingFormEnabled}>
            <TranslationContainer translationKey="submit" />
          </button>
        </form>
      )}
      {props.userTurnGames.length > 0 && [
        <p key="userTurnRoomsTitle">
          <TranslationContainer translationKey="your_turn_games" />
        </p>,
        <div key="userTurnRooms" className="rooms">
          {props.userTurnGames.map((game) => (
            <div className="room" key={game.id}>
              <RoomTile room={game} user={props.user} />
            </div>
          ))}
        </div>,
      ]}
      {props.otherTurnGames.length > 0 && [
        <p key="otherTurnRoomsTitle">
          <TranslationContainer translationKey="your_other_games" />
        </p>,
        <div key="otherTurnRooms" className="rooms">
          {props.otherTurnGames.map((game) => (
            <div className="room" key={game.id}>
              <RoomTile room={game} user={props.user} />
            </div>
          ))}
        </div>,
      ]}
      {props.userWaitingGames.length > 0 && [
        <p key="userWaitingRoomsTitle">
          <TranslationContainer translationKey="your_rooms" />
        </p>,
        <div key="userWaitingRooms" className="rooms">
          {props.userWaitingGames.map((game) => (
            <div className="room" key={game.id}>
              <RoomTile room={game} user={props.user} />
            </div>
          ))}
        </div>,
      ]}
      {props.otherWaitingGames.length > 0 && [
        <p key="otherWaitingRoomsTitle">
          <TranslationContainer translationKey="available_rooms" />
        </p>,
        <div key="otherWaitingRooms" className="rooms">
          {props.otherWaitingGames.map((game) => (
            <div className="room" key={game.id}>
              <RoomTile room={game} user={props.user} />
            </div>
          ))}
        </div>,
      ]}
      {props.otherGames.length > 0 && [
        <p key="otherRoomsTitle">
          <TranslationContainer translationKey="other_rooms" />
        </p>,
        <div key="otherRooms" className="rooms">
          {props.otherGames.map((game) => (
            <div className="room" key={game.id}>
              <RoomTile room={game} user={props.user} />
            </div>
          ))}
        </div>,
      ]}
    </div>
  );
}

export default Lobby;
