import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "../reducer";
import { User } from "../reducer/types";
import { loadFinishGamesIds } from "../actions/user";
import ChangePassword from "./ChangePassword";
import FinishedGamesContainer from "./FinishedGamesContainer";

interface StateProps {
  user: User;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps;

class UserPage extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    if (this.props.user && this.props.user.jwt && !prevProps.user) {
      this.props.dispatch(loadFinishGamesIds(this.props.user.jwt));
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.user && this.props.user.jwt && (
          <FinishedGamesContainer jwt={this.props.user.jwt} />
        )}
        <ChangePassword />
      </React.Fragment>
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(UserPage);
