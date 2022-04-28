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
import { connectToSocket } from "./actions/user";
import UserPage from "./components/UserPage/UserPage";
import GameHandler from "./components/GameHandler";
import "./App.css";
import { User } from "./reducer/types";
import {
  ADD_USER_TO_SOCKET,
  REMOVE_USER_FROM_SOCKET,
} from "./actions/outgoingMessageTypes";

interface OwnProps {
  user: User;
  socket: SocketIOClient.Socket;
}

type DispatchProps = {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
};

type Props = DispatchProps & OwnProps;

class App extends Component<Props> {
  componentDidMount() {
    document.addEventListener("touchstart", function () {}, true);
    this.props.dispatch(getProfileFetch(localStorage.jwt));

    // TODO: do I need dispatch here? Or just function?
    this.props.dispatch(connectToSocket(localStorage.jwt));
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.socket && prevProps.user !== this.props.user) {
      if (this.props.user) {
        this.props.socket.send({
          type: ADD_USER_TO_SOCKET,
          payload: this.props.user.jwt,
        });
      } else {
        this.props.socket.send({ type: REMOVE_USER_FROM_SOCKET });
      }
    }
  }

  componentWillUnmount() {
    if (this.props.socket) {
      this.props.socket.close();
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
    socket: state.socket,
  };
}
export default connect(mapStateToProps)(App);
