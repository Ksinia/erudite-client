import React, { Component } from "react";
import "./Board.css";

class Board extends Component {
  cell = {
    letter: {},
    userLetter: {},
    multiplyLetter: 1,
    multiplyWord: 1,
    className: "ordinary"
  };
  emptyBoard = Array(15)
    .fill(null)
    .map(line => Array(15).fill(this.cell));
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

  initialState = { board: this.boardWithBonuses };

  state = this.initialState;

  render() {
    return (
      <div>
        {this.props.board && this.props.board.length > 0 ? (
          <table>
            <tbody>
              {this.state.board.map((row, yIndex) => {
                return (
                  <tr key={yIndex}>
                    {row.map((cell, xIndex) => {
                      cell.letter =
                        this.props.board[yIndex][xIndex] &&
                        this.props.board[yIndex][xIndex];
                      return (
                        <td
                          data-letter={JSON.stringify(cell.letter)}
                          data-x={xIndex}
                          data-y={yIndex}
                          key={`${yIndex}_${xIndex}`}
                          className={cell.className}
                          onClick={this.props.clickBoard}
                        >
                          {cell.letter && cell.letter.char && cell.letter.char}
                          {this.props.userBoard[yIndex][xIndex] &&
                            this.props.userBoard[yIndex][xIndex].char}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          "Loading Board"
        )}
      </div>
    );
  }
}

export default Board;
