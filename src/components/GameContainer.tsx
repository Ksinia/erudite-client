import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";
import { History } from "history";

import "./Game.css";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { url } from "../url";
import { RootState } from "../reducer";
import { User, Game as GameType } from "../reducer/types";
import { sendTurn, clearDuplicatedWordsError } from "../actions/turn";
import Game from "./Game";

/**
 * extract added letters from whole new hand
 */
const arrayDifference = (subArray: string[], array: string[]) => {
  const sortedSubArray = [...subArray].sort();
  const sortedArray = [...array].sort();
  return sortedArray.reduce(
    (acc: { i: number; letters: string[] }, letter) => {
      if (acc.i === sortedSubArray.length) {
        acc.letters.push(letter);
        return acc;
      }
      if (letter === sortedSubArray[acc.i]) {
        acc.i++;
        return acc;
      }
      acc.letters.push(letter);
      return acc;
    },
    { i: 0, letters: [] }
  ).letters;
};

const getPreviousLetters = (
  userBoard: string[][],
  wildCardOnBoard: WildCardOnBoard,
  userLetters: string[]
) => {
  const putLetters = userBoard.reduce((acc: string[], row) => {
    return acc.concat(row.filter((letter) => letter !== ""));
  }, []);
  const changedLetters = Object.keys(wildCardOnBoard).reduce((acc, y) => {
    return acc.concat(
      Object.keys(wildCardOnBoard[parseInt(y)]).reduce((a, x) => {
        a.push(wildCardOnBoard[parseInt(y)][parseInt(x)]);
        return a;
      }, [] as string[])
    );
  }, [] as string[]);
  let prevLetters = userLetters.concat(putLetters).concat(changedLetters);
  if (changedLetters.length > 0) {
    prevLetters = arrayDifference(
      Array(changedLetters.length).fill("*"),
      prevLetters
    );
  }
  return prevLetters;
};

interface StateProps {
  user: User;
  duplicatedWords: string[];
}

export type WildCardOnBoard = { [key: number]: { [key: number]: string } };

type State = {
  chosenLetterIndex: number | null;
  userLetters: string[];
  userBoard: string[][];
  wildCardLetters: string[];
  wildCardQty: number;
  wildCardOnBoard: WildCardOnBoard;
};

interface OwnProps {
  game: GameType;
  history: History;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

class GameContainer extends Component<Props, State> {
  emptyUserBoard = Array(15)
    .fill(null)
    .map((_) => Array(15).fill(""));

  readonly state: State = {
    chosenLetterIndex: null,
    userLetters: [],
    userBoard: this.emptyUserBoard.map((row) => row.slice()),
    wildCardLetters: [],
    wildCardQty: 0,
    wildCardOnBoard: {},
  };

  clickBoard = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if (
      event.currentTarget.dataset.x === undefined ||
      event.currentTarget.dataset.x === "" ||
      event.currentTarget.dataset.y === undefined ||
      event.currentTarget.dataset.y === ""
    ) {
      return;
    }
    const x = parseInt(event.currentTarget.dataset.x);
    const y = parseInt(event.currentTarget.dataset.y);

    let updatedUserBoard = this.state.userBoard.map((row) => row.slice());
    let updUserLetters = this.state.userLetters.slice();
    let wildCardQty = this.state.wildCardQty;
    let wildCardLetters = this.state.wildCardLetters.slice();
    const userLetterOnBoard = this.state.userBoard[y][x];
    const letterOnBoard = this.props.game.board[y][x];
    const wildCardOnBoard = { ...this.state.wildCardOnBoard };

