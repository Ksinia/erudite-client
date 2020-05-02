import React, { Component } from "react";
import Signup from "./Signup";
import FormContainer from "./FormContainer";
import { connect } from "react-redux";

type Props = {
  error;
};

class SignupContainer extends Component<Props> {
  componentDidMount() {
    document.title = `Sign up | Erudite`;
  }
  render() {
    return (
      <FormContainer
        type="signup"
        Display={Signup}
        history={this.props.history}
        error={this.props.error}
      />
    );
  }
}

export default connect()(SignupContainer);
