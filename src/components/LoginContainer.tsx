import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Login from "./Login";
import FormContainer from "./FormContainer";

class LoginContainer extends Component<RouteComponentProps> {
  componentDidMount() {
    document.title = `Log in | Erudite`;
  }
  render() {
    return (
      <FormContainer
        type="login"
        Display={Login}
        history={this.props.history}
      />
    );
  }
}

export default connect()(LoginContainer);
