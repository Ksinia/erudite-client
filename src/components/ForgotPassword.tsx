import React, { Component } from "react";
import { url as baseUrl } from "../url";
import superagent from "superagent";
import { connect } from "react-redux";
import { RootState } from "../reducer";

class ForgotPassword extends Component {
  initialState = {
    name: "",
    result: "",
  };

  state = this.initialState;

  onChange = (event: React.SyntheticEvent) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    console.log("event.constructor.name", event.constructor.name);
    event.preventDefault();
    this.setState({ ...this.state, result: "" });
    const url = `${baseUrl}/generate-link`;
    try {
      const response = await superagent
        .post(url)
        .send({ name: this.state.name });
      console.log("response test: ", response);
      this.setState({
        name: "",
        result: `The link for changing password was created. 
        Please contact Ksenia Gulyaeva to get the link. The 
        link expires after 1 hour`,
      });
    } catch (error) {
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
