import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logOut } from "../actions/authorization";
import "./Toolbar.css";

class Toolbar extends Component {
  handleClick = () => {
    const action = logOut();
    this.props.dispatch(action);
  };

  render() {
    return (
      <div className="toolbar">
        <Link to="/">Back to the list of games</Link>
        {!this.props.user && <Link to="/signup">Sign up</Link>}

        {this.props.user && <span>Welcome {this.props.user.name}!</span>}

        {!this.props.user && <Link to="/login">Log in</Link>}

        {this.props.user && (
          <span className="logout" onClick={this.handleClick}>
            Log out
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
