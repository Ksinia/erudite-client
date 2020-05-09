import React, { Component } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { RouteComponentProps } from "react-router-dom";

import { loginSignupFunction } from "../actions/authorization";
import { RootState } from "../reducer";

interface StateProps {
  error: string;
}

interface OwnProps {
  type: string;
  Display: Component;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps & RouteComponentProps;

interface State {
  name: string;
  password: string;
}

class FormContainer extends Component<Props, State> {
  readonly state: State = {
    name: "",
    password: "",
  };
  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  onSubmit = (event: React.FormEvent) => {
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
