import React, { Component } from "react";
import { connect } from "react-redux";
import GithubCorner from "react-github-corner";
import { Switch, Route } from "react-router-dom";

import LoginContainer from "./components/LoginContainer";
import SignupContainer from "./components/SignupContainer";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import LobbyContainer from "./components/LobbyContainer";
import RoomContainer from "./components/RoomContainer";
import GameContainer from "./components/GameContainer";
import { getProfileFetch } from "./actions/authorization.js";
import { url } from "./url";

import "./App.css";

class App extends Component {
  stream = new EventSource(`${url}/stream`);

  componentDidMount() {
    this.props.dispatch(getProfileFetch());
    this.stream.onmessage = event => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  render() {
    return [
      <div className="App" key="app">
        <GithubCorner href="https://github.com/Ksinia/erudit-client" />

        <Toolbar />
        <Switch>
          <Route path="/signup" component={SignupContainer} />
          <Route path="/login" component={LoginContainer} />
          <Route path="/room/:room" component={RoomContainer} />
          <Route path="/game/:game" component={GameContainer} />
          <Route path="/" component={LobbyContainer} />
        </Switch>
      </div>,
      <Footer key="footer" />
    ];
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(App);
