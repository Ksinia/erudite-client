import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logOut } from "../actions/authorization";
import "./Toolbar.css";
import LangSwitchContainer from "./LangSwitch/LangSwitchContainer";
import TranslationContainer from "./Translation/TranslationContainer";

class Toolbar extends Component {
  handleClick = () => {
    const action = logOut();
    this.props.dispatch(action);
  };

  render() {
    return (
      <div className="toolbar">
        <LangSwitchContainer />
        <Link to="/">
          <TranslationContainer translationKey="toolbar_list" />
        </Link>
        {!this.props.user && (
          <Link to="/signup">
            <TranslationContainer translationKey="sign_up" />
          </Link>
        )}

        {this.props.user && (
          <span>
            <TranslationContainer translationKey="welcome" />{" "}
            {this.props.user.name}!
          </span>
        )}

        {!this.props.user && (
          <Link to="/login">
            <TranslationContainer translationKey="log_in" />
          </Link>
        )}

        {this.props.user && (
          <span className="logout" onClick={this.handleClick}>
            <TranslationContainer translationKey="log_out" />
          </span>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Toolbar);
