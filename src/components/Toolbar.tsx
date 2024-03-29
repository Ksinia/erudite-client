import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';

import { logOut } from '../reducer/auth';
import './Toolbar.css';
import { RootState } from '../reducer';
import { User } from '../reducer/types';
import LangSwitchContainer from './LangSwitch/LangSwitchContainer';
import TranslationContainer from './Translation/TranslationContainer';

interface StateProps {
  user: User | null;
}

type Props = StateProps & DispatchProp;

class Toolbar extends Component<Props> {
  handleClick = () => {
    const action = logOut();
    this.props.dispatch(action);
  };

  render() {
    return (
      <div className="toolbar">
        <LangSwitchContainer />
        <Link to="/rules">
          <TranslationContainer translationKey="toolbar_rules" />
        </Link>
        <Link to="/">
          <TranslationContainer translationKey="toolbar_list" />
        </Link>
        {!this.props.user && (
          <Link
            to={`/signup?prev=${
              window.location.pathname + window.location.search
            }`}
          >
            <TranslationContainer translationKey="sign_up" />
          </Link>
        )}

        {this.props.user && (
          <Link to="/user">
            <TranslationContainer translationKey="welcome" />{' '}
            {this.props.user.name}!
          </Link>
        )}

        {!this.props.user && (
          <Link
            to={`/login?prev=${
              window.location.pathname + window.location.search
            }`}
          >
            <TranslationContainer translationKey="log_in" />
          </Link>
        )}

        {this.props.user && (
          <Link to="#" className="logout" onClick={this.handleClick}>
            <TranslationContainer translationKey="log_out" />
          </Link>
        )}
      </div>
    );
  }
}
function mapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Toolbar);
