import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { RootState } from "./reducer/index";
import LoginContainer from "./components/LoginContainer";
import SignupContainer from "./components/SignupContainer";
import Toolbar from "./components/Toolbar";
import LobbyContainer from "./components/LobbyContainer";
import RoomContainer from "./components/RoomContainer";
import GameContainer from "./components/GameContainer";
import ForgotPassword from "./components/ForgotPassword";
import { getProfileFetch } from "./actions/authorization";
import "./App.css";
import UserPage from "./components/UserPage";

type DispatchProps = {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
};

class App extends Component<DispatchProps> {
  componentDidMount() {
    document.addEventListener("touchstart", function () {}, true);
    this.props.dispatch(getProfileFetch(localStorage.jwt));
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
          <Route path="/room/:room" component={RoomContainer} />
          <Route path="/game/:game" component={GameContainer} />
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
  };
}
export default connect(mapStateToProps)(App);
