import React from "react";
import RoomTile from "./RoomTile";
import { colors } from "../colors";
import TranslationContainer from "./Translation/TranslationContainer";

function Lobby(props) {
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

          <button>
            <TranslationContainer translationKey="submit" />
          </button>
        </form>
      )}
      {props.userTurnRooms.length > 0 && [
        <p key="userTurnRoomsTitle">
          <TranslationContainer translationKey="your_turn_games" />
        </p>,
        <div key="userTurnRooms" className="rooms">
          {props.userTurnRooms.map((room) => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[0] }}
                room={room}
                user={props.user}
                userTurn={true}
              />
            </div>
          ))}
        </div>,
      ]}
      {props.otherTurnRooms.length > 0 && [
        <p key="otherTurnRoomsTitle">
          <TranslationContainer translationKey="your_other_games" />
        </p>,
        <div key="otherTurnRooms" className="rooms">
          {props.otherTurnRooms.map((room) => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[1] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>,
      ]}
      {props.userWaitingRooms.length > 0 && [
        <p key="userWaitingRoomsTitle">
          <TranslationContainer translationKey="your_rooms" />
        </p>,
        <div key="userWaitingRooms" className="rooms">
          {props.userWaitingRooms.map((room) => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[1] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>,
      ]}
      {props.otherWaitingRooms.length > 0 && [
        <p key="otherWaitingRoomsTitle">
          <TranslationContainer translationKey="available_rooms" />
        </p>,
        <div key="otherWaitingRooms" className="rooms">
          {props.otherWaitingRooms.map((room) => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[2] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>,
      ]}
      {props.otherRooms.length > 0 && [
        <p key="otherRoomsTitle">
          <TranslationContainer translationKey="other_rooms" />
        </p>,
        <div key="otherRooms" className="rooms">
          {props.otherRooms.map((room) => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[3] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>,
      ]}
    </div>
  );
}

export default Lobby;
