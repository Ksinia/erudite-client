import React, { Component } from "react";
import superagent from "superagent";
import { connect, DispatchProp } from "react-redux";
import { backendUrl as baseUrl } from "../backendUrl";
import { RootState } from "../reducer";
import { User } from "../reducer/types";
import { clearError, loginError } from "../actions/authorization";
import TranslationContainer from "./Translation/TranslationContainer";

interface StateProps {
  user: User;
  error: string;
}

type Props = StateProps & DispatchProp;

interface State {
  name: string;
  result: string;
}

class ForgotPassword extends Component<Props, State> {
  readonly state: State = {
    name: "",
    result: "",
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    this.setState({ ...this.state, result: "" });
    this.props.dispatch(clearError());
    const url = `${baseUrl}/generate-link`;
    try {
      const response = await superagent.post(url).send({ name: this.state.name });
      this.setState({
        name: "",
        result: response.text,
      });
    } catch (error: any) {
      this.props.dispatch(loginError(JSON.parse(error.response.text).message));
    }
  };

  componentDidMount() {
    this.props.dispatch(clearError());
  }

  render() {
    return (
      <div>
        <TranslationContainer translationKey="enter_name"/>
        <form onSubmit={this.onSubmit}>
          <label><TranslationContainer translationKey="name"/>:</label>
          <input
            name="name"
            onChange={this.onChange}
            value={this.state.name}
          ></input>
          <button><TranslationContainer translationKey="confirm"/></button>
        </form>
        {this.state.result === "Link generated" && <TranslationContainer translationKey="link_generated"/>}
        {this.state.result === "Link sent" && <TranslationContainer translationKey="link_sent"/>}
        {this.props.error && <p>{this.props.error}</p>}
      </div>
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    user: state.user,
    error: state.error,
  };
}

export default connect(MapStateToProps)(ForgotPassword);
