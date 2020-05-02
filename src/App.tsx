import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";

import LoginContainer from "./components/LoginContainer";
import SignupContainer from "./components/SignupContainer";
import Toolbar from "./components/Toolbar";
import LobbyContainer from "./components/LobbyContainer";
import RoomContainer from "./components/RoomContainer";
import GameContainer from "./components/GameContainer";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/ForgotPassword";
import { getProfileFetch } from "./actions/authorization";
import { url } from "./url";

import "./App.css";

class App extends Component {
  stream = new EventSource(`${url}/stream`);

  componentDidMount() {
    document.addEventListener("touchstart", function () {}, true);
    this.props.dispatch(getProfileFetch(localStorage.jwt));
    this.stream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  render() {
    return [
      <div className="App" key="app">
        <Toolbar />
        <Switch>
          <Route path="/signup" component={SignupContainer} />
          <Route path="/login" component={LoginContainer} />
          <Route path="/change-password" component={ChangePassword} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/room/:room" component={RoomContainer} />
          <Route path="/game/:game" component={GameContainer} />
          <Route path="/" component={LobbyContainer} />
        </Switch>
      </div>,
      <footer key="footer">
        {"Copyright © "}
        <a href="https://ksinia.net/cv/">Ksenia Gulyaeva</a>{" "}
        {new Date().getFullYear()}
      </footer>,
    ];
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}
export default connect(mapStateToProps)(App);
