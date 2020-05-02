import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as translationActions from "../Translation/actions";
import LangSwitch from "./LangSwitch";

type Props = {
  locale: string;
  translationActions: {setLanguage};
};

class LangSwitchContainer extends Component<Props> {
  render() {
    return (
      <LangSwitch
        locale={this.props.locale}
        setLanguage={this.props.translationActions.setLanguage}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.translation.locale,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    translationActions: bindActionCreators(translationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);