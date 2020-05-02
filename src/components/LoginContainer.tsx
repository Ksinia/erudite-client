import React, { Component } from "react";
import Login from "./Login";
import FormContainer from "./FormContainer";
import { connect } from "react-redux";

type Props = {
  error;
};

class LoginContainer extends Component<Props> {
  componentDidMount() {
    document.title = `Log in | Erudite`;
  }
  render() {
    return (
      <FormContainer
        type="login"
        Display={Login}
        history={this.props.history}
        error={this.props.error}
      />
    );
  }
}

export default connect()(LoginContainer);
