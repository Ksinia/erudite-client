import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";

import { url } from "../url";
import "./Game.css";
import { RootState } from "../reducer";
import { User, Game } from "../reducer/types";
import Room from "./Room";
import { Dispatch, AnyAction } from "redux";

interface OwnProps {
  game: Game;
}

interface StateProps {
  user: User;
}

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

class RoomContainer extends Component<Props> {
  onClickStart = async (): Promise<void> => {
    try {
      const response = await superagent
        .post(`${url}/start`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.game.id });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };
  onClickJoin = async (): Promise<void> => {
    try {
      const response = await superagent
        .put(`${url}/join`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.game.id });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  render() {
    return (
      <div>
        <Room
          room={this.props.game}
          onClickStart={this.onClickStart}
          onClickJoin={this.onClickJoin}
          user={this.props.user}
        />
      </div>
    );
  }
}

function MapStateToProps(state: RootState) {
  return {
    user: state.user,
  };
}
export default connect(MapStateToProps)(RoomContainer);
