import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as translationActions from "../Translation/actions";
import LangSwitch from "./LangSwitch";
import { RootState } from "../../reducer";

interface StateProps {
  locale: string;
}

interface DispatchProps {
  toggleOn: () => void
}

interface OwnProps {
  translationActions: {setLanguage};
}

type Props = StateProps & DispatchProps & OwnProps

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

function mapDispatchToProps(dispatch) {
  return {
    translationActions: bindActionCreators(translationActions, dispatch),
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);
