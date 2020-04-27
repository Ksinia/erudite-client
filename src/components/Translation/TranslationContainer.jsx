import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { TRANSLATIONS } from "../../constants/translations";
import Translation from "./Translation";

class TranslationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translation: "",
    };
  }

  componentDidMount() {
    this._updateTranslation(this.props.translationKey, this.props.locale, this.props.args);
  }

  componentDidUpdate(prevProps) {
    // update the translation if one of the props has changed
    if (
      this.props.translationKey !== prevProps.translationKey ||
      this.props.locale !== prevProps.locale || this.props.args !== prevProps.args
    ) {
      this._updateTranslation(this.props.translationKey, this.props.locale, this.props.args);
    }
  }

  _updateTranslation(translationKey, activeLanguageCode, args) {
    if (translationKey && activeLanguageCode) {
      try {
        let translation = TRANSLATIONS[activeLanguageCode][translationKey];
        if (args && args.length > 0) {
          args.forEach(
            (arg) => (translation = translation.replace("{}", arg))
          );
        }
        this.setState({
          translation,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  render() {
    if (!this.state.translation || this.state.translation === "") return null;
    return <Translation translation={this.state.translation} />;
  }
}

function mapStateToProps(state) {
  return {
    locale: state.translation.locale,
  };
}

export default connect(mapStateToProps, null)(TranslationContainer);

TranslationContainer.propTypes = {
  translationKey: PropTypes.string.isRequired,
  locale: PropTypes.string,
};
