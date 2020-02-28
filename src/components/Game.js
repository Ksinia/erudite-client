import React from "react";
import Board from "./Board";

function Game(props) {
  return (
    <div>
      {props.game ? (
        <div key="game" id="game">
          <Board key="board" onClick={props.clickBoard} board={props.board} />
          <div id="letters" onClick={props.clickLetter}>
            {props.userLetters.map((letter, index) => {
              let style = {};
              if (index === props.chosenLetterIndex) {
                style = { background: "whitesmoke" };
              }
              return (
                <span
                  key={index}
                  data-letter={JSON.stringify(letter)}
                  data-index={index}
                  style={style}
                >
                  {letter.char}
                </span>
              );
            })}
          </div>
          <p>Letters left in the bag: {props.game.letters.pot.length}</p>
        </div>
      ) : (
        "Loading Game"
      )}
    </div>
  );
}

export default Game;
