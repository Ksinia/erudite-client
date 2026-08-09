import React, { PureComponent } from 'react';

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
  bonusLabels: { word: string; letter: string };
};

const PATTERN_SIZE = 15;
// the pattern repeats every 14 cells: the outer x3 rows/columns are
// identical, so adjacent tiles share one border row instead of doubling it
const PATTERN_PERIOD = PATTERN_SIZE - 1;
const CELL_SIZE_REM = 2.1;

const mod = (n: number): number =>
  ((n % PATTERN_PERIOD) + PATTERN_PERIOD) % PATTERN_PERIOD;

type BoardOrigin = { x: number; y: number };

const DEFAULT_ORIGIN: BoardOrigin = { x: 0, y: 0 };

/**
 * Coordinates of the cell within the repeating bonus pattern. On a classic
 * board they are the cell coordinates themselves; on an infinite board the
 * pattern tiles the plane, anchored at boardOrigin.
 */
export const patternCoords = (
  y: number,
  x: number,
  boardType?: string,
  boardOrigin?: BoardOrigin
): [number, number] => {
  if (boardType === 'infinite') {
    const origin = boardOrigin || DEFAULT_ORIGIN;
    return [mod(y - origin.y), mod(x - origin.x)];
  }
  return [y, x];
};

// the start star marks only the centre of the original board,
// it is not repeated on the tiled neighbours
export const isCenterCell = (
  y: number,
  x: number,
  boardType?: string,
  boardOrigin?: BoardOrigin
): boolean => {
  const origin =
    boardType === 'infinite' ? boardOrigin || DEFAULT_ORIGIN : DEFAULT_ORIGIN;
  return y - origin.y === 7 && x - origin.x === 7;
};

type Bonus = [className: string, multiply: string, unit: 'word' | 'letter'];

// the top-left quadrant of the pattern; the rest is mirrored
const boardBonuses: { [y: number]: { [x: number]: Bonus } } = {
  0: {
    0: ['w3', 'x3', 'word'],
    3: ['l2', 'x2', 'letter'],
    7: ['w3', 'x3', 'word'],
  },
  1: { 1: ['w2', 'x2', 'word'], 5: ['l3', 'x3', 'letter'] },
  2: { 2: ['w2', 'x2', 'word'], 6: ['l2', 'x2', 'letter'] },
  3: {
    0: ['l2', 'x2', 'letter'],
    3: ['w2', 'x2', 'word'],
    7: ['l2', 'x2', 'letter'],
  },
  4: { 4: ['w2', 'x2', 'word'] },
  5: { 1: ['l3', 'x3', 'letter'] },
  6: { 2: ['l2', 'x2', 'letter'], 6: ['l2', 'x2', 'letter'] },
  7: { 0: ['w3', 'x3', 'word'], 3: ['l2', 'x2', 'letter'] },
};

export const bonusFor = (py: number, px: number): Bonus | undefined => {
  const row =
    py in boardBonuses ? boardBonuses[py] : boardBonuses[PATTERN_SIZE - 1 - py];
  if (!row) return undefined;
  return px in row ? row[px] : row[PATTERN_SIZE - 1 - px];
};

/**
 * Rendering a connected component in every bonus cell put thousands of
 * store subscribers on a large board, so the two words a bonus can carry
 * are resolved once and passed down as plain strings.
 */
class Board extends PureComponent<Props> {
  viewportRef = React.createRef<HTMLDivElement>();

  patternCoords = (y: number, x: number): [number, number] =>
    patternCoords(y, x, this.props.boardType, this.props.boardOrigin);

  isCenterCell = (y: number, x: number): boolean =>
    isCenterCell(y, x, this.props.boardType, this.props.boardOrigin);

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
    const rows = this.props.board && this.props.board.length;
    if (
      viewport &&
      columns &&
      rows &&
      (origin.x !== prevOrigin.x || origin.y !== prevOrigin.y)
    ) {
      // each axis carries its own border overhead, so measure them apart
      viewport.scrollLeft +=
        ((origin.x - prevOrigin.x) * viewport.scrollWidth) / columns;
      viewport.scrollTop +=
        ((origin.y - prevOrigin.y) * viewport.scrollHeight) / rows;
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
        {board && board.length > 0 && previousBoard ? (
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
                      const bonus = bonusFor(py, px);
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
                          key={xIndex}
                          onClick={this.props.clickBoard}
                        >
                          <div
                            className={`cell
                            center-${this.isCenterCell(yIndex, xIndex)}
                            ${
                              bonus ? bonus[0] : 'ordinary'
                            } user-letter-${!!userLetter} new-letter-${
                              !!boardLetter &&
                              !(
                                previousBoard[yIndex] &&
                                previousBoard[yIndex][xIndex]
                              )
                            }`}
                          >
                            <p className="multiply">{bonus && bonus[1]}</p>
                            <p className="unit">
                              {bonus && this.props.bonusLabels[bonus[2]]}
                            </p>
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
