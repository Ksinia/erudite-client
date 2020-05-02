import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";

import "./Game.css";
import Game from "./Game";
import { url } from "../url";

type Props = {
  games;
  user;
};

class GameContainer extends Component<Props> {
  gameId = this.props.match.params.game;

  gameStream = new EventSource(`${url}/game/${this.gameId}`);

  emptyUserBoard = Array(15)
    .fill(null)
    .map((line) => Array(15).fill(null));

  state = {
    chosenLetterIndex: null,
    userLetters: [],
    userBoard: this.emptyUserBoard.map((row) => row.slice()),
  };

  // extract added letters from whole new hand
  extract = (oldHand: string[], newHand: string[]) => {
    const oldLetters = [...oldHand].sort();
    const newLetters = [...newHand].sort();
    return newLetters.reduce(
      (acc, letter) => {
        if (acc.i === oldLetters.length) {
          acc.letters.push(letter);
          return acc;
        }
        if (letter === oldLetters[acc.i]) {
          acc.i++;
          return acc;
        }
        acc.letters.push(letter);
        return acc;
      },
      { i: 0, letters: [] }
    ).letters;
  };

  clickBoard = (event: React.SyntheticEvent) => {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    // if the cell is occupied by letter
    // do nothing
    // if cell is empty (no letter from server) and chosenLetterIndex is not null
    // put letter into userBoard and remove letter from userLetters. If there is userLetter, put it back into userLetters
    let updatedUserBoard = [...this.state.userBoard];
    let updUserLetters = [...this.state.userLetters];
    if (
      this.props.games[this.gameId].board[y][x] === null &&
      this.state.chosenLetterIndex !== null
    ) {
      const putLetter = updUserLetters.splice(
        this.state.chosenLetterIndex,
        1
      )[0];
      if (this.state.userBoard[y][x]) {
        updUserLetters.push(this.state.userBoard[y][x]);
      }
      updatedUserBoard[y][x] = putLetter;
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updUserLetters,
        userBoard: updatedUserBoard,
      });
    } else if (
      // if cell has user letter and there is no chosen letter, return letter from board to userLetters
      this.props.games[this.gameId].board[y][x] === null &&
      this.state.chosenLetterIndex === null
    ) {
      if (this.state.userBoard[y][x]) {
        updUserLetters.push(this.state.userBoard[y][x]);
        updatedUserBoard[y][x] = null;
        this.setState({
          ...this.state,
          userLetters: updUserLetters,
          userBoard: updatedUserBoard,
        });
      }
    }
  };

  clickLetter = (event: React.SyntheticEvent) => {
    if (!event.target.dataset.index) {
      this.setState({ ...this.state, chosenLetterIndex: null });
      return;
    }
    if (this.state.chosenLetterIndex === null) {
      this.setState({
        ...this.state,
        chosenLetterIndex: parseInt(event.target.dataset.index),
      });
    } else {
      const updatedUserLetters = [...this.state.userLetters];
      const oldIndex = this.state.chosenLetterIndex;
      const newIndex = parseInt(event.target.dataset.index);
      [updatedUserLetters[oldIndex], updatedUserLetters[newIndex]] = [
        updatedUserLetters[newIndex],
        updatedUserLetters[oldIndex],
      ];
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updatedUserLetters,
      });
    }
  };

  returnLetters = () => {
    const updatedUserLetters = [...this.state.userLetters];
    this.state.userBoard.forEach((row) =>
      row.forEach((cell) => cell && updatedUserLetters.push(cell))
    );
    this.setState({
      ...this.state,
      userBoard: this.emptyUserBoard.map((row) => row.slice()),
      userLetters: updatedUserLetters,
    });
  };

  confirmTurn = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/turn`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ userBoard: this.state.userBoard });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };
  validateTurn = async (event: React.SyntheticEvent) => {
    const validation = event.target.name;
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/approve`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ validation });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  getNextTurn = (game: Object) => {
    return (game.turn + 1) % game.turnOrder.length;
  };
  getPrevTurn = (game: Object) => {
    const index = game.turn - 1;
    if (index < 0) {
      return index + game.turnOrder.length;
    }
    return index;
  };

  returnToRoom = () => {
    this.props.history.push(`/room/${this.props.games[this.gameId].roomId}`);
  };

  undo = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/undo`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`);
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };
  change = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/change`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({
          letters: this.props.games[this.gameId].letters[this.props.user.id],
        });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  componentDidMount() {
    document.title = `Game ${this.gameId} | Erudite`;
    this.gameStream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.games &&
      this.props.games[this.gameId] &&
      this.props !== prevProps &&
      this.props.user &&
      this.props.games[this.gameId].turnOrder.includes(this.props.user.id)
    ) {
      // update state of the component
      // depending on the length of the updated user hand and other conditions

      const game = this.props.games[this.gameId];

      // если у меня букв меньше, чем на сервере, то просто добавить
      const putLetters = this.state.userBoard.reduce((acc, row) => {
        return acc.concat(row.filter((letter) => letter !== null));
      }, []);
      const prevLetters = this.state.userLetters.concat(putLetters);
      if (prevLetters.length < game.letters[this.props.user.id].length) {
        const addedLetters = this.extract(
          prevLetters,
          game.letters[this.props.user.id]
        );
        const updatedUserLetters = this.state.userLetters.concat(addedLetters);

        this.setState({
          ...this.state,
          userLetters: updatedUserLetters,
        });
        // если буквы равны, ничего не менять, кроме пересечений
      } else if (
        JSON.stringify(prevLetters.slice().sort()) ===
        JSON.stringify(game.letters[this.props.user.id].slice().sort())
      ) {
        const updatedUserLetters = this.state.userLetters.slice();
        const updatedUserBoard = this.state.userBoard.map((line, yIndex) =>
          line.map((cell, xIndex) => {
            if (cell && game.board[yIndex][xIndex] !== null) {
              updatedUserLetters.push(cell);
              return null;
            } else {
              return cell;
            }
          })
        );
        this.setState({
          ...this.state,
          userLetters: updatedUserLetters,
          userBoard: updatedUserBoard,
        });
      }
      // если у меня букв больше, чем на сервере, или они не равны, то перерисовать
      else {
        const userLetters = game.letters[this.props.user.id];
        this.setState({
          ...this.state,
          userLetters: userLetters,
          userBoard: this.emptyUserBoard.map((row) => row.slice()),
        });
      }
    }
  }

  componentWillUnmount() {
    this.gameStream.close();
  }

  render() {
    return (
      <div>
        <Game
          game={this.props.games[this.gameId]}
          userLetters={this.state.userLetters}
          chosenLetterIndex={this.state.chosenLetterIndex}
          userBoard={this.state.userBoard}
          user={this.props.user}
          clickBoard={this.clickBoard}
          clickLetter={this.clickLetter}
          confirmTurn={this.confirmTurn}
          validateTurn={this.validateTurn}
          getNextTurn={this.getNextTurn}
          returnLetters={this.returnLetters}
          returnToRoom={this.returnToRoom}
          undo={this.undo}
          passAndChangeLetters={this.passAndChangeLetters}
          change={this.change}
        />
      </div>
    );
  }
}

function MapStateToProps(state) {
  return {
    user: state.user,
    games: state.games,
  };
}
export default connect(MapStateToProps)(GameContainer);
