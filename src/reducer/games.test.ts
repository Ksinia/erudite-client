import reducer, { expandBoards, gameUpdated } from './games';
import { Game } from './types';

const asGame = (fields: Partial<Game>): Game => fields as Game;

describe('expandBoards', () => {
  it('leaves a classic game as it arrived', () => {
    const board = [
      ['а', null],
      [null, 'б'],
    ];
    const game = asGame({ id: 1, board, previousBoard: board });
    expect(expandBoards(game)).toBe(game);
  });

  it('rebuilds a square board from its occupied cells', () => {
    const game = asGame({
      id: 1,
      boardType: 'infinite',
      boardSize: { rows: 3, cols: 3 },
      boardCells: [
        [0, 0, 'а'],
        [2, 2, 'б'],
      ],
      previousBoardCells: [[0, 0, 'а']],
    });
    const expanded = expandBoards(game);
    expect(expanded.board).toEqual([
      ['а', null, null],
      [null, null, null],
      [null, null, 'б'],
    ]);
    expect(expanded.previousBoard).toEqual([
      ['а', null, null],
      [null, null, null],
      [null, null, null],
    ]);
  });

  it('rebuilds a board that is wider than it is tall', () => {
    const game = asGame({
      id: 1,
      boardType: 'infinite',
      boardSize: { rows: 2, cols: 4 },
      boardCells: [[1, 3, 'я']],
      previousBoardCells: [],
    });
    const expanded = expandBoards(game);
    expect(expanded.board.length).toBe(2);
    expect(expanded.board[0].length).toBe(4);
    expect(expanded.board[1][3]).toBe('я');
    expect(expanded.previousBoard.flat().every((c) => c === null)).toBe(true);
  });

  it('keeps wildcards whole', () => {
    const game = asGame({
      id: 1,
      boardType: 'infinite',
      boardSize: { rows: 1, cols: 2 },
      boardCells: [[0, 1, '*ы']],
      previousBoardCells: [],
    });
    expect(expandBoards(game).board[0][1]).toBe('*ы');
  });

  it('rebuilds an empty board', () => {
    const game = asGame({
      id: 1,
      boardType: 'infinite',
      boardSize: { rows: 15, cols: 15 },
      boardCells: [],
      previousBoardCells: [],
    });
    const expanded = expandBoards(game);
    expect(expanded.board.length).toBe(15);
    expect(expanded.board.flat().filter(Boolean).length).toBe(0);
  });
});

describe('games reducer', () => {
  it('stores an infinite game expanded, whichever way it arrived', () => {
    const state = reducer(
      {},
      gameUpdated({
        gameId: 5,
        game: asGame({
          id: 5,
          boardType: 'infinite',
          boardSize: { rows: 2, cols: 2 },
          boardCells: [[1, 1, 'к']],
          previousBoardCells: [],
        }),
      })
    );
    expect(state[5].board).toEqual([
      [null, null],
      [null, 'к'],
    ]);
  });
});
