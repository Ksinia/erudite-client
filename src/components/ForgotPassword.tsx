import React, { Component } from 'react';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { backendUrl as baseUrl } from '../runtime';
import { RootState } from '../reducer';
import { User } from '../reducer/types';
import { clearError, ClearErrorAction } from '../reducer/error';
import TranslationContainer from './Translation/TranslationContainer';

interface StateProps {
  user: User | null;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, ClearErrorAction>;
}

type Props = StateProps & DispatchProps;

interface State {
  name: string;
  result: string;
  errorKey: string;
}

interface ResponseError {
  response?: { body?: { message?: string } };
}

class ForgotPassword extends Component<Props, State> {
  readonly state: State = {
    name: '',
    result: '',
    errorKey: '',
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    this.setState({ ...this.state, result: '', errorKey: '' });
    const url = `${baseUrl}/generate-link`;
    try {
      const response = await superagent
        .post(url)
        .send({ name: this.state.name });
      this.setState({
        name: '',
        result: response.text,
        errorKey: '',
      });
    } catch (error) {
      const responseError = error as ResponseError;
      const key = responseError?.response?.body?.message || 'send_failed';
      this.setState({ errorKey: key });
    }
  };

  componentDidMount() {
    this.props.dispatch(clearError());
  }

  render() {
    return (
      <div>
        <TranslationContainer translationKey="enter_login_or_email" />
        <form onSubmit={this.onSubmit}>
          <label>
            <TranslationContainer translationKey="login_or_email" />:
          </label>
          <input
            name="name"
            onChange={this.onChange}
            value={this.state.name}
          ></input>
          <button>
            <TranslationContainer translationKey="confirm" />
          </button>
        </form>
        {this.state.result === 'Link generated' && (
          <TranslationContainer translationKey="link_generated" />
        )}
        {this.state.result === 'Link sent' && (
          <TranslationContainer translationKey="link_sent" />
        )}
        {this.state.errorKey && (
          <p style={{ color: 'red' }}>
            <TranslationContainer translationKey={this.state.errorKey} />
          </p>
        )}
      </div>
    );
  }
}
function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(ForgotPassword);
