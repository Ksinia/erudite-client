import { Component } from 'react';

type Props = {
  translation: string;
};

export default class Translation extends Component<Props> {
  render() {
    return this.props.translation;
  }
}
