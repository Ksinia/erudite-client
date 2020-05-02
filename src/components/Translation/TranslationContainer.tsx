import React, { Component } from "react";
import { connect } from "react-redux";
import { TRANSLATIONS } from "../../constants/translations";
import Translation from "./Translation";

type Props = {
  translationKey: string;
  locale: string;
  args: string[];
};

class TranslationContainer extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      translation: "",
    };
  }

  componentDidMount() {
    this._updateTranslation(
      this.props.translationKey,
      this.props.locale,
      this.props.args
    );
  }

  componentDidUpdate(prevProps: Props) {
    // update the translation if one of the props has changed
    if (
      this.props.translationKey !== prevProps.translationKey ||
      this.props.locale !== prevProps.locale ||
      this.props.args !== prevProps.args
    ) {
      this._updateTranslation(
        this.props.translationKey,
        this.props.locale,
        this.props.args
      );
    }
  }

  _updateTranslation(
    translationKey: string,
    activeLanguageCode: string,
    args: string[]
  ) {
    if (translationKey && activeLanguageCode) {
      try {
        let translation = TRANSLATIONS[activeLanguageCode][translationKey];
        if (args && args.length > 0) {
          args.forEach((arg) => (translation = translation.replace("{}", arg)));
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
