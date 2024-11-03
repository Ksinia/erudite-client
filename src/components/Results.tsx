import React from 'react';

import { Game } from '../reducer/types';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  game: Game;
};

function transformResults(game: Game) {
  const results = [];
  if (game.result.winner.length > 0) {
    results.push([
      'winner',
      game.result.winner
        .map((w) => game.users.find((user) => user.id === parseInt(w))?.name)
        .join(', '),
    ]);
  }
  if (game.result.longestWord.length > 0) {
    const longestWord = game.result.longestWord.reduce(
      (acc, el) => {
        if (el.user in acc) {
          acc[el.user].push(el.word);
        } else {
          acc[el.user] = [el.word];
        }
        return acc;
      },
      {} as { [id: number]: string[] }
    );
    results.push([
      'longest_word',
      Object.keys(longestWord)
        .map(
          (userId) =>
            `${
              game.users.find((user) => user.id === parseInt(userId))?.name
            }: ${longestWord[parseInt(userId)].join(', ')}`
        )
        .join(', '),
    ]);
  }
  if (game.result.maxScoreWord.length > 0) {
    const maxScoreWord = game.result.maxScoreWord.reduce(
      (acc, el) => {
        if (el.user in acc) {
          acc[el.user].push(el.word);
        } else {
          acc[el.user] = [el.word];
        }
        return acc;
      },
      {} as { [id: number]: string[] }
    );
    results.push([
      'valuable_word',
      Object.keys(maxScoreWord)
        .map(
          (userId) =>
            `${
              game.users.find((user) => user.id === parseInt(userId))?.name
            }: ${maxScoreWord[parseInt(userId)].join(', ')}`
        )
        .join(', ') + ` (${game.result.maxScoreWord[0].value})`,
    ]);
  }
  if (
    game.result.bestTurnByCount.length &&
    game.result.bestTurnByCount[0].qty > 0
  ) {
    results.push([
      'max_words',
      `${game.result.bestTurnByCount
        .reduce(
          (acc, el) => {
            const name = game.users.find((user) => user.id === el.user)?.name;
            if (!acc.includes(name)) {
              acc.push(name);
            }
            return acc;
          },
          [] as (string | undefined)[]
        )
        .join(', ')} (${game.result.bestTurnByCount[0].qty})`,
    ]);
  }
  if (
    game.result.bestTurnByValue.length &&
    game.result.bestTurnByValue[0].score > 0
  ) {
    results.push([
      'valuable_turn',
      `${game.result.bestTurnByValue
        .reduce(
          (acc, el) => {
            const name = game.users.find((user) => user.id === el.user)?.name;
            if (!acc.includes(name)) {
              acc.push(name);
            }
            return acc;
          },
          [] as (string | undefined)[]
        )
        .join(', ')} (${game.result.bestTurnByValue[0].score})`,
    ]);
  }
  if (game.result.neverChangedLetters.length > 0) {
    results.push([
      'never_changed',
      game.result.neverChangedLetters
        .map((el) => game.users.find((user) => user.id === el)?.name)
        .join(', '),
    ]);
  }
  return results;
}

function Results(props: OwnProps) {
  return (
    <div className="result">
      <p>
        <TranslationContainer translationKey="results" />
      </p>
      <table className="table-result">
        <tbody>
          {transformResults(props.game).map((result) => {
            return (
              <tr key={result[0]}>
                <td key={result[0]}>
                  <TranslationContainer translationKey={result[0]} />
                </td>
                <td key="details">{result[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Results;
