import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { History } from 'history';

import { loginSignupFunction, clearError } from '../actions/authorization';
import { RootState } from '../reducer';
import Login from './Login';

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
  password: string;
}

class LoginContainer extends Component<Props, State> {
  readonly state: State = {
    name: '',
    password: '',
  };
  onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  onSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    this.props.dispatch(
      loginSignupFunction(
        'login',
        this.state.name,
        this.state.password,
        this.props.history
      )
    );
  };

  componentDidMount() {
    document.title = 'Log in | Erudite';
  }

  componentWillUnmount() {
    this.props.dispatch(clearError());
  }

  render() {
    return (
      <Login
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
export default connect(mapStateToProps)(LoginContainer);
