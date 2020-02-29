import React from "react";
import Board from "./Board";

function Game(props) {
  return (
    <div>
      {props.game ? (
        <div key="game" id="game">
          <Board
            key="board"
            clickBoard={props.clickBoard}
            board={props.board}
            userBoard={props.userBoard}
          />
          <div id="letters" onClick={props.clickLetter}>
            {props.userLetters.map((letter, index) => {
              let style = {};
              if (index === props.chosenLetterIndex) {
                style = { background: "whitesmoke" };
              }
              return (
                <span
                  className="letter"
                  key={index}
                  data-letter={letter}
                  data-index={index}
                  style={style}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          {props.user &&
            props.game.users.find(user => user.id == props.user.id) &&
            props.game.turn == props.user.id &&
            props.game.phase == "turn" && (
              <button onClick={props.confirmTurn}>Confirm</button>
            )}
          <p>
            Now is{" "}
            {props.game.users.find(user => user.id == props.game.turn).name}'s
            turn
          </p>
          <p>Letters left in the bag: {props.game.letters.pot.length}</p>
        </div>
      ) : (
        "Loading Game"
      )}
    </div>
  );
}

export default Game;
