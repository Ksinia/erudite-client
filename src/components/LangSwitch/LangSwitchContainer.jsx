import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as translationActions from "../Translation/actions";
import LangSwitch from "./LangSwitch";

class LangSwitchContainer extends Component {
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
    locale: state.translation.locale
  };
}

function mapDispatchToProps(dispatch) {
  return {
    translationActions: bindActionCreators(translationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);

LangSwitchContainer.propTypes = {
  locale: PropTypes.string,
  translationActions: PropTypes.object
};
