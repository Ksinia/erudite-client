import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";

import { AnyAction } from "redux";
import { connect } from "react-redux";
import { RootState } from "../reducer";
import { loadFinishGamesIds } from "../actions/user";
import FinishedGames from "./FinishedGames";

interface OwnProps {
  jwt: string;
}
interface StateProps {
  finishedGamesIds: number[];
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = OwnProps & StateProps & DispatchProps;

class FinishedGamesContainer extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(loadFinishGamesIds(this.props.jwt));
  }
  render() {
    return <FinishedGames finishedGamesIds={this.props.finishedGamesIds} />;
  }
}
function MapStateToProps(state: RootState) {
  return {
    finishedGamesIds: state.finishedGamesIds,
  };
}

export default connect(MapStateToProps)(FinishedGamesContainer);
