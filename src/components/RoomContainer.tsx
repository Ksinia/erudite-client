import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";
import { Dispatch, AnyAction } from "redux";

import { backendUrl } from "../backendUrl";
import "./Game.css";
import { RootState } from "../reducer";
import { User, Game } from "../reducer/types";
import Room from "./Room";

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
      await superagent
        .post(`${backendUrl}/start`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.game.id });
    } catch (error) {
      console.warn("error test:", error);
    }
  };
  onClickJoin = async (): Promise<void> => {
    try {
      await superagent
        .put(`${backendUrl}/join`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.game.id });
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
