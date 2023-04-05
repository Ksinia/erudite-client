import React, { FunctionComponent } from 'react';
import TranslationContainer from './Translation/TranslationContainer';

const Rules: FunctionComponent = () => {
  return (
    <p className="rules">
      <TranslationContainer translationKey="rules" />
    </p>
  );
};

export default Rules;
