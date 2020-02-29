export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case "GAME_UPDATED": {
      return { ...state, [action.payload.gameId]: action.payload.currentGame };
    }
    default:
      return state;
  }
}
