import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";

import { AnyAction } from "redux";
import { connect } from "react-redux";
import { RootState } from "../reducer";
import { loadFinishGames } from "../actions/user";
import FinishedGames from "./FinishedGames";
import { Game, User } from "../reducer/types";

interface OwnProps {
  jwt: string;
}
interface StateProps {
  finishedGames: Game[];
  user: User;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = OwnProps & StateProps & DispatchProps;

class FinishedGamesContainer extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(loadFinishGames(this.props.jwt));
  }
  render() {
    return (
      <FinishedGames
        finishedGames={this.props.finishedGames}
        user={this.props.user}
      />
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    finishedGames: state.finishedGames,
    user: state.user,
  };
}

export default connect(MapStateToProps)(FinishedGamesContainer);
