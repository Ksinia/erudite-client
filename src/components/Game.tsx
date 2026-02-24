import React from 'react';

import { letterValues } from '../constants/letterValues';
import { Game as GameType, User } from '../reducer/types';
import Board from './Board';
import Results from './Results';
import ShareLink from './ShareLink';
import TranslationContainer from './Translation/TranslationContainer';
import WildCardForm from './WildCardForm';

type OwnProps = {
  game: GameType;
  userLetters: string[];
  chosenLetterIndex: number | null;
  userBoard: string[][];
  userBoardEmpty: boolean;
  user: User | null;
  clickBoard: (event: React.SyntheticEvent<HTMLDivElement>) => void;
  clickLetter: (event: React.MouseEvent<HTMLDivElement>) => void;
  confirmTurn: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  validateTurn: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  getNextTurn: (game: GameType) => number;
  returnLetters: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  playAgainWithSamePlayers: (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => void;
  undo: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  change: (event: React.SyntheticEvent<HTMLButtonElement>) => void;
  findTurnUser: (game: GameType, id: number) => User;
  onChangeWildCard: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  wildCardLetters: { letter: string; x: number; y: number }[];
  wildCardOnBoard: { [y: number]: { [x: number]: string } };
  duplicatedWords: string[];
  shuffleLetters: () => void;
};

function Game(props: OwnProps) {
  return (
    <div key="game" className="game">
      <p
        key="game-id"
        style={{ margin: 0, width: '100%', textAlign: 'center' }}
      >
        {props.game.id}
        <ShareLink gameId={props.game.id} started />
      </p>
      <div className="board">
        <Board
          key="board"
          clickBoard={props.clickBoard}
          board={props.game.board}
          previousBoard={props.game.previousBoard}
          userBoard={props.userBoard}
          values={letterValues[props.game.language]}
          wildCardOnBoard={props.wildCardOnBoard}
        />
      </div>

      <div className="controls">
        {props.user && (
          <div className="letters" onClick={props.clickLetter}>
            {props.userLetters.map((letter, index) => {
              let style = {};
              if (index === props.chosenLetterIndex) {
                style = { background: 'whitesmoke' };
              }
              return (
                <div
                  className="letter"
                  key={index}
                  data-letter={letter}
                  data-index={index}
                  style={style}
                >
                  <p className="value-in-hand">
                    {letterValues[props.game.language][letter]}
                  </p>
                  {letter}
                </div>
              );
            })}
          </div>
        )}
        <WildCardForm
          onChange={props.onChangeWildCard}
          wildCardLetters={props.wildCardLetters}
          alphabet={Object.keys(letterValues[props.game.language])}
        />
        {props.duplicatedWords && props.duplicatedWords.length > 0 && (
          <p style={{ color: 'red' }}>
            <TranslationContainer
              translationKey="duplicated"
              args={[props.duplicatedWords.join(', ')]}
            />
          </p>
        )}
        {props.game.phase === 'validation' &&
          props.game.wordsForValidation.length > 0 && (
            <p>
              <TranslationContainer
                translationKey="to_validate"
                args={[props.game.wordsForValidation.join(', ')]}
              />
            </p>
          )}
        {props.user &&
          props.game.turnOrder.includes(props.user.id) &&
          props.user.id ===
            props.game.turnOrder[props.getNextTurn(props.game)] &&
          props.game.phase === 'validation' && (
            <div className="button-row">
              <button key="yes" name="yes" onClick={props.validateTurn}>
                <TranslationContainer
                  translationKey="i_confirm"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </button>
              <button key="no" name="no" onClick={props.validateTurn}>
                <TranslationContainer
                  translationKey="no"
                  args={[
                    props.findTurnUser(
                      props.game,
                      props.game.turnOrder[props.game.turn]
                    ).name,
                  ]}
                />
              </button>
            </div>
          )}
        {props.user &&
          props.game.turnOrder.includes(props.user.id) &&
          props.game.phase !== 'finished' && (
            <div className="button-grid">
              <button onClick={props.shuffleLetters}>
                <TranslationContainer translationKey="shuffle" />
              </button>
              <button
                onClick={props.returnLetters}
                disabled={props.userBoardEmpty}
              >
                <TranslationContainer translationKey="return" />
              </button>
              <button
                onClick={props.confirmTurn}
                disabled={
                  props.game.phase !== 'turn' ||
                  props.game.turnOrder[props.game.turn] !== props.user.id ||
                  props.wildCardLetters.some(
                    (letterObject) => letterObject.letter === ''
                  )
                }
              >
                {props.userBoardEmpty ? (
                  <TranslationContainer translationKey="pass" />
                ) : (
                  <TranslationContainer translationKey="confirm" />
                )}
              </button>
              <button
                onClick={props.change}
                disabled={
                  props.game.phase !== 'turn' ||
                  props.game.turnOrder[props.game.turn] !== props.user.id ||
                  props.game.letters.pot.length === 0
                }
              >
                <TranslationContainer translationKey="change" />
              </button>
            </div>
          )}
        {props.game.phase === 'finished' && props.user && (
          <button key="again" onClick={props.playAgainWithSamePlayers}>
            <TranslationContainer translationKey="play_again" />
          </button>
        )}
        {props.game.phase === 'validation' &&
          props.game.validated === 'no' && [
            <p key="disagree">
              <TranslationContainer
                translationKey="disagree"
                args={[
                  props.findTurnUser(
                    props.game,
                    props.game.turnOrder[props.getNextTurn(props.game)]
                  ).name,
                  props.findTurnUser(
                    props.game,
                    props.game.turnOrder[props.game.turn]
                  ).name,
                ]}
              />
            </p>,
            props.user &&
              props.user.id === props.game.turnOrder[props.game.turn] && (
                <button key="undo" onClick={props.undo}>
                  <TranslationContainer translationKey="undo" />
                </button>
              ),
          ]}
        {props.game.phase !== 'finished' ? (
          props.game.phase === 'validation' ? (
            <p key="validation_of">
              <TranslationContainer
                translationKey="validation"
                args={[
                  props.findTurnUser(
                    props.game,
                    props.game.turnOrder[props.game.turn]
                  ).name,
                ]}
              />
            </p>
          ) : (
            <p key="turn_of">
              <TranslationContainer
                translationKey="turn_of"
                args={[
                  props.findTurnUser(
                    props.game,
                    props.game.turnOrder[props.game.turn]
                  ).name,
                ]}
              />
            </p>
          )
        ) : (
          <p key="game_over">
            <TranslationContainer translationKey="game_over" />
          </p>
        )}
        <p className="section-title">
          <TranslationContainer translationKey="score" />
        </p>
        <div className="score-list">
          {props.game.turnOrder.map((key) => (
            <div key={key} className="score-row">
              <span className="score-name">
                {props.game.users.find((user) => user.id === key)?.name}
              </span>
              <span className="score-value">{props.game.score[key]}</span>
            </div>
          ))}
        </div>
        {props.game.phase === 'finished' && 'result' in props.game && (
          <Results game={props.game} />
        )}
        <p key="letters">
          <TranslationContainer translationKey="letters" />
          {props.game.letters.pot.length}
        </p>
        {props.game.turns && props.game.turns.length > 0 && (
          <div className="turns">
            <p className="section-title">
              <TranslationContainer translationKey="turns" />
            </p>
            <div className="turns-list">
              {props.game.turns
                .slice()
                .reverse()
                .map((turn, index: number) => (
                  <div key={index} className="turn-row">
                    <span className="turn-player">
                      {
                        props.game.users.find((user) => user.id === turn.user)
                          ?.name
                      }
                    </span>
                    <span className="turn-details">
                      {turn.words.length > 0 ? (
                        <>
                          {turn.score}
                          {': '}
                          {turn.words
                            .map(
                              (word) =>
                                `${Object.keys(word)[0]} ${
                                  word[Object.keys(word)[0]]
                                }`
                            )
                            .join(', ')}
                        </>
                      ) : turn.changedLetters ? (
                        <TranslationContainer translationKey="changed" />
                      ) : (
                        <TranslationContainer translationKey="passed" />
                      )}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Game;
