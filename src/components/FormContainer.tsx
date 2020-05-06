import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { loginSignupFunction } from "../actions/authorization";
import { RootState } from "../reducer";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

interface StateProps {
  error: string;
}

interface OwnProps {
  type: string;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  name: string;
  password: string;
}

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

class FormContainer extends Component<Props, State> {
  readonly state: State = {
    name: "",
    password: "",
  };

  onChange = (event: React.SyntheticEvent) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    this.props.dispatch(
      loginSignupFunction(
        this.props.type,
        this.state.name,
        this.state.password,
        this.props.history
      )
    );
  };

  render() {
    const { Display } = this.props;
    return (
      <Display
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.state}
        error={this.props.error}
      />
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    error: state.error,
  };
}
export default connect(mapStateToProps)(FormContainer);
