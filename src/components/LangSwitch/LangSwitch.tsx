import React, { Component } from 'react';

import { LANG_NAMES } from '../../constants/translations';
import { setLanguage } from '../Translation/actions';

type Props = {
  locale: string;
  setLanguage: typeof setLanguage;
};

export default class LangSwitch extends Component<Props> {
  render() {
    return (
      <div className="lang">
        {LANG_NAMES.map((language, i) => (
          <button
            key={i}
            style={{
              fontWeight:
                this.props.locale === language.locale ? 'bold' : undefined,
            }}
            onClick={() => {
              this.props.setLanguage(language.locale);
              localStorage.setItem('locale', language.locale);
            }}
          >
            {language.name}
          </button>
        ))}
      </div>
    );
  }
}
