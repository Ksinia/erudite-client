import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import { connect, DispatchProp } from 'react-redux';

import { logOut } from '../reducer/auth';
import './Toolbar.css';
import { RootState } from '../reducer';
import { User } from '../reducer/types';
import LangSwitchContainer from './LangSwitch/LangSwitchContainer';
import TranslationContainer from './Translation/TranslationContainer';

interface StateProps {
  user: User | null;
  locale: string;
}

type Props = StateProps & DispatchProp;

interface State {
  isOverflowing: boolean;
  menuOpen: boolean;
}

class Toolbar extends Component<Props, State> {
  state: State = { isOverflowing: false, menuOpen: false };
  sizerRef = createRef<HTMLDivElement>();
  resizeObserver: ResizeObserver | null = null;

  componentDidMount() {
    this.checkOverflow();
    if (this.sizerRef.current) {
      this.resizeObserver = new ResizeObserver(() => this.checkOverflow());
      this.resizeObserver.observe(this.sizerRef.current);
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.user !== this.props.user ||
      prevProps.locale !== this.props.locale
    ) {
      requestAnimationFrame(() => this.checkOverflow());
    }
  }

  componentWillUnmount() {
    this.resizeObserver?.disconnect();
  }

  checkOverflow = () => {
    const sizer = this.sizerRef.current;
    if (sizer) {
      const isOverflowing = sizer.scrollWidth > sizer.clientWidth;
      if (isOverflowing !== this.state.isOverflowing) {
        this.setState({ isOverflowing, menuOpen: false });
      }
    }
  };

  handleLogout = () => {
    this.props.dispatch(logOut());
  };

  toggleMenu = () => {
    this.setState((prev) => ({ menuOpen: !prev.menuOpen }));
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  renderNavItems(onNavigate?: () => void) {
    return (
      <>
        <Link to="/rules" onClick={onNavigate}>
          <TranslationContainer translationKey="toolbar_rules" />
        </Link>
        {!this.props.user && (
          <Link
            to={`/signup?prev=${window.location.pathname + window.location.search}`}
            onClick={onNavigate}
          >
            <TranslationContainer translationKey="sign_up" />
          </Link>
        )}
        {this.props.user && (
          <Link to="/user" onClick={onNavigate}>
            <TranslationContainer translationKey="welcome" />{' '}
            {this.props.user.name}!
          </Link>
        )}
        {!this.props.user && (
          <Link
            to={`/login?prev=${window.location.pathname + window.location.search}`}
            onClick={onNavigate}
          >
            <TranslationContainer translationKey="log_in" />
          </Link>
        )}
        {this.props.user && (
          <Link
            to="#"
            className="logout"
            onClick={() => {
              this.handleLogout();
              onNavigate?.();
            }}
          >
            <TranslationContainer translationKey="log_out" />
          </Link>
        )}
      </>
    );
  }

  render() {
    const { isOverflowing, menuOpen } = this.state;
    return (
      <div className="toolbar-wrapper">
        <div className="toolbar-sizer" ref={this.sizerRef}>
          <LangSwitchContainer />
          <Link to="/">
            <TranslationContainer translationKey="toolbar_list" />
          </Link>
          {this.renderNavItems()}
        </div>
        <div className="toolbar">
          <LangSwitchContainer />
          <Link to="/">
            <TranslationContainer translationKey="toolbar_list" />
          </Link>
          {!isOverflowing && this.renderNavItems()}
          {isOverflowing && (
            <button
              className="burger"
              onClick={this.toggleMenu}
              aria-label="Menu"
            >
              &#9776;
            </button>
          )}
        </div>
        {isOverflowing && menuOpen && (
          <div className="toolbar-menu">
            {this.renderNavItems(this.closeMenu)}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
    locale: state.translation.locale,
  };
}

export default connect(mapStateToProps)(Toolbar);
