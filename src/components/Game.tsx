import React from "react";
import { letterValues } from "../constants/letterValues";
import { Game as GameType, User } from "../reducer/types";
import Board from "./Board";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  game: GameType;
  userLetters: string[];
  chosenLetterIndex: number | null;
  userBoard: string[][];
  user: User;
  clickBoard: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  clickLetter: (event: React.MouseEvent<HTMLDivElement>) => void;
  confirmTurn: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  validateTurn: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  getNextTurn: (game: GameType) => number;
  returnLetters: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  returnToRoom: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  undo: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  change: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  findTurnUser: (game: GameType, id: number) => User;
};

function Game(props: OwnProps) {
  return (
    <div>
      {props.game ? (
        <div key="game" className="game">
          <div className="board">
            <Board
              key="board"
              clickBoard={props.clickBoard}
              board={props.game.board}
              previousBoard={props.game.previousBoard}
              userBoard={props.userBoard}
              values={letterValues[props.game.language]}
            />
          </div>

          <div className="controls">
            <div className="letters" onClick={props.clickLetter}>
              {props.userLetters.map((letter, index) => {
                let style = {};
                if (index === props.chosenLetterIndex) {
                  style = { background: "whitesmoke" };
                }
                return (
                  <div
                    className="letter"
                    key={index}
                    data-letter={letter}
                    data-index={index}
                    style={style}
                  >
                    <p className="value-in-hand">
                      {letterValues[props.game.language][letter]}
                    </p>
                    {letter}
                  </div>
                );
              })}
            </div>
            {props.game.phase === "finished" && (
              <button key="again" onClick={props.returnToRoom}>
                <TranslationContainer translationKey="play_again" />
              </button>
            )}
            {props.user &&
              props.game.turnOrder[props.game.turn] === props.user.id &&
              props.game.phase === "turn" && (
                <button key="confirm" onClick={props.confirmTurn}>
                  <TranslationContainer translationKey="confirm" />
                </button>
              )}
            {props.user &&
              props.game.turnOrder.includes(props.user.id) &&
              props.game.phase !== "finished" && (
                <button key="return" onClick={props.returnLetters}>
                  <TranslationContainer translationKey="return" />
                </button>
              )}
            {props.user &&
              props.game.turnOrder[props.game.turn] === props.user.id &&
              props.game.phase === "turn" &&
              props.game.letters.pot.length > 0 && [
                <button key="change" onClick={props.change}>
                  <TranslationContainer translationKey="change" />
                </button>,
              ]}
            {/* next player validates: */}
            {props.user &&
              props.game.turnOrder.includes(props.user.id) &&
              props.user.id ===
                props.game.turnOrder[props.getNextTurn(props.game)] &&
              props.game.phase === "validation" && [
                <button key="yes" name="yes" onClick={props.validateTurn}>
                  <TranslationContainer
                    translationKey="i_confirm"
                    args={[
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.game.turn]
                      ).name,
                    ]}
                  />
                </button>,
                <button key="no" name="no" onClick={props.validateTurn}>
                  <TranslationContainer
                    translationKey="no"
                    args={[
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.game.turn]
                      ).name,
                    ]}
                  />
                </button>,
              ]}
            {props.game.phase === "validation" &&
              props.game.validated === "no" && [
                <p key="disagree">
                  <TranslationContainer
                    translationKey="disagree"
                    args={[
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.getNextTurn(props.game)]
                      ).name,
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.game.turn]
                      ).name,
                    ]}
                  />
                </p>,
                props.user &&
                  props.user.id === props.game.turnOrder[props.game.turn] && (
                    <button key="undo" onClick={props.undo}>
                      <TranslationContainer translationKey="undo" />
                    </button>
                  ),
              ]}
            {props.game.phase !== "finished" ? (
              props.game.phase === "validation" ? (
                <p key="validation_of">
                  <TranslationContainer
                    translationKey="validation"
                    args={[
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.game.turn]
                      ).name,
                    ]}
                  />
                </p>
              ) : (
                <p key="turn_of">
                  <TranslationContainer
                    translationKey="turn_of"
                    args={[
                      props.findTurnUser(
                        props.game,
                        props.game.turnOrder[props.game.turn]
                      ).name,
                    ]}
                  />
                </p>
              )
            ) : (
              <p key="game_over">
                <TranslationContainer translationKey="game_over" />
              </p>
            )}
            <table className="table-score">
              <thead>
                <tr>
                  <th key="player">
                    <TranslationContainer translationKey="player" />
                  </th>
                  <th key="score">
                    <TranslationContainer translationKey="score" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {props.game.turnOrder.map((key) => (
                  <tr key={key}>
                    <td>
                      {props.game.users.find((user) => user.id === key)?.name}
                    </td>
                    <td>{props.game.score[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {props.game.phase === "finished" &&
              Object.keys(props.game.result).length > 0 && (
                <div className="result">
                  <p>
                    <TranslationContainer translationKey="results" />
                  </p>
                  <table className="table-result">
                    <tbody>
                      {props.game.result.winner.length > 0 && (
                        <tr key="winner">
                          <td key="winner">
                            <TranslationContainer translationKey="winner" />
                          </td>
                          <td key="details">
                            {props.game.result.winner
                              .map(
                                (w) =>
                                  props.game.users.find(
                                    (user) => user.id === parseInt(w)
                                  )?.name
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.longestWord.length > 0 && (
                        <tr key="longest_word">
                          <td key="longest_word">
                            <TranslationContainer translationKey="longest_word" />
                          </td>
                          <td key="details">
                            {props.game.result.longestWord
                              .map(
                                (el) =>
                                  `${
                                    props.game.users.find(
                                      (user) => user.id === el.user
                                    )?.name
                                  }: ${el.word}`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.maxScoreWord.length > 0 && (
                        <tr key="valuable_word">
                          <td key="valuable_word">
                            <TranslationContainer translationKey="valuable_word" />
                          </td>
                          <td key="details">
                            {props.game.result.maxScoreWord
                              .map(
                                (el) =>
                                  `${
                                    props.game.users.find(
                                      (user) => user.id === el.user
                                    )?.name
                                  }: ${el.value} (${el.word})`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                      {props.game.result.bestTurnByCount[0].qty > 0 && (
                        <tr key="max_words">
                          <td key="max_words">
                            <TranslationContainer translationKey="max_words" />
                          </td>
                          <td key="details">
                            {props.game.result.bestTurnByCount
                              .map(
                                (el) =>
                                  `${
                                    props.game.users.find(
                                      (user) => user.id === el.user
                                    )?.name
                                  }: ${el.qty}`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                      {props.game.result.bestTurnByValue[0].score > 0 && (
                        <tr key="valuable_turn">
                          <td key="valuable_turn">
                            <TranslationContainer translationKey="valuable_turn" />
                          </td>
                          <td key="details">
                            {props.game.result.bestTurnByValue
                              .map(
                                (el) =>
                                  `${
                                    props.game.users.find(
                                      (user) => user.id === el.user
                                    )?.name
                                  }: ${el.score}`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                      {props.game.result.neverChangedLetters.length > 0 && (
                        <tr key="never_changed">
                          <td key="never_changed">
                            <TranslationContainer translationKey="never_changed" />
                          </td>
                          <td key="details">
                            {props.game.result.neverChangedLetters
                              .map(
                                (el) =>
                                  props.game.users.find(
                                    (user) => user.id === el
                                  )?.name
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            <p key="letters">
              <TranslationContainer translationKey="letters" />
              {props.game.letters.pot.length}
            </p>
            {props.game.turns && props.game.turns.length > 0 && (
              <div className="turns">
                <p>
                  <TranslationContainer translationKey="turns" />
                </p>
                <table className="table-turns">
                  <thead>
                    <tr>
                      <th key="player">
                        <TranslationContainer translationKey="player" />
                      </th>
                      <th key="turn">
                        <TranslationContainer translationKey="turn" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.game.turns
                      .slice()
                      .reverse()
                      .map((turn, index: number) => (
                        <tr key={index}>
                          <td key="1">
                            {
                              props.game.users.find(
                                (user) => user.id === turn.user
                              )?.name
                            }
                          </td>
                          <td key="2">
                            {turn.words.length > 0 ? (
                              <div key={index} className="turn">
                                <p>
                                  {turn.score}
                                  {": "}
                                  {turn.words
                                    .map(
                                      (word) =>
                                        `${Object.keys(word)[0]} ${
                                          word[Object.keys(word)[0]]
                                        }`
                                    )
                                    .join(", ")}
                                </p>
                              </div>
                            ) : (
                              <div key={index} className="turn">
                                {turn.changedLetters ? (
                                  <p>
                                    <TranslationContainer translationKey="changed" />
                                  </p>
                                ) : (
                                  <p>
                                    <TranslationContainer translationKey="passed" />
                                  </p>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : props.game === null ? (
        <TranslationContainer translationKey="no_game" />
      ) : (
        <TranslationContainer translationKey="loading" />
      )}
    </div>
  );
}

export default Game;
