import React, { Component } from "react";
import "./Board.css";

class Board extends Component {
  cell = {
    letter: null,
    multiplyLetter: 1,
    multiplyWord: 1,
    className: "ordinary"
  };
  emptyBoard = new Array(15).fill(new Array(15).fill(this.cell));
  boardBonuses = {
    0: { 0: "w3", 3: "l2", 7: "w3" },
    1: { 1: "l3", 5: "w2" },
    2: { 2: "l3", 6: "l2" },
    3: { 0: "l2", 3: "l3", 7: "l2" },
    4: { 4: "l3" },
    5: { 1: "w2" },
    6: { 2: "l2", 6: "l2" },
    7: { 0: "w3", 3: "l2" }
  };
  boardWithBonuses = this.emptyBoard.map((row, y) => {
    return row.map((cell, x) => {
      const newCell = { ...cell };
      if (y in this.boardBonuses) {
        if (x in this.boardBonuses[y]) {
          newCell.className = this.boardBonuses[y][x];
        } else if (14 - x in this.boardBonuses[y]) {
          newCell.className = this.boardBonuses[y][14 - x];
        }
      } else if (14 - y in this.boardBonuses) {
        if (14 - x in this.boardBonuses[14 - y]) {
          newCell.className = this.boardBonuses[14 - y][14 - x];
        } else if (x in this.boardBonuses[14 - y]) {
          newCell.className = this.boardBonuses[14 - y][x];
        }
      }
      return newCell;
    });
  });

  //   markedBoard = this.emptyBoard.map((row, y) => {
  //     return row.map((cell, x) => {
  //       const newCell = { ...cell };
  //       if (y === 0 || y === 14) {
  //         if (x === 0 || x === 7 || x === 14) {
  //           newCell.multiplyWord = 3;
  //           newCell.className = "w3";
  //         }
  //       }
  //       if (y === 7) {
  //         if (x === 0 || x === 14) {
  //           newCell.multiplyWord = 3;
  //           newCell.className = "w3";
  //         }
  //       }
  //       if (
  //         ((x > 0 && x < 5) || (x > 9 && x < 14)) &&
  //         (y === x || y === 14 - x)
  //       ) {
  //         newCell.multiplyLetter = 3;
  //         newCell.className = "l3";
  //       }
  //       if ((x === 1 || x === 13) && (y === 5 || y === 9)) {
  //         newCell.multiplyWord = 2;
  //         newCell.className = "w2";
  //       }
  //       if ((y === 1 || y === 13) && (x === 5 || x === 9)) {
  //         newCell.multiplyWord = 2;
  //         newCell.className = "w2";
  //       }
  //       if ((x === 3 || x === 11) && (y === 0 || y === 7 || y === 14)) {
  //         newCell.multiplyLetter = 2;
  //         newCell.className = "l2";
  //       }
  //       if ((y === 3 || y === 11) && (x === 0 || x === 7 || x === 14)) {
  //         newCell.multiplyLetter = 2;
  //         newCell.className = "l2";
  //       }
  //       if ((x === 2 || x === 12) && (y === 6 || y === 8)) {
  //         newCell.multiplyLetter = 2;
  //         newCell.className = "l2";
  //       }
  //       if ((y === 2 || y === 12) && (x === 6 || x === 8)) {
  //         newCell.multiplyLetter = 2;
  //         newCell.className = "l2";
  //       }
  //       if ((x === 6 || x === 8) && (y === 6 || y === 8)) {
  //         newCell.multiplyLetter = 2;
  //         newCell.className = "l2";
  //       }
  //       return newCell;
  //     });
  //   });
  initialState = { board: this.boardWithBonuses };

  state = this.initialState;

  render() {
    console.log(this.state);
    return (
      <div>
        <table>
          <tbody>
            {this.state.board.map((row, index) => {
              return (
                <tr key={index}>
                  {row.map((cell, i) => {
                    return (
                      <td key={i} className={cell.className}>
                        {cell.letter}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Board;
