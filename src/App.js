import React, { Component } from "react";
import { connect } from "react-redux";
import GithubCorner from "react-github-corner";
import { Switch, Route } from "react-router-dom";

import LoginContainer from "./components/LoginContainer";
import SignupContainer from "./components/SignupContainer";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import LobbyContainer from "./components/LobbyContainer";
import RoomDetailsPage from "./components/RoomDetailsPage";
// import Board from "./components/Board";
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
      console.log(action);
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
          <Route path="/room/:room" component={RoomDetailsPage} />
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
