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
  boardType?: 'classic' | 'infinite';
  boardOrigin?: { x: number; y: number };
};

const PATTERN_SIZE = 15;
// the pattern repeats every 14 cells: the outer x3 rows/columns are
// identical, so adjacent tiles share one border row instead of doubling it
const PATTERN_PERIOD = PATTERN_SIZE - 1;
const CELL_SIZE_REM = 2.1;

const mod = (n: number): number =>
  ((n % PATTERN_PERIOD) + PATTERN_PERIOD) % PATTERN_PERIOD;

class Board extends Component<Props> {
  viewportRef = React.createRef<HTMLDivElement>();

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

  /**
   * Coordinates of the cell within the repeating 15x15 bonus pattern.
   * On a classic board they are the cell coordinates themselves; on an
   * infinite board the pattern tiles the plane, anchored at boardOrigin.
   */
  patternCoords = (y: number, x: number): [number, number] => {
    if (this.props.boardType === 'infinite') {
      const origin = this.props.boardOrigin || { x: 0, y: 0 };
      return [mod(y - origin.y), mod(x - origin.x)];
    }
    return [y, x];
  };

  // the start star marks only the centre of the original board,
  // it is not repeated on the tiled neighbours
  isCenterCell = (y: number, x: number): boolean => {
    if (this.props.boardType === 'infinite') {
      const origin = this.props.boardOrigin || { x: 0, y: 0 };
      return y - origin.y === 7 && x - origin.x === 7;
    }
    return y === 7 && x === 7;
  };

  // the bonus map holds the top-left quadrant; the rest is mirrored
  bonusFor = (py: number, px: number): (string | JSX.Element)[] | undefined => {
    const row =
      py in this.boardBonuses
        ? this.boardBonuses[py]
        : this.boardBonuses[PATTERN_SIZE - 1 - py];
    if (!row) return undefined;
    return px in row ? row[px] : row[PATTERN_SIZE - 1 - px];
  };

  centerViewport = () => {
    const viewport = this.viewportRef.current;
    if (viewport && this.props.boardType === 'infinite') {
      viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) / 2;
      viewport.scrollTop = (viewport.scrollHeight - viewport.clientHeight) / 2;
    }
  };

  componentDidMount() {
    this.centerViewport();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.boardType !== 'infinite') return;
    if (!prevProps.board && this.props.board) {
      this.centerViewport();
      return;
    }
    // when the board grows on the top/left the content shifts by the origin
    // delta; compensate the scroll position so the view doesn't jump
    const viewport = this.viewportRef.current;
    const prevOrigin = prevProps.boardOrigin || { x: 0, y: 0 };
    const origin = this.props.boardOrigin || { x: 0, y: 0 };
    const columns = this.props.board && this.props.board[0].length;
    if (
      viewport &&
      columns &&
      (origin.x !== prevOrigin.x || origin.y !== prevOrigin.y)
    ) {
      const cellPx = viewport.scrollWidth / columns;
      viewport.scrollLeft += (origin.x - prevOrigin.x) * cellPx;
      viewport.scrollTop += (origin.y - prevOrigin.y) * cellPx;
    }
  }

  render() {
    const { board, previousBoard, userBoard, wildCardOnBoard, values } =
      this.props;
    const infinite = this.props.boardType === 'infinite';
    return (
      <div
        className={`board-viewport${infinite ? ' infinite' : ''}`}
        ref={this.viewportRef}
      >
        {board && previousBoard ? (
          <table
            className="table-board"
            style={
              infinite
                ? {
                    width: `${board[0].length * CELL_SIZE_REM}rem`,
                    height: `${board.length * CELL_SIZE_REM}rem`,
                  }
                : undefined
            }
          >
            <tbody>
              {board.map((boardRow, yIndex) => {
                return (
                  <tr key={yIndex}>
                    {boardRow.map((boardLetter, xIndex) => {
                      const [py, px] = this.patternCoords(yIndex, xIndex);
                      const bonus = this.bonusFor(py, px);
                      const letter =
                        wildCardOnBoard[yIndex] &&
                        wildCardOnBoard[yIndex][xIndex]
                          ? wildCardOnBoard[yIndex][xIndex]
                          : boardLetter;
                      const userLetter =
                        (userBoard[yIndex] && userBoard[yIndex][xIndex]) || '';
                      return (
                        <td
                          className={'board-table-cell'}
                          data-letter={letter}
                          data-x={xIndex}
                          data-y={yIndex}
                          key={`${yIndex}_${xIndex}`}
                          onClick={this.props.clickBoard}
                        >
                          <div
                            className={`cell
                            center-${this.isCenterCell(yIndex, xIndex)}
                            ${
                              bonus ? bonus[0] : 'ordinary'
                            } user-letter-${!!userLetter} new-letter-${
                              !!boardLetter && !previousBoard[yIndex][xIndex]
                            }`}
                          >
                            <p className="multiply">{bonus && bonus[1]}</p>
                            <p className="unit">{bonus && bonus[2]}</p>
                            <p className="value-on-board">
                              {letter && values[letter[0]]}{' '}
                              {/*change letter into letter[0] to show zero value for '*' */}
                              {userLetter !== '' && values[userLetter]}
                            </p>
                            {letter}
                            {userLetter}
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
