import React, { Component } from 'react';

import styles from './Collapsible.module.css';
import TranslationContainer from './Translation/TranslationContainer';

type Props = {
  component: JSX.Element;
  translationKeyExpand: string;
  translationKeyCollapse: string;
};

type State = {
  open: boolean;
};

class Collapsible extends Component<Props, State> {
  readonly state: State = { open: false };

  toggle() {
    this.setState({
      open: !this.state.open,
    });
  }
  render() {
    return (
      <div>
        <button
          className={styles.collapseButton}
          onClick={this.toggle.bind(this)}
        >
          <TranslationContainer
            translationKey={
              this.state.open
                ? this.props.translationKeyCollapse
                : this.props.translationKeyExpand
            }
          />
        </button>
        <div
          id="demo"
          className={styles.collapse + (this.state.open ? ' ' + styles.in : '')}
        >
          {this.props.component}
        </div>
      </div>
    );
  }
}

export default Collapsible;
