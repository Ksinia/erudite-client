import React from "react";
import RoomTile from "./RoomTile";
import { colors } from "../colors";

function Lobby(props) {
  return (
    <div>
      <p>Please create a new room or enter an existing room.</p>
      {props.user && (
        <form onSubmit={props.onSubmit}>
          <label htmlFor="maxPlayers">
            {" "}
            Please specify the quantity of players:{" "}
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
          <button>Submit</button>
        </form>
      )}
      {props.userTurnRooms.length > 0 && [
        <p key="userTurnRoomsTitle">Your turn</p>,
        <div key="userTurnRooms" className="rooms">
          {props.userTurnRooms.map(room => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[0] }}
                room={room}
                user={props.user}
                userTurn={true}
              />
            </div>
          ))}
        </div>
      ]}
      {props.otherTurnRooms.length > 0 && [
        <p key="otherTurnRoomsTitle">Your other games</p>,
        <div key="otherTurnRooms" className="rooms">
          {props.otherTurnRooms.map(room => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[1] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>
      ]}
      {props.userWaitingRooms.length > 0 && [
        <p key="userWaitingRoomsTitle">Your rooms</p>,
        <div key="userWaitingRooms" className="rooms">
          {props.userWaitingRooms.map(room => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[1] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>
      ]}
      {props.otherWaitingRooms.length > 0 && [
        <p key="otherWaitingRoomsTitle">Available rooms</p>,
        <div key="otherWaitingRooms" className="rooms">
          {props.otherWaitingRooms.map(room => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[2] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>
      ]}
      {props.otherRooms.length > 0 && [
        <p key="otherRoomsTitle">Other rooms</p>,
        <div key="otherRooms" className="rooms">
          {props.otherRooms.map(room => (
            <div className="room" key={room.id}>
              <RoomTile
                style={{ background: colors[3] }}
                room={room}
                user={props.user}
              />
            </div>
          ))}
        </div>
      ]}
    </div>
  );
}

export default Lobby;
