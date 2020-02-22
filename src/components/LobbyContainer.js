import React, { Component } from "react";
import superagent from "superagent";
import { url } from "../url";
import Lobby from "./Lobby";
import { connect } from "react-redux";

class LobbyContainer extends Component {
  state = {
    name: this.props.user ? this.props.user.name : "", //`${this.props.user.name}'s room`,
    maxPlayers: 2
  };

  onSubmit = async event => {
    event.preventDefault();
    try {
      const response = await superagent
        .post(`${url}/room`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send(this.state);
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Lobby
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.state}
        rooms={this.props.lobby}
        user={this.props.user}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    lobby: state.lobby,
    user: state.user
  };
}
export default connect(mapStateToProps)(LobbyContainer);
