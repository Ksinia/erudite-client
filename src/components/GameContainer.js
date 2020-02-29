import React, { Component } from "react";
import { connect } from "react-redux";

import "./Game.css";
import Game from "./Game";
import { url } from "../url";

class GameContainer extends Component {
  gameId = this.props.match.params.game;

  gameStream = new EventSource(`${url}/game/${this.gameId}`);

  state = {
    chosenLetterIndex: null,
    board: [],
    userLetters: [],
    userBoard: Array(15)
      .fill(null)
      .map(line => Array(15).fill(null))
  };

  clickBoard = event => {
    console.log("clickBoard", this.state.userBoard);
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    console.log("clicked cell x index", x);
    console.log("clicked cell y index", y);
    if (JSON.parse(event.target.dataset.letter)) {
      console.log("letter: ", JSON.parse(event.target.dataset.letter).char);
    }
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

  componentDidMount() {
    this.gameStream.onmessage = event => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
      console.log(action);
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.games != prevProps.games) {
      console.log("change props");
      let userLetters = [];
      if (
        this.props.user &&
        this.props.games[this.gameId].users.find(
          user => user.id == this.props.user.id
        )
      ) {
        userLetters = this.props.games[this.gameId].letters[this.props.user.id];
      }
      const board = this.props.games[this.gameId].board;
      this.setState({ ...this.state, userLetters: userLetters, board: board });
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
