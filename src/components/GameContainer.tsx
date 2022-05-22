import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";
import { History } from "history";

import "./Game.css";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { backendUrl } from "../backendUrl";
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
    return acc
      .concat(row.filter((letter) => letter !== ""))
      .map((letter) => letter[0]);
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
  wildCardLetters: { letter: string; x: number; y: number }[];
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
      this.props.user &&
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
        wildCardLetters.push({ letter: "", y, x });
      }

      // TODO: dedublicate code
      // If there is userLetter in that cell, put it back into userLetters

      if (userLetterOnBoard !== "") {
        updUserLetters.push(userLetterOnBoard[0]);
        if (userLetterOnBoard[0] === "*") {
          wildCardLetters = this.state.wildCardLetters.filter(
            (letterObject) => letterObject.x !== x || letterObject.y !== y
          );
        }
      }
      updatedUserBoard[y][x] = putLetter;
      this.setState({
        ...this.state,
        chosenLetterIndex: null,
        userLetters: updUserLetters,
        userBoard: updatedUserBoard,
        wildCardLetters,
      });
    } else if (
      // if cell has user letter and there is no chosen letter, return letter from board to userLetters
      letterOnBoard === null &&
      this.state.chosenLetterIndex === null
    ) {
      if (userLetterOnBoard !== "") {
        updUserLetters.push(userLetterOnBoard[0]);
        updatedUserBoard[y][x] = "";
        if (userLetterOnBoard[0] === "*") {
          wildCardLetters = this.state.wildCardLetters.filter(
            (letterObject) => letterObject.x !== x || letterObject.y !== y
          );
        }
        this.setState({
          ...this.state,
          userLetters: updUserLetters,
          userBoard: updatedUserBoard,
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
      await superagent
        .post(`${backendUrl}/game/${this.props.game.id}/approve`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ validation: name });
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
      await superagent
        .post(`${backendUrl}/game/${this.props.game.id}/undo`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  change = async () => {
    try {
      await superagent
        .post(`${backendUrl}/game/${this.props.game.id}/change`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({
          letters: this.props.game.letters[this.props.user.id],
        });
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
    if (event.target.dataset.y && event.target.dataset.x) {
      const y = parseInt(event.target.dataset.y);
      const x = parseInt(event.target.dataset.x);
      let wildCardLetters = this.state.wildCardLetters.slice();
      wildCardLetters[parseInt(event.target.name)].letter = event.target.value;
      let userBoard = this.state.userBoard.map((row) => row.slice());
      userBoard[y][x] = `*${event.target.value}`;
      this.setState({ ...this.state, wildCardLetters, userBoard });
    }
  };

  playAgainWithSamePlayers = async () => {
    try {
      const response = await superagent
        .post(`${backendUrl}/create`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({
          maxPlayers: this.props.game.maxPlayers,
          language: this.props.game.language,
          players: this.props.game.turnOrder,
        });
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
        let wildCardLetters = this.state.wildCardLetters.slice();
        const updatedUserBoard = userBoard.map((line, yIndex) =>
          line.map((cell, xIndex) => {
            if (cell && game.board[yIndex][xIndex] !== null) {
              userLetters.push(cell[0]);
              if (cell[0] === "*") {
                wildCardLetters = this.state.wildCardLetters.filter(
                  (letterObject) =>
                    letterObject.x !== xIndex || letterObject.y !== yIndex
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
        });
      }
      // if player's letters are different (or more) than on server, update player's letters
      else {
        const userLetters = game.letters[this.props.user.id];
        this.setState({
          ...this.state,
          userLetters,
          userBoard: this.emptyUserBoard.map((row) => row.slice()),
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
          wildCardLetters={this.state.wildCardLetters}
          wildCardOnBoard={this.state.wildCardOnBoard}
          duplicatedWords={this.props.duplicatedWords}
          userBoardEmpty={
            !this.state.userBoard.some((row: string[]) => !!row.join(""))
          }
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
