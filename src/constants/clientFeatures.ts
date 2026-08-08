/**
 * What this build can handle, sent to the server on every request through
 * the X-Client-Features header and on the socket with ADD_USER_TO_SOCKET.
 * The server keeps back anything a client did not ask for, so an older
 * build is never handed a game it cannot draw.
 */
export const INFINITE_BOARD_FEATURE = 'infinite-board';

export const CLIENT_FEATURES = [INFINITE_BOARD_FEATURE];

export const CLIENT_FEATURES_HEADER = 'X-Client-Features';

export const clientFeaturesHeader = (): { [key: string]: string } => ({
  [CLIENT_FEATURES_HEADER]: CLIENT_FEATURES.join(','),
});
