import React, { Component } from "react";
import "./Board.css";
import letterValues from "../letterValues";

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
    0: {
      0: ["w3", "x3", "слово"],
      3: ["l2", "x2", "буква"],
      7: ["w3", "x3", "слово"]
    },
    1: { 1: ["l3", "x3", "буква"], 5: ["w2", "x2", "слово"] },
    2: { 2: ["l3", "x3", "буква"], 6: ["l2", "x2", "буква"] },
    3: {
      0: ["l2", "x2", "буква"],
      3: ["l3", "x3", "буква"],
      7: ["l2", "x2", "буква"]
    },
    4: { 4: ["l3", "x3", "буква"] },
    5: { 1: ["w2", "x2", "слово"] },
    6: { 2: ["l2", "x2", "буква"], 6: ["l2", "x2", "буква"] },
    7: { 0: ["w3", "x3", "слово"], 3: ["l2", "x2", "буква"] }
  };
  boardWithBonuses = this.emptyBoard.map((row, y) => {
    return row.map((cell, x) => {
      const newCell = { ...cell };
      if (y in this.boardBonuses) {
        if (x in this.boardBonuses[y]) {
          newCell.className = this.boardBonuses[y][x][0];
          newCell.multiply = this.boardBonuses[y][x][1];
          newCell.unit = this.boardBonuses[y][x][2];
        } else if (14 - x in this.boardBonuses[y]) {
          newCell.className = this.boardBonuses[y][14 - x][0];
          newCell.multiply = this.boardBonuses[y][14 - x][1];
          newCell.unit = this.boardBonuses[y][14 - x][2];
        }
      } else if (14 - y in this.boardBonuses) {
        if (14 - x in this.boardBonuses[14 - y]) {
          newCell.className = this.boardBonuses[14 - y][14 - x][0];
          newCell.multiply = this.boardBonuses[14 - y][14 - x][1];
          newCell.unit = this.boardBonuses[14 - y][14 - x][2];
        } else if (x in this.boardBonuses[14 - y]) {
          newCell.className = this.boardBonuses[14 - y][x][0];
          newCell.multiply = this.boardBonuses[14 - y][x][1];
          newCell.unit = this.boardBonuses[14 - y][x][2];
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
                          data-letter={cell.letter}
                          data-x={xIndex}
                          data-y={yIndex}
                          key={`${yIndex}_${xIndex}`}
                          onClick={this.props.clickBoard}
                        >
                          <div
                            className={`cell ${
                              cell.className
                            } user-letter-${!!this.props.userBoard[yIndex][
                              xIndex
                            ]}`}
                          >
                            <p className="multiply">{cell.multiply}</p>
                            <p className="unit">{cell.unit}</p>
                            <p className="value-on-board">
                              {cell.letter && letterValues[cell.letter]}
                              {
                                letterValues[
                                  this.props.userBoard[yIndex][xIndex]
                                ]
                              }
                            </p>
                            {cell.letter && cell.letter}
                            {this.props.userBoard[yIndex][xIndex]}
                          </div>
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
