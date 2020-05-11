import React, { Component } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import * as translationActions from "../Translation/actions";
import { RootState } from "../../reducer";
import LangSwitch from "./LangSwitch";

interface StateProps {
  locale: string;
}

interface DispatchProps {
  translationActions: typeof translationActions;
}

type Props = StateProps & DispatchProps;

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

function mapStateToProps(state: RootState) {
  return {
    locale: state.translation.locale,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    translationActions: bindActionCreators(translationActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);
