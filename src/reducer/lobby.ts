import { AnyAction } from "redux";
import { Room } from "./types";

export default function reducer(state: Room[] = [], action: AnyAction) {
  switch (action.type) {
    case "ALL_ROOMS": {
      return action.payload;
    }
    case "NEW_ROOM": {
      return [...state, action.payload];
    }
    case "UPDATED_ROOM": {
      return state.map((room) => {
        if (room.id === action.payload.id) {
          return action.payload;
        } else {
          return room;
        }
      });
    }
    default:
      return state;
  }
}
