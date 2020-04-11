import React, { Component } from "react";
import { LANG_NAMES } from "../../constants/translations";

export default class LangSwitch extends Component {
  render() {
    return (
      <div className="lang">
        {LANG_NAMES.map((language, i) => (
          <button
            key={i}
            style={{
              fontWeight: this.props.locale === language.locale ? "bold" : "",
            }}
            onClick={() => {
              this.props.setLanguage(language.locale);
              localStorage.setItem("locale", language.locale);
            }}
          >
            {language.name}
          </button>
        ))}
      </div>
    );
  }
}
