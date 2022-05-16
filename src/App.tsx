import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { RootState } from "./reducer";
import LoginContainer from "./components/LoginContainer";
import SignupContainer from "./components/SignupContainer";
import Toolbar from "./components/Toolbar";
import LobbyContainer from "./components/LobbyContainer";
import ForgotPassword from "./components/ForgotPassword";
import { getProfileFetch } from "./actions/authorization";
import UserPage from "./components/UserPage/UserPage";
import GameHandler from "./components/GameHandler";
import "./App.css";
import { User } from "./reducer/types";
import {
  ADD_USER_TO_SOCKET,
  REMOVE_USER_FROM_SOCKET,
} from "./constants/outgoingMessageTypes";
import { saveSubscriptionForUser } from "./actions/api-call";

interface OwnProps {
  user: User;
  subscription: PushSubscription;
}

type DispatchProps = {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
};

type Props = DispatchProps & OwnProps;

class App extends Component<Props> {
  componentDidMount() {
    document.addEventListener("touchstart", function () {}, true);
    this.props.dispatch(getProfileFetch(localStorage.jwt));
    if (this.props.user) {
      this.props.dispatch({
        type: ADD_USER_TO_SOCKET,
        payload: this.props.user.jwt,
      });
      if (this.props.subscription){
        saveSubscriptionForUser(this.props.subscription as PushSubscription)
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user !== this.props.user) {
      if (this.props.user) {
        this.props.dispatch({
          type: ADD_USER_TO_SOCKET,
          payload: this.props.user.jwt,
        });
        if (this.props.subscription){
          saveSubscriptionForUser(this.props.subscription as PushSubscription)
        }
      } else {
        this.props.dispatch({ type: REMOVE_USER_FROM_SOCKET });
      }
    }
    if (!prevProps.subscription && this.props.subscription && this.props.user) {
      saveSubscriptionForUser(this.props.subscription as PushSubscription)
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
          <Route path="/" component={LobbyContainer} />
        </Switch>
      </div>,
      <footer key="footer">
        {"Copyright © "}
        <a href="https://ksinia.net/cv/">Ksenia Gulyaeva</a>{" "}
        {new Date().getFullYear()},{" "}
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
