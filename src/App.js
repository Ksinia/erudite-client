import React, { Component } from "react";
import { connect } from "react-redux";

import "./App.css";
import Board from "./components/Board";
import { getProfileFetch } from "./actions/authorization.js";

class App extends Component {
  componentDidMount = () => {
    this.props.dispatch(getProfileFetch());
  };
  render() {
    return (
      <div className="App">
        <Board />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(App);
