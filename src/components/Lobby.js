import React from "react";
import RoomTile from "./RoomTile";
import { colors } from "../colors";

function Lobby(props) {
  const rooms =
    props.rooms &&
    props.rooms.reduce(
      (allRooms, room) => {
        const roomDiv = (
          <div className="room" key={room.id}>
            <RoomTile
              style={{ background: colors[room.id % colors.length] }}
              room={room}
            />
          </div>
        );
        if (
          props.user &&
          room.phase === "started" &&
          room.users.find(user => user.id === props.user.id)
        ) {
          allRooms.currentStarted.push(roomDiv);
        } else if (
          props.user &&
          room.phase === "waiting" &&
          room.users.find(user => user.id === props.user.id)
        ) {
          allRooms.currentWaiting.push(roomDiv);
        } else {
          allRooms.other.push(roomDiv);
        }
        return allRooms;
      },
      { currentStarted: [], currentWaiting: [], other: [] }
    );

  // const rooms = props.rooms && (
  //   <div className="rooms">
  //     {props.rooms.map(room => (
  //       <div className="room" key={room.id}>
  //         <RoomTile
  //           style={{ background: colors[room.id % colors.length] }}
  //           room={room}
  //         />
  //       </div>
  //     ))}
  //   </div>
  // );

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
      {rooms.currentStarted.length > 0 && [
        <p>Your current games:</p>,
        <div className="rooms">{rooms.currentStarted}</div>
      ]}
      {rooms.currentWaiting.length > 0 && [
        <p>Your rooms</p>,
        <div className="rooms">{rooms.currentWaiting}</div>
      ]}
      {rooms.other.length > 0 && [
        <p>Other rooms</p>,
        <div className="rooms">{rooms.other}</div>
      ]}
    </div>
  );
}

export default Lobby;
