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
            {props.user &&
              props.game.turnOrder[props.game.turn] === props.user.id &&
              props.game.phase === "turn" && (
                <button key="confirm" onClick={props.confirmTurn}>
                  Confirm
                </button>
              )}
            {props.user && props.game.turnOrder.includes(props.user.id) && (
              <button key="return" onClick={props.returnLetters}>
                Return letters
              </button>
            )}
            {/* next player validates: */}
            {props.user &&
              props.game.turnOrder.includes(props.user.id) &&
              props.user.id ===
                props.game.turnOrder[props.getNextTurn(props.game)] &&
              props.game.phase === "validation" && (
                <button onClick={props.approveTurn}>
                  I confirm{" "}
                  {
                    props.game.users.find(
                      user => user.id === props.game.turnOrder[props.game.turn]
                    ).name
                  }
                  's turn
                </button>
              )}
            <p>Game phase: {props.game.phase}</p>
            <p>
              {
                props.game.users.find(
                  user => user.id === props.game.turnOrder[props.game.turn]
                ).name
              }
              's turn
            </p>
            <p>Score:</p>
            {Object.keys(props.game.score).map(key => (
              <p key={key}>
                {props.game.users.find(user => user.id === parseInt(key)).name}:{" "}
                {props.game.score[key]}
              </p>
            ))}
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
