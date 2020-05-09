import React, { Component } from "react";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";

import * as translationActions from "../Translation/actions";
import { RootState } from "../../reducer";
import LangSwitch from "./LangSwitch";

interface StateProps {
  locale: string;
}

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

interface OwnProps {
  translationActions: { [key: string]: (locale: string) => AnyAction };
}

type Props = StateProps & DispatchProps & OwnProps;

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

export default connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);
