import React from "react";
import RoomTile from "./RoomTile";
import { colors } from "../colors";

function Lobby(props) {
  const rooms = props.rooms && (
    <div className="rooms">
      {props.rooms.map(room => (
        <div className="room" key={room.id}>
          <RoomTile
            style={{ background: colors[room.id % colors.length] }}
            room={room}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <p>Please create a new room or enter existing room.</p>
      {props.user && (
        <form onSubmit={props.onSubmit}>
          <label htmlFor="maxPlayers">
            {" "}
            Please specify the quantity of players (from 2 to 4):{" "}
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
      <div>{rooms}</div>
    </div>
  );
}

export default Lobby;
