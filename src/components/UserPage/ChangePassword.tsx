import React, { Component } from 'react';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { backendUrl as baseUrl } from '../../runtime';
import { RootState } from '../../reducer';
import { User } from '../../reducer/types';
import TranslationContainer from '../Translation/TranslationContainer';
import { errorFromServer } from '../../thunkActions/errorHandling';
import {
  clearError,
  ClearErrorAction,
  LoginOrSignupErrorAction,
} from '../../reducer/error';
import { ErrorLoadedAction, LogOutAction } from '../../reducer/auth';
import styles from './UserPage.module.css';

interface StateProps {
  user: User | null;
  error: string | null;
}

interface OwnProps {
  jwtFromUrl: string;
}

interface DispatchProps {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    | LogOutAction
    | ErrorLoadedAction
    | LoginOrSignupErrorAction
    | ClearErrorAction
  >;
}

type Props = StateProps & DispatchProps & OwnProps;

interface State {
  password: string;
  changed: boolean;
}

class ChangePassword extends Component<Props, State> {
  readonly state: State = {
    password: '',
    changed: false,
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    this.props.dispatch(clearError());
    if (!this.props.user && !this.props.jwtFromUrl) {
      this.props.dispatch(
        errorFromServer(
          'Only logged in user can change password',
          'new password onSubmit'
        )
      );
      return;
    }
    const jwt =
      this.props.jwtFromUrl || (this.props.user && this.props.user.jwt);

    this.setState({ ...this.state, changed: false });
    const url = `${baseUrl}/change-password`;
    try {
      const response = await superagent
        .post(url)
        .set('Authorization', `Bearer ${jwt}`)
        .send({ password: this.state.password });

      if (response.ok) {
        this.setState({
          password: '',
          changed: true,
        });
      } else {
        this.props.dispatch(
          errorFromServer(
            JSON.parse(response.text).message,
            'new password onSubmit'
          )
        );
      }
    } catch (error) {
      this.props.dispatch(errorFromServer(error, 'new password onSubmit'));
    }
  };

  componentDidMount() {
    this.props.dispatch(clearError());
  }

  render() {
    return (
      <div>
        <h3>
          <TranslationContainer translationKey="change_password" />
        </h3>
        <form onSubmit={this.onSubmit}>
          <label>
            <TranslationContainer translationKey="enter_new_password" />
          </label>
          <input
            className={styles.input}
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
          ></input>
          <button className={styles.confirmButton}>
            <TranslationContainer translationKey="confirm" />
          </button>
        </form>
        {this.state.changed && (
          <p>
            <TranslationContainer translationKey="password_changed" />
          </p>
        )}
        {this.props.error && (
          <p style={{ color: 'red' }}>
            <TranslationContainer translationKey={this.props.error} />
          </p>
        )}
      </div>
    );
  }
}
function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
    error: state.error,
  };
}

export default connect(MapStateToProps)(ChangePassword);
