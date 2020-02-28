import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./Game.css";
import Game from "./Game";
import { url } from "../url";

class GameContainer extends Component {
  roomId = this.props.roomId;
  gameId = this.props.gameId;
  // gameId = this.props.match.params.game;

  gameStream = new EventSource(`${url}/game/${this.gameId}`);

  state = {
    chosenLetterIndex: null,
    board: [],
    userLetters: []
  };
  // if this.props.game != nil {
  //   state.board= this.props.game.board,
  //   state.userLetters= this.props.game.letters[this.props.user.id]
  // }

  clickBoard = event => {};
  clickLetter = event => {
    console.log("clicked letter", parseInt(event.target.dataset.index));
    if (this.state.chosenLetterIndex === null) {
      this.setState({
        ...this.state,
        chosenLetterIndex: parseInt(event.target.dataset.index)
      });
      console.log(
        "new state chosen letter index",
        this.state.chosenLetterIndex
      );
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
    //будет ли это всегда работать?
    // if (this.props.game) {
    //   const userLetters = this.props.game.letters[this.props.user.id];
    //   const board = this.props.game.board;
    //   this.setState({ ...this.state, userLetters, board });
    // }
  }

  componentDidUpdate(prevProps) {
    if (this.props != prevProps && this.props.games) {
      const userLetters = this.props.games[this.gameId].letters[
        this.props.user.id
      ];
      const board = this.props.games[this.gameId].board;
      this.setState({ ...this.state, userLetters: userLetters, board: board });
    }
  }

  render() {
    return (
      <div>
        {/* {this.props.game && this.props.user ? ( */}
        <Game
          game={this.props.games[this.gameId]}
          userLetters={this.state.userLetters}
          chosenLetterIndex={this.state.chosenLetterIndex}
          board={this.state.board}
          user={this.props.user}
          clickBoard={this.clickBoard}
          clickLetter={this.clickLetter}
        />
        {/* ) : ( */}
        {/* "Loading Game Container" */}
        {/* )} */}
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
