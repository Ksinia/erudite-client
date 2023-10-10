import {
  ADD_GAME_TO_SOCKET,
  ADD_USER_TO_SOCKET,
  ENTER_LOBBY,
} from '../constants/outgoingMessageTypes';

// this reducer doesn't do anything, but exists just to allow dispatching outgoing message types for socket
// to the store, otherwise TypeScript will complain
export default function reducer(
  state = null,
  action: ADD_GAME_TO_SOCKET | ENTER_LOBBY | ADD_USER_TO_SOCKET
) {
  switch (action.type) {
    default:
      return state;
  }
}
