import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { RootState } from "../../reducer";
import { User } from "../../reducer/types";
import Collapsible from "../Collapsible";
import ArchivedGamesContainer from "./ArchivedGamesContainer";
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
  render() {
    const jwt = (this.props.user && this.props.user.jwt) || "";
    return (
      this.props.user &&
      this.props.user.jwt && (
        <React.Fragment>
          <FinishedGamesContainer jwt={jwt} />
          <Collapsible
            translationKeyExpand="expand_archived"
            translationKeyCollapse="collapse_archived"
            component={<ArchivedGamesContainer jwt={jwt} />}
          />
          <ChangePassword />
        </React.Fragment>
      )
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(UserPage);
