import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { logOut } from '../../reducer/auth';
import { RootState } from '../../reducer';
import { User } from '../../reducer/types';
import Collapsible from '../Collapsible';
import TranslationContainer from '../Translation/TranslationContainer';
import ArchivedGamesContainer from './ArchivedGamesContainer';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';
import FinishedGamesContainer from './FinishedGamesContainer';
import styles from './UserPage.module.css';

interface StateProps {
  user: User | null;
}
interface State {
  jwtFromUrl: string;
}

type Props = StateProps & DispatchProp;

class UserPage extends Component<Props> {
  readonly state: State = {
    jwtFromUrl: '',
  };

  componentDidMount() {
    const jwtFromUrl = new URL(window.location.href).searchParams.get('jwt');
    if (jwtFromUrl) {
      this.setState({ jwtFromUrl });
    }
  }

  handleLogout = () => {
    this.props.dispatch(logOut());
  };

  render() {
    const jwt = (this.props.user && this.props.user.jwt) || '';
    const jwtFromUrl = this.state.jwtFromUrl;
    if (!jwt && !jwtFromUrl) {
      return <TranslationContainer translationKey="please_login" />;
    }
    return (
      <div className={styles.container}>
        {this.props.user && (
          <h2 className={styles.title}>
            <TranslationContainer translationKey="welcome" />{' '}
            {this.props.user.name}!
          </h2>
        )}
        {jwt && (
          <>
            <Collapsible
              translationKeyExpand="expand_finished"
              translationKeyCollapse="collapse_finished"
              component={<FinishedGamesContainer jwt={jwt} />}
            />
            <Collapsible
              translationKeyExpand="expand_archived"
              translationKeyCollapse="collapse_archived"
              component={<ArchivedGamesContainer jwt={jwt} />}
            />
            <Collapsible
              translationKeyExpand="expand_change_email"
              translationKeyCollapse="collapse_change_email"
              component={<ChangeEmail />}
            />
            <Collapsible
              translationKeyExpand="expand_change_password"
              translationKeyCollapse="collapse_change_password"
              component={<ChangePassword jwtFromUrl="" />}
            />
            <Collapsible
              translationKeyExpand="expand_delete_account"
              translationKeyCollapse="collapse_delete_account"
              component={<DeleteAccount />}
            />
          </>
        )}
        {!jwt && jwtFromUrl && <ChangePassword jwtFromUrl={jwtFromUrl} />}
        {jwt && (
          <button className={styles.logoutButton} onClick={this.handleLogout}>
            <TranslationContainer translationKey="log_out" />
          </button>
        )}
      </div>
    );
  }
}
function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(UserPage);
