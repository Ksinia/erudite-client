import React, { Component } from "react";
import superagent from "superagent";
import { connect, DispatchProp } from "react-redux";
import { url as baseUrl } from "../url";
import { RootState } from "../reducer";
import { User } from "../reducer/types";

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
    const url = `${baseUrl}/generate-link`;
    try {
      await superagent.post(url).send({ name: this.state.name });
      this.setState({
        name: "",
        result: `The link for changing password was created. 
        Please contact Ksenia Gulyaeva to get the link. The 
        link expires after 1 hour`,
      });
    } catch (error: any) {
      console.log("error test:", error);
      this.setState({
        ...this.state,
        result: JSON.parse(error.response.text).message,
      });
    }
  };

  render() {
    return (
      <div>
        <h3>Enter your name to receive password recovery link</h3>
        <form onSubmit={this.onSubmit}>
          <label>Name:</label>
          <input
            name="name"
            onChange={this.onChange}
            value={this.state.name}
          ></input>
          <button>Submit</button>
        </form>
        {this.state.result && <p>{this.state.result}</p>}
      </div>
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(ForgotPassword);
