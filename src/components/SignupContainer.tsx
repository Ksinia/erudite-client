import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { History } from "history";

import { loginSignupFunction, clearError } from "../actions/authorization";
import { RootState } from "../reducer";
import Signup from "./Signup";

interface StateProps {
  error: string;
}

interface OwnProps {
  type: string;
  history: History;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  name: string;
  email: string;
  password: string;
}

class SignupContainer extends Component<Props, State> {
  readonly state: State = {
    name: "",
    email: "",
    password: "",
  };
  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  onSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    this.props.dispatch(
      loginSignupFunction(
        "signup",
        this.state.name,
        this.state.password,
        this.props.history,
        this.state.email,
      )
    );
  };

  componentDidMount() {
    document.title = `Sign up | Erudite`;
  }

  componentWillUnmount() {
    this.props.dispatch(clearError());
  }

  render() {
    return (
      <Signup
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
export default connect(mapStateToProps)(SignupContainer);
