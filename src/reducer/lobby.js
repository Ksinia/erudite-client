export default function reducer(state = [], action = {}) {
  switch (action.type) {
    case "ALL_ROOMS": {
      return action.payload;
    }
    case "NEW_ROOM": {
      if (action.payload.oldRoom) {
        return [...state, action.payload.newRoom].map(room => {
          if (room.id === action.payload.oldRoom.id) {
            return action.payload.oldRoom;
          } else {
            return room;
          }
        });
      }
      return [...state, action.payload.newRoom];
    }
    case "UPDATED_ROOMS": {
      return state.map(room => {
        if (action.payload.newRoom && room.id === action.payload.newRoom.id) {
          return action.payload.newRoom;
        } else if (
          action.payload.oldRoom &&
          room.id === action.payload.oldRoom.id
        ) {
          return action.payload.oldRoom;
        } else {
          return room;
        }
      });
    }
    case "UPDATE_GAME": {
      return state.map(room => {
        if (action.payload.id === room.id) {
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
