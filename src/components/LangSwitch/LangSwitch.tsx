import React, { Component } from 'react';

import { LANG_NAMES } from '../../constants/translations';
import { setLanguage } from '../Translation/reducer';

type Props = {
  locale: string;
  setLanguage: typeof setLanguage;
};

export default class LangSwitch extends Component<Props> {
  handleToggle = () => {
    const nextLang = LANG_NAMES.find((l) => l.locale !== this.props.locale);
    if (nextLang) {
      this.props.setLanguage({ locale: nextLang.locale });
      localStorage.setItem('locale', nextLang.locale);
    }
  };

  render() {
    const nextLang = LANG_NAMES.find((l) => l.locale !== this.props.locale);
    return (
      <div className="lang">
        <button onClick={this.handleToggle}>{nextLang?.name}</button>
      </div>
    );
  }
}
