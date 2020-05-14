import React from "react";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  wildCardQty: number;
  wildCardLetters: string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  alphabet: string[];
};
function WildCardForm(props: OwnProps) {
  if (props.wildCardQty === 0) {
    return null;
  }
  const options = props.alphabet.sort().map((letter) => {
    if (letter !== "*") {
      return (
        <option key={letter} value={letter}>
          {letter}
        </option>
      );
    } else {
      return null;
    }
  });
  const form = Array(props.wildCardQty)
    .fill(null)
    .map((_, index) => (
      <select
        key={index}
        name={String(index)}
        onChange={props.onChange}
        value={props.wildCardLetters[index]}
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
