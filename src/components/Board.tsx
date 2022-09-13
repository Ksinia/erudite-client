import React, { Component } from 'react';

import './Board.css';
import TranslationContainer from './Translation/TranslationContainer';

type Props = {
  key: string;
  clickBoard: (
    event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>
  ) => void;
  board: (string | null)[][];
  previousBoard: (string | null)[][];
  userBoard: string[][];
  values: { [key: string]: number };
  wildCardOnBoard: { [y: number]: { [x: number]: string } };
};

class Board extends Component<Props> {
  cell = {
    letter: {},
    userLetter: {},
    multiplyLetter: 1,
    multiplyWord: 1,
    className: 'ordinary',
  };
  emptyBoard = Array(15)
    .fill(null)
    .map((_) => Array(15).fill(this.cell));
  boardBonuses: {
    [key: number]: { [key: number]: (string | JSX.Element)[] };
  } = {
    0: {
      0: ['w3', 'x3', <TranslationContainer translationKey="word" key="00" />],
      3: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="03" />,
      ],
      7: ['w3', 'x3', <TranslationContainer translationKey="word" key="07" />],
    },
    1: {
      1: ['w2', 'x2', <TranslationContainer translationKey="word" key="11" />],
      5: [
        'l3',
        'x3',
        <TranslationContainer translationKey="letter" key="15" />,
      ],
    },
    2: {
      2: ['w2', 'x2', <TranslationContainer translationKey="word" key="22" />],
      6: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="26" />,
      ],
    },
    3: {
      0: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="30" />,
      ],
      3: ['w2', 'x2', <TranslationContainer translationKey="word" key="33" />],
      7: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="37" />,
      ],
    },
    4: {
      4: ['w2', 'x2', <TranslationContainer translationKey="word" key="44" />],
    },
    5: {
      1: [
        'l3',
        'x3',
        <TranslationContainer translationKey="letter" key="51" />,
      ],
    },
    6: {
      2: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="62" />,
      ],
      6: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="66" />,
      ],
    },
    7: {
      0: ['w3', 'x3', <TranslationContainer translationKey="word" key="70" />],
      3: [
        'l2',
        'x2',
        <TranslationContainer translationKey="letter" key="73" />,
      ],
    },
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

  readonly state = { board: this.boardWithBonuses };

  render() {
    return (
      <div>
        {this.props.board && this.props.previousBoard ? (
          <table className="table-board">
            <tbody>
              {this.state.board.map((row, yIndex) => {
                return (
                  <tr key={yIndex}>
                    {row.map((cell, xIndex) => {
                      cell.letter =
                        this.props.wildCardOnBoard[yIndex] &&
                        this.props.wildCardOnBoard[yIndex][xIndex]
                          ? this.props.wildCardOnBoard[yIndex][xIndex]
                          : this.props.board[yIndex][xIndex];
                      return (
                        <td
                          className={'board-table-cell'}
                          data-letter={cell.letter}
                          data-x={xIndex}
                          data-y={yIndex}
                          key={`${yIndex}_${xIndex}`}
                          onClick={this.props.clickBoard}
                        >
                          <div
                            className={`cell  
                            center-${yIndex === 7 && xIndex === 7} 
                            ${cell.className} user-letter-${!!this.props
                              .userBoard[yIndex][xIndex]} new-letter-${
                              !!this.props.board[yIndex][xIndex] &&
                              !this.props.previousBoard[yIndex][xIndex]
                            }`}
                          >
                            <p className="multiply">{cell.multiply}</p>
                            <p className="unit">{cell.unit}</p>
                            <p className="value-on-board">
                              {cell.letter && this.props.values[cell.letter[0]]}{' '}
                              {/*change letter into letter[0] to show zero value for '*' */}
                              {this.props.userBoard[yIndex][xIndex] !== '' &&
                                this.props.values[
                                  this.props.userBoard[yIndex][xIndex]
                                ]}
                            </p>
                            {cell.letter}
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
          <TranslationContainer translationKey="loading" />
        )}
      </div>
    );
  }
}

export default Board;
