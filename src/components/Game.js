import React from "react";
import Board from "./Board";
import letterValues from "../letterValues";

function Game(props) {
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
                    <p className="value-in-hand">{letterValues[letter]}</p>
                    {letter}
                  </div>
                );
              })}
            </div>
            {props.game.phase === "finished" && (
              <button onClick={props.returnToRoom}>
                Play again with the same players
              </button>
            )}
            {props.user &&
              props.game.turnOrder[props.game.turn] === props.user.id &&
              props.game.phase === "turn" && (
                <button key="confirm" onClick={props.confirmTurn}>
                  Confirm
                </button>
              )}
            {props.user &&
              props.game.turnOrder.includes(props.user.id) &&
              props.game.phase !== "finished" && (
                <button key="return" onClick={props.returnLetters}>
                  Return letters
                </button>
              )}
            {props.user &&
              props.game.turnOrder[props.game.turn] === props.user.id &&
              props.game.phase === "turn" &&
              props.game.letters.pot.length > 0 && [
                <button key="change" onClick={props.change}>
                  Pass and change all letters
                </button>
              ]}
            {/* next player validates: */}
            {props.user &&
              props.game.turnOrder.includes(props.user.id) &&
              props.user.id ===
                props.game.turnOrder[props.getNextTurn(props.game)] &&
              props.game.phase === "validation" && [
                <button key="yes" name="yes" onClick={props.validateTurn}>
                  I confirm{" "}
                  {
                    props.game.users.find(
                      user => user.id === props.game.turnOrder[props.game.turn]
                    ).name
                  }
                  's turn
                </button>,
                <button key="no" name="no" onClick={props.validateTurn}>
                  I disagree with the last{" "}
                  {
                    props.game.users.find(
                      user => user.id === props.game.turnOrder[props.game.turn]
                    ).name
                  }
                  's move
                </button>
              ]}
            {props.game.phase === "validation" &&
              props.game.validated === "no" && [
                <p key="disagree">
                  {
                    props.game.users.find(
                      user =>
                        user.id ===
                        props.game.turnOrder[props.getNextTurn(props.game)]
                    ).name
                  }{" "}
                  doesn't agree with{" "}
                  {
                    props.game.users.find(
                      user => user.id === props.game.turnOrder[props.game.turn]
                    ).name
                  }
                  's last move
                </p>,
                props.user &&
                  props.user.id === props.game.turnOrder[props.game.turn] && (
                    <button key="undo" onClick={props.undo}>
                      Undo my last move
                    </button>
                  )
              ]}
            {props.game.phase !== "finished" ? (
              <p>
                {props.game.phase === "validation" && "Validation of "}
                {
                  props.game.users.find(
                    user => user.id === props.game.turnOrder[props.game.turn]
                  ).name
                }
                's turn
              </p>
            ) : (
              <p>Game over</p>
            )}
            <table className="table-score">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {props.game.turnOrder.map(key => (
                  <tr key={key}>
                    <td>
                      {
                        props.game.users.find(user => user.id === parseInt(key))
                          .name
                      }
                    </td>
                    <td>{props.game.score[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {props.game.phase === "finished" &&
              Object.keys(props.game.result).length > 0 && (
                <div className="result">
                  <p>Detailed game results:</p>
                  <table className="table-result">
                    <tbody>
                      {props.game.result.winner.length > 0 && (
                        <tr key="winner">
                          <td>The winner</td>
                          <td>
                            {props.game.result.winner
                              .map(
                                w =>
                                  props.game.users.find(
                                    user => user.id === parseInt(w)
                                  ).name
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.longestWord.length > 0 && (
                        <tr>
                          <td>The longest word</td>
                          <td>
                            {props.game.result.longestWord
                              .map(
                                el =>
                                  `${el.word} by ${
                                    props.game.users.find(
                                      user => user.id === el.user
                                    ).name
                                  }`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.maxScoreWord.length > 0 && (
                        <tr>
                          <td>The most valuable word</td>
                          <td>
                            {props.game.result.maxScoreWord
                              .map(
                                el =>
                                  `${el.word} for ${el.value} by ${
                                    props.game.users.find(
                                      user => user.id === el.user
                                    ).name
                                  }`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.bestTurnByCount[0].qty > 0 && (
                        <tr>
                          <td>The maximum words in one turn</td>
                          <td>
                            {props.game.result.bestTurnByCount
                              .map(
                                el =>
                                  `${el.qty} by ${
                                    props.game.users.find(
                                      user => user.id === el.user
                                    ).name
                                  }`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}

                      {props.game.result.bestTurnByValue[0].score > 0 && (
                        <tr>
                          <td>The most valuable turn</td>
                          <td>
                            {props.game.result.bestTurnByValue
                              .map(
                                el =>
                                  `${el.score} by ${
                                    props.game.users.find(
                                      user => user.id === el.user
                                    ).name
                                  }`
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                      {props.game.result.neverChangedLetters.length > 0 && (
                        <tr>
                          <td>Never changed letters</td>
                          <td>
                            {props.game.result.neverChangedLetters
                              .map(
                                el =>
                                  props.game.users.find(user => user.id === el)
                                    .name
                              )
                              .join(", ")}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            <p>Letters left in the bag: {props.game.letters.pot.length}</p>
            {props.game.turns && props.game.turns.length > 0 && (
              <div className="turns">
                <p>Game turns</p>
                <table className="table-turns">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Turn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.game.turns
                      .slice()
                      .reverse()
                      .map((turn, index) => (
                        <tr key={index}>
                          <td>
                            {
                              props.game.users.find(
                                user => user.id === turn.user
                              ).name
                            }
                          </td>
                          <td>
                            {turn.words.length > 0 ? (
                              <div key={index} className="turn">
                                <p>
                                  {turn.score}
                                  {": "}
                                  {turn.words
                                    .map(
                                      word =>
                                        `${Object.keys(word)[0]} ${
                                          word[Object.keys(word)[0]]
                                        }`
                                    )
                                    .join(" ")}
                                </p>
                              </div>
                            ) : (
                              <div key={index} className="turn">
                                {turn.changedLetters ? (
                                  <p>changed letters</p>
                                ) : (
                                  <p>passed</p>
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
      ) : (
        "Loading Game"
      )}
    </div>
  );
}

export default Game;
