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
              board={props.board}
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
                  's turn
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
                  disagree with{" "}
                  {
                    props.game.users.find(
                      user => user.id === props.game.turnOrder[props.game.turn]
                    ).name
                  }
                  's last turn
                </p>,
                props.user &&
                  props.user.id === props.game.turnOrder[props.game.turn] && (
                    <button key="undo" onClick={props.undo}>
                      Undo my last turn
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
                {Object.keys(props.game.score).map(key => (
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
            <p>Letters left in the bag: {props.game.letters.pot.length}</p>
          </div>
        </div>
      ) : (
        "Loading Game"
      )}
    </div>
  );
}

export default Game;
