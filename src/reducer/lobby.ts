export interface Room {
  id: number;
  maxPlayers: number;
  language: string;
  createdAt: string;
  updatedAt: string;
  users: Object[];
  game: Object;
}

export type Lobby = Room[];

export default function reducer(state: Lobby = [], action = {}) {
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
