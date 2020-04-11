import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { TRANSLATIONS } from "../../constants/translations";
import Translation from "./Translation";

class TranslationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translation: ""
    };
  }

  componentDidMount() {
    this._updateTranslation(this.props.translationKey, this.props.locale);
  }

  componentWillReceiveProps(nextProps) {
    // update the translation if one of the props will change
    if (
      this.props.translationKey !== nextProps.translationKey ||
      this.props.locale !== nextProps.locale
    ) {
      this._updateTranslation(nextProps.translationKey, nextProps.locale);
    }
  }

  _updateTranslation(translationKey, activeLanguageCode) {
    if (translationKey && activeLanguageCode) {

      try {
        let translation = TRANSLATIONS[activeLanguageCode][translationKey];
        if (this.props.args && this.props.args.length > 0) {
          this.props.args.forEach(arg => translation = translation.replace("{}", arg))
        }
        this.setState({
          translation
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
    locale: state.translation.locale
  };
}

export default connect(mapStateToProps, null)(TranslationContainer);

TranslationContainer.propTypes = {
  translationKey: PropTypes.string.isRequired,
  locale: PropTypes.string
};
