import React, { Component } from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import Signup from "./Signup";
import FormContainer from "./FormContainer";

interface OwnProps {
  error: string;
}

type Props = OwnProps & RouteComponentProps;

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
      />
    );
  }
}

export default connect()(SignupContainer);
