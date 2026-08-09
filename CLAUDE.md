# Erudite web client

## Talking to the server

The server withholds anything this build has not said it can handle, so
every request to a game endpoint must carry the capability header:

```ts
superagent.post(`${backendUrl}/start/${id}`).set(clientFeaturesHeader());
```

The endpoints that check it today are `/create`, `/join/:id`, `/start/:id`,
`GET /game/:id`, `/game/:id/turn`, `/my/finished-games` and
`/my/archived-games`, plus the socket, which sends the same list in the
`features` field of `ADD_USER_TO_SOCKET`. Forgetting the header on one of
them does not fail loudly: the server answers as if the game were not
there, so a button appears to do nothing. When adding a call, add the
header, and check the whole set at once:

```
grep -rn 'backendUrl}/' src
```

## Errors and the session

`errorFromServer` ends the session for a 401 and for the login and signup
context, and for nothing else. An error from the server is not a statement
about the session, so the auth reducer no longer clears the user on every
error — a dropped connection used to sign the player out silently and make
the next request anonymous.
