import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../../reducer';
import { setLanguage } from '../Translation/reducer';
import LangSwitch from './LangSwitch';

interface StateProps {
  locale: string;
}

interface DispatchProps {
  translationActions: typeof setLanguage;
}

type Props = StateProps & DispatchProps;

class LangSwitchContainer extends Component<Props> {
  render() {
    return (
      <LangSwitch
        locale={this.props.locale}
        setLanguage={this.props.translationActions}
      />
    );
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    locale: state.translation.locale,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    translationActions: bindActionCreators(setLanguage, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LangSwitchContainer);
