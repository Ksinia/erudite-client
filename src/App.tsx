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
import { getProfileFetch } from './thunkActions/authorization';
import UserPage from './components/UserPage/UserPage';
import GameHandler from './components/GameHandler';
import ConfirmEmail from './components/ConfirmEmail';
import './App.css';
import { User } from './reducer/types';
import { saveSubscriptionForUser } from './thunkActions/api-call';
import Rules from './components/Rules';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import {
  addUserToSocket,
  AddUserToSocketAction,
  removeUserFromSocket,
  RemoveUserFromSocketAction,
} from './reducer/outgoingMessages';

interface StateProps {
  user: User | null;
  subscription: PushSubscription | null;
}

type DispatchProps = {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    AddUserToSocketAction | RemoveUserFromSocketAction
  >;
};

type Props = DispatchProps & StateProps;

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
        this.props.dispatch(removeUserFromSocket());
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
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/" component={LobbyContainer} />
        </Switch>
      </div>,
      <footer key="footer">
        {'Copyright © '}
        <a href="https://ksinia.net/cv/">Ksenia Gulyaeva</a>{' '}
        {new Date().getFullYear()},{' '}
        <a href="https://github.com/Ksinia/erudite-client">Source Code</a>
        {' | '}
        <a href="/privacy">Privacy</a>
        {' | '}
        <a href="/terms">Terms</a>
      </footer>,
    ];
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
    subscription: state.subscription,
  };
}
export default connect(mapStateToProps)(App);
