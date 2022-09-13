import React from 'react';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  wildCardLetters: { letter: string; x: number; y: number }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  alphabet: string[];
};
function WildCardForm(props: OwnProps) {
  if (props.wildCardLetters.length === 0) {
    return null;
  }
  const options = props.alphabet.sort().map((letter) => {
    if (letter !== '*') {
      return (
        <option key={letter} value={letter}>
          {letter}
        </option>
      );
    } else {
      return null;
    }
  });
  const form = props.wildCardLetters.map((letterObject, index) => (
    <select
      key={index}
      name={String(index)}
      data-x={letterObject.x}
      data-y={letterObject.y}
      onChange={props.onChange}
      value={props.wildCardLetters[index].letter}
    >
      <option value=""></option>
      {options}
    </select>
  ));

  return (
    <div>
      <TranslationContainer translationKey="select" />
      {form}
    </div>
  );
}

export default WildCardForm;
