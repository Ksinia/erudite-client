import React, { Component } from "react";
import superagent from "superagent";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { url as baseUrl } from "../url";
import { RootState } from "../reducer";
import {
  getProfileFetch,
  loginError,
  clearError,
} from "../actions/authorization";
import { User } from "../reducer/types";

interface StateProps {
  user: User;
  error: string;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = StateProps & DispatchProps;

interface State {
  password: string;
  result: string;
}

class ChangePassword extends Component<Props, State> {
  readonly state: State = {
    password: "",
    result: "",
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
    if (!this.props.user) {
      this.setState({
        ...this.state,
        result: "Only logged in user can change password",
      });
      return;
    }

    this.setState({ ...this.state, result: "" });
    const url = `${baseUrl}/change-password`;
    try {
      const response = await superagent
        .post(url)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ password: this.state.password });

      if (response.ok) {
        this.setState({
          password: "",
          result: "Password was successfully changed",
        });
      } else {
        this.props.dispatch(loginError(JSON.parse(response.text).message));
      }
    } catch (error) {
      console.log("error test:", error);
      if (error.response) {
        this.props.dispatch(loginError(error.response.body.message));
      }
    }
  };

  componentDidMount() {
    this.props.dispatch(clearError());
    const jwtFromUrl = new URL(window.location.href).searchParams.get("jwt");
    if (jwtFromUrl) {
      this.props.dispatch(getProfileFetch(jwtFromUrl));
    }
  }

  render() {
    return (
      <div>
        <h3>Change password</h3>
        <form onSubmit={this.onSubmit}>
          <label>Enter new password:</label>
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
          ></input>
          <button>Submit</button>
        </form>
        {this.state.result && <p>{this.state.result}</p>}
        {this.props.error && <p>{this.props.error}</p>}
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

export default connect<StateProps, void, void, RootState>(MapStateToProps)(
  //зачем нужны типы в угловых скобках? Если их убрать, ничего не изменится
  ChangePassword
);
