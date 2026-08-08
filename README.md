# :pencil2: Erudite game :pencil2: [![Netlify Status](https://api.netlify.com/api/v1/badges/f940aa5f-74b8-4fad-b4bf-7914c30f8d34/deploy-status)](https://app.netlify.com/sites/erudit/deploys)

This is the frontend of Erudite game application.
[Here is the backend](https://github.com/Ksinia/erudite-server).

## [Check out the deployed version here!](https://erudit.ksinia.net)

This is a Russian Scrabble-like game which is made in accordance with the rules of the board version.
[Rules in Russian can be found here.](https://www.mosigra.ru/image/data/mosigra.product.other/399/712/erudit.pdf)

## Installation

- Clone the repository
- Run npm install
  ```
  npm install
  ```

The frontend sends requests to the backend deployed to [Heroku](https://k-erudite.herokuapp.com).

If you want to install backend for this app:

- Clone [this repository](https://github.com/Ksinia/erudite-server)
- Run npm install for the backend
- Set up PostgreSQL database

## Infinite board mode

When the server enables the feature for the logged-in user, the new game form offers a board type selector: classic 15x15 or infinite. The client tells the server what it can handle through the `X-Client-Features` header and the socket handshake, and receives infinite boards as their occupied cells, which it expands back into a grid; a build that does not declare the feature is simply never offered such a game. An infinite board grows as words approach its edges and is rendered in a scrollable viewport that keeps its position when the board expands. The bonus pattern repeats across the board and the start star marks the centre of the original field.

## Technologies used

- react
- redux
- web sockets