    // if the cell is occupied by * and it is your turn you can exchange it
    // for the same letter and *  should be used on the same turn
    if (
      letterOnBoard &&
      letterOnBoard[0] === "*" &&
      this.props.game.phase === "turn" &&
      this.props.user.id === this.props.game.turnOrder[this.props.game.turn] &&
      this.state.chosenLetterIndex !== null &&
      updUserLetters[this.state.chosenLetterIndex] === letterOnBoard[1]
    ) {
      const putLetter = updUserLetters.splice(
        this.state.chosenLetterIndex,
        1
      )[0];
      updUserLetters.push("*");
      wildCardOnBoard[y] = wildCardOnBoard[y] || {};
      wildCardOnBoard[y][x] = putLetter;
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updUserLetters,
        wildCardOnBoard,
      });
    }
    // if cell is empty (no letter from server) and chosenLetterIndex is not null
    // put letter into userBoard and remove letter from userLetters.
    else if (letterOnBoard === null && this.state.chosenLetterIndex !== null) {
      const putLetter = updUserLetters.splice(
        this.state.chosenLetterIndex,
        1
      )[0];
      // if user put * on the board, increase the qty of *
      if (putLetter === "*") {
        wildCardQty += 1;
        wildCardLetters.push("");
      }
      // If there is userLetter in that cell, put it back into userLetters

      if (userLetterOnBoard !== "") {
        updUserLetters.push(userLetterOnBoard);
        if (userLetterOnBoard === "*") {
          wildCardQty -= 1;
          wildCardLetters = this.state.wildCardLetters.slice(0, wildCardQty);
        }
      }
      updatedUserBoard[y][x] = putLetter;
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updUserLetters,
        userBoard: updatedUserBoard,
        wildCardQty,
        wildCardLetters,
      });
    } else if (
      // if cell has user letter and there is no chosen letter, return letter from board to userLetters
      letterOnBoard === null &&
      this.state.chosenLetterIndex === null
    ) {
      if (userLetterOnBoard !== "") {
        updUserLetters.push(userLetterOnBoard);
        updatedUserBoard[y][x] = "";
        if (userLetterOnBoard === "*") {
          wildCardQty -= 1;
          wildCardLetters = this.state.wildCardLetters.slice(0, wildCardQty);
        }
        this.setState({
          ...this.state,
          userLetters: updUserLetters,
          userBoard: updatedUserBoard,
          wildCardQty,
          wildCardLetters,
        });
      }
    }
  };

  clickLetter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { dataset } = event.target as HTMLDivElement;
    if (!dataset.index) {
      this.setState({ ...this.state, chosenLetterIndex: null });
      return;
    }
    if (this.state.chosenLetterIndex === null) {
      this.setState({
        ...this.state,
        chosenLetterIndex: parseInt(dataset.index),
      });
    } else {
      const updatedUserLetters = [...this.state.userLetters];
      const oldIndex = this.state.chosenLetterIndex;
      const newIndex = parseInt(dataset.index);
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
    this.setState({
      ...this.state,
      userBoard: this.emptyUserBoard.map((row) => row.slice()),
      userLetters: getPreviousLetters(
        this.state.userBoard,
        this.state.wildCardOnBoard,
        this.state.userLetters
      ),
      wildCardQty: 0,
      wildCardLetters: [],
      wildCardOnBoard: {},
    });
  };

  confirmTurn = async () => {
    // TODO: move this constant transformation logic to backend
    const userBoardWithNulls = this.state.userBoard.map((row) =>
      row.map((cell) => {
        if (cell === "") {
          return null;
        } else {
          return cell;
        }
      })
    );
    // if player uses wild cards he must choose a letter for it before submiting a turn
    let userBoardToSend = userBoardWithNulls;
    if (this.state.wildCardQty > 0) {
      let x = 0;
      userBoardToSend = userBoardWithNulls.map((row) =>
        row.map((cell) => {
          if (cell === "*" && this.state.wildCardLetters[x]) {
            const letter = this.state.wildCardLetters[x];
            x += 1;
            return `*${letter}`;
          } else {
            return cell;
          }
        })
      );
    }
    if (this.props.user.jwt) {
      this.props.dispatch(
        sendTurn(
          this.props.game.id,
          this.props.user.jwt,
          userBoardToSend,
          this.state.wildCardOnBoard
        )
      );
    }
  };
  validateTurn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = event.target as HTMLButtonElement;
    try {
      const response = await superagent
        .post(`${url}/game/${this.props.game.id}/approve`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ validation: name });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  getNextTurn = (game: GameType) => {
    return (game.turn + 1) % game.turnOrder.length;
  };

  getPrevTurn = (game: GameType) => {
    const index = game.turn - 1;
    if (index < 0) {
      return index + game.turnOrder.length;
    }
    return index;
  };

  undo = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.props.game.id}/undo`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`);
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  change = async () => {
    try {
      const response = await superagent
        .post(`${url}/game/${this.props.game.id}/change`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({
          letters: this.props.game.letters[this.props.user.id],
        });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  findTurnUser = (game: GameType, id: number): User => {
    const user = game.users.find((user) => user.id === id);
    if (user !== undefined) {
      return user;
    }
    console.log("findTurnUser did not find a user. This shouldn't happen");
    return { id: -1, name: "" };
  };

  onChangeWildCard = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let wildCardLetters = [...this.state.wildCardLetters];
    wildCardLetters[parseInt(event.target.name)] = event.target.value;
    this.setState({ ...this.state, wildCardLetters });
  };

  playAgainWithSamePlayers = async () => {
    try {
      const response = await superagent
        .post(`${url}/create`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({
          maxPlayers: this.props.game.maxPlayers,
          language: this.props.game.language,
          players: this.props.game.turnOrder,
        });
      console.log("response test: ", response);
      this.props.history.push(`/game/${response.body.id}`);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  componentDidMount() {
    if (
      this.props.user &&
      this.props.game.turnOrder.includes(this.props.user.id)
    ) {
      const userLetters = this.props.game.letters[this.props.user.id];
      this.setState({
        ...this.state,
        userLetters,
        userBoard: this.emptyUserBoard.map((row) => row.slice()),
        wildCardQty: 0,
        wildCardLetters: [],
        wildCardOnBoard: {},
      });
    }
  }
  componentDidUpdate(prevProps: StateProps) {
    if (
      this.props !== prevProps &&
      this.props.user &&
      this.props.game.turnOrder.includes(this.props.user.id)
    ) {
      // update state of the component
      // depending on the length of the updated user hand and other conditions

      const game = this.props.game;
      const { userBoard, wildCardOnBoard, userLetters } = this.state;

      // if player has less letters than on server, just add letters from server
      const prevLetters = getPreviousLetters(
        userBoard,
        wildCardOnBoard,
        userLetters
      );
      console.log("prevLetters.length", prevLetters.length);
      console.log(
        "game.letters[this.props.user.id].length",
        game.letters[this.props.user.id].length
      );
      console.log(
        "JSON.stringify(prevLetters.slice().sort())",
        JSON.stringify(prevLetters.slice().sort())
      );
      console.log(
        "JSON.stringify(game.letters[this.props.user.id].slice().sort())",
        JSON.stringify(game.letters[this.props.user.id].slice().sort())
      );
      if (prevLetters.length < game.letters[this.props.user.id].length) {
        const addedLetters = arrayDifference(
          prevLetters,
          game.letters[this.props.user.id]
        );
        const updatedUserLetters = userLetters.concat(addedLetters);

        this.setState({
          ...this.state,
          userLetters: updatedUserLetters,
        });
        // if player's letters are same as on server, don't change anything except for collisions between user letters on the board and other letters on the board
      } else if (
        JSON.stringify(prevLetters.slice().sort()) ===
        JSON.stringify(game.letters[this.props.user.id].slice().sort())
      ) {
        let wildCardQty = this.state.wildCardQty;
        let wildCardLetters = this.state.wildCardLetters.slice();
        const updatedUserBoard = userBoard.map((line, yIndex) =>
          line.map((cell, xIndex) => {
            if (cell && game.board[yIndex][xIndex] !== null) {
              userLetters.push(cell);
              if (cell === "*") {
                wildCardQty -= 1;
                wildCardLetters = this.state.wildCardLetters.slice(
                  0,
                  wildCardQty
                );
              }
              return "";
            } else {
              return cell;
            }
          })
        );
        this.setState({
          ...this.state,
          userLetters,
          userBoard: updatedUserBoard,
          wildCardLetters,
          wildCardQty,
        });
      }
      // if player's letters are different (or more) than on server, update player's letters
      else {
        const userLetters = game.letters[this.props.user.id];
        this.setState({
          ...this.state,
          userLetters,
          userBoard: this.emptyUserBoard.map((row) => row.slice()),
          wildCardQty: 0,
          wildCardLetters: [],
          wildCardOnBoard: {},
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearDuplicatedWordsError());
  }

  render() {
    if (!this.props.game) {
      console.log("No game");
    }
    return (
      <div>
        <Game
          game={this.props.game}
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
          playAgainWithSamePlayers={this.playAgainWithSamePlayers}
          undo={this.undo}
          change={this.change}
          findTurnUser={this.findTurnUser}
          onChangeWildCard={this.onChangeWildCard}
          wildCardQty={this.state.wildCardQty}
          wildCardLetters={this.state.wildCardLetters}
          wildCardOnBoard={this.state.wildCardOnBoard}
          duplicatedWords={this.props.duplicatedWords}
        />
      </div>
    );
  }
}

function MapStateToProps(state: RootState) {
  return {
    user: state.user,
    duplicatedWords: state.duplicatedWords,
  };
}
export default connect(MapStateToProps)(GameContainer);
