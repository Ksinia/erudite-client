import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

import { RootState } from './reducer';
import LoginContainer from './components/LoginContainer';
import SignupContainer from './components/SignupContainer';
import Toolbar from './components/Toolbar';
import LobbyContainer from './components/LobbyContainer';
import ForgotPassword from './components/ForgotPassword';
import { getProfileFetch } from './actions/authorization';
import UserPage from './components/UserPage/UserPage';
import GameHandler from './components/GameHandler';
import ConfirmEmail from './components/ConfirmEmail';
import './App.css';
import { User } from './reducer/types';
import {
  ADD_USER_TO_SOCKET,
  OutgoingMessageTypes,
  REMOVE_USER_FROM_SOCKET,
} from './constants/outgoingMessageTypes';
import { saveSubscriptionForUser } from './actions/api-call';
import Rules from './components/Rules';
import { addUserToSocket } from './actions/user';
import { SUBSCRIPTION_REGISTERED } from './constants/internalMessageTypes';

interface OwnProps {
  user: User | null;
  subscription: PushSubscription | null;
}

type DispatchProps = {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    ADD_USER_TO_SOCKET | REMOVE_USER_FROM_SOCKET | SUBSCRIPTION_REGISTERED
  >;
};

type Props = DispatchProps & OwnProps;

class App extends Component<Props> {
  componentDidMount() {
    document.addEventListener('touchstart', function () {}, true);
    this.props.dispatch(getProfileFetch(localStorage.jwt));
    if (this.props.user && this.props.user.jwt) {
      this.props.dispatch(addUserToSocket(this.props.user.jwt));
      if (this.props.subscription) {
        this.props.dispatch(
          saveSubscriptionForUser(this.props.subscription as PushSubscription)
        );
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user && this.props.user.jwt) {
        this.props.dispatch(addUserToSocket(this.props.user.jwt));
        if (this.props.subscription) {
          this.props.dispatch(
            saveSubscriptionForUser(this.props.subscription as PushSubscription)
          );
        }
      } else {
        this.props.dispatch({
          type: OutgoingMessageTypes.REMOVE_USER_FROM_SOCKET,
        });
      }
    }
    if (!prevProps.subscription && this.props.subscription && this.props.user) {
      this.props.dispatch(
        saveSubscriptionForUser(this.props.subscription as PushSubscription)
      );
    }
  }

  render() {
    return [
      <div className="App" key="app">
        <Toolbar />
        <Switch>
          <Route path="/signup" component={SignupContainer} />
          <Route path="/login" component={LoginContainer} />
          <Route path="/user" component={UserPage} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/game/:game" component={GameHandler} />
          <Route path="/confirm-email" component={ConfirmEmail} />
          <Route path="/rules" component={Rules} />
          <Route path="/" component={LobbyContainer} />
        </Switch>
      </div>,
      <footer key="footer">
        {'Copyright © '}
        <a href="https://ksinia.net/cv/">Ksenia Gulyaeva</a>{' '}
        {new Date().getFullYear()},{' '}
        <a href="https://github.com/Ksinia/erudite-client">Source Code</a>
      </footer>,
    ];
  }
}

function mapStateToProps(state: RootState) {
  return {
    user: state.user,
    subscription: state.subscription,
  };
}
export default connect(mapStateToProps)(App);
