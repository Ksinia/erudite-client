import React, { Component } from "react";
import { connect } from "react-redux";
import { loginSignupFunction } from "../actions/authorization";

class FormContainer extends Component {
  initialState = {
    name: "",
    password: ""
  };

  state = this.initialState;

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      loginSignupFunction(
        this.props.type,
        this.state.name,
        this.state.password,
        this.props.history
      )
    );
  };

  render() {
    const { Display } = this.props;
    return (
      <Display
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.state}
        error={this.props.error}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.error
  };
}
export default connect(mapStateToProps)(FormContainer);
