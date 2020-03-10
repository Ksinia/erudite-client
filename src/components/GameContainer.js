import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";

import "./Game.css";
import Game from "./Game";
import { url } from "../url";

class GameContainer extends Component {
  gameId = this.props.match.params.game;

  gameStream = new EventSource(`${url}/game/${this.gameId}`);

  emptyUserBoard = Array(15)
    .fill(null)
    .map(line => Array(15).fill(null));

  state = {
    chosenLetterIndex: null,
    board: [],
    userLetters: [],
    userBoard: this.emptyUserBoard
  };

  // extract added letters from whole new hand
  extract = (oldHand, newHand) => {
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

  clickBoard = event => {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);

    // if the cell is occupied by letter
    // do nothing
    // if cell is empty (no letter from server) and chosenLetterIndex is not null
    // put letter into userBoard and remove letter from userLetters. If there is userLetter, put it back into userLetters
    let updatedUserBoard = [...this.state.userBoard];
    let updUserLetters = [...this.state.userLetters];
    if (
      this.state.board[y][x] === null &&
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
        userBoard: updatedUserBoard
      });
    } else if (
      // if cell has user letter and there is no chosen letter, return letter from board to userLetters
      this.state.board[y][x] === null &&
      this.state.chosenLetterIndex === null
    ) {
      if (this.state.userBoard[y][x]) {
        updUserLetters.push(this.state.userBoard[y][x]);
        updatedUserBoard[y][x] = null;
        this.setState({
          ...this.state,
          userLetters: updUserLetters,
          userBoard: updatedUserBoard
        });
      }
    }
  };

  clickLetter = event => {
    if (!event.target.dataset.index) {
      this.setState({ ...this.state, chosenLetterIndex: null });
      return;
    }
    if (this.state.chosenLetterIndex === null) {
      this.setState({
        ...this.state,
        chosenLetterIndex: parseInt(event.target.dataset.index)
      });
    } else {
      const updatedUserLetters = [...this.state.userLetters];
      const oldIndex = this.state.chosenLetterIndex;
      const newIndex = parseInt(event.target.dataset.index);
      [updatedUserLetters[oldIndex], updatedUserLetters[newIndex]] = [
        updatedUserLetters[newIndex],
        updatedUserLetters[oldIndex]
      ];
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updatedUserLetters
      });
    }
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
  approveTurn = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/approve`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`);
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  getNextTurn = game => {
    return (game.turn + 1) % game.turnOrder.length;
  };
  getPrevTurn = game => {
    const index = game.turn - 1;
    if (index < 0) {
      return index + game.turnOrder.length;
    }
    return index;
  };

  componentDidMount() {
    this.gameStream.onmessage = event => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.games &&
      this.props.games[this.gameId] &&
      JSON.stringify(this.props) !== JSON.stringify(prevProps)
    ) {
      console.log("change props");

      //update state of the component
      // depending on the length of the updated user hand and other conditions

      const game = this.props.games[this.gameId];
      const board = game.board;

      // все случаи:

      if (!this.props.game && !this.props.user) {
      }
      // пользователь не залогинен
      else if (!this.props.user) {
        this.setState({
          ...this.state,
          board: board
        });
      }
      // игра только началась
      else if (
        game.phase === "turn" &&
        !board.some(row => row.some(cell => cell))
      ) {
        console.log("начало игры");
        const userLetters = game.letters[this.props.user.id];
        this.setState({
          ...this.state,
          userLetters: userLetters,
          board: board,
          userBoard: Array(15)
            .fill(null)
            .map(line => Array(15).fill(null))
        });
      }

      // я сделала ход - после этого надо
      else if (
        game.phase === "validation" &&
        game.turnOrder[game.turn] === this.props.user.id
      ) {
        console.log("я сделала ход - после этого надо");
        const userLetters = game.letters[this.props.user.id];
        this.setState({
          ...this.state,
          userLetters: userLetters,
          board: board,
          userBoard: Array(15)
            .fill(null)
            .map(line => Array(15).fill(null))
        });

        // я получила подтверждение своего хода - мне придут новые буквы, так что надо не обновлять юзер боард,
        // но добавить к моим буквам только новые буквы
      } else if (
        game.phase === "turn" &&
        // проверить, что моя очередь была предыдущей
        game.turnOrder[this.getPrevTurn(game)] === this.props.user.id
      ) {
        console.log(
          "я получила подтверждение своего хода - мне придут новые буквы, так что надо не обновлять юзер боард, но добавить к моим буквам только новые буквы"
        );
        // найти предыдущие буквы
        const putLetters = this.state.userBoard.reduce((acc, row) => {
          return acc.concat(row.filter(letter => letter !== null));
        }, []);
        const prevLetters = this.state.userLetters.concat(putLetters);
        const addedLetters = this.extract(
          prevLetters,
          game.letters[this.props.user.id]
        );
        const updatedUserLetters = this.state.userLetters.concat(addedLetters);

        this.setState({
          ...this.state,
          board: board,
          userLetters: updatedUserLetters
        });

        // другой игрок сделал ход - не надо (надо только если его буквы попали на мои)
        // ход другого игрока подтвержден -  - после этого не надо
      } else {
        console.log("остальные случаи");
        console.log("state before update:", this.state);
        if (
          this.state.userLetters.length === 0 &&
          !this.state.userBoard.some(row => row.some(cell => cell))
        ) {
          const updatedUserLetters = game.letters[this.props.user.id];
          this.setState({
            ...this.state,
            board: board,
            userLetters: updatedUserLetters
          });
        } else {
          const updatedUserLetters = [...this.state.userLetters];

          const updatedUserBoard = this.state.userBoard.map((line, yIndex) =>
            line.map((cell, xIndex) => {
              if (cell && board[yIndex][xIndex] !== null) {
                updatedUserLetters.push(cell);
                return null;
              } else {
                return cell;
              }
            })
          );
          this.setState({
            ...this.state,
            board: board,
            userLetters: updatedUserLetters,
            userBoard: updatedUserBoard
          });
        }
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
          board={this.state.board}
          userBoard={this.state.userBoard}
          user={this.props.user}
          clickBoard={this.clickBoard}
          clickLetter={this.clickLetter}
          confirmTurn={this.confirmTurn}
          approveTurn={this.approveTurn}
          getNextTurn={this.getNextTurn}
        />
      </div>
    );
  }
}

function MapStateToProps(state) {
  return {
    user: state.user,
    games: state.games
  };
}
export default connect(MapStateToProps)(GameContainer);
