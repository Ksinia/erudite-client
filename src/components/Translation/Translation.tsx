import { Component } from "react";
import { PropTypes } from "prop-types";

export default class Translation extends Component {
  render() {
    return this.props.translation;
  }
}

Translation.propTypes = {
  translation: PropTypes.string.isRequired,
};
