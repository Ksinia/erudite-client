import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";

import "./Game.css";
import Game from "./Game";
import { url } from "../url";

class GameContainer extends Component {
  gameId = this.props.match.params.game;

  gameStream = new EventSource(`${url}/game/${this.gameId}`);

  initialState = {
    chosenLetterIndex: null,
    board: [],
    userLetters: [],
    userBoard: Array(15)
      .fill(null)
      .map(line => Array(15).fill(null))
  };
  state = this.initialState;

  clickBoard = event => {
    console.log("clickBoard", this.state.userBoard);
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    console.log("clicked cell x index", x);
    console.log("clicked cell y index", y);

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
    console.log("comfirm clicked");
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
    console.log("approve clicked");
    try {
      const response = await superagent
        .post(`${url}/game/${this.gameId}/approve`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`);
      // .send({ userBoard: this.state.userBoard });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  getNextTurn = game => {
    const index = (game.turn + 1) % game.turnOrder.length;
    return game.turnOrder[index];
  };

  componentDidMount() {
    this.gameStream.onmessage = event => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
      console.log(action);
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.games &&
      this.props.user &&
      this.props.games[this.gameId] &&
      JSON.stringify(this.props) !== JSON.stringify(prevProps)
      // this.props !== prevProps
    ) {
      console.log("change props");
      //TODO: write function to check how to update state of the component
      // depending on the length of the updated user hand and other conditions
      // let userLetters = [];
      // if (
      //   this.props.user &&
      //   this.props.games[this.gameId].turnOrder.includes(this.props.user.id)
      // ) {
      //   userLetters = this.props.games[this.gameId].letters[this.props.user.id];
      // }
      // const board = this.props.games[this.gameId].board;
      // this.setState({ ...this.state, userLetters: userLetters, board: board });
      // if (this.props.games[this.gameId].letters[this.props.user.id] < 7) {
      const userLetters = this.props.games[this.gameId].letters[
        this.props.user.id
      ];
      const board = this.props.games[this.gameId].board;
      this.setState({
        ...this.state,
        userLetters: userLetters,
        board: board,
        userBoard: this.initialState.userBoard
      });
      // }
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
