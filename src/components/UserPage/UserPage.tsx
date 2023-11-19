import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../reducer';
import { User } from '../../reducer/types';
import Collapsible from '../Collapsible';
import TranslationContainer from '../Translation/TranslationContainer';
import ArchivedGamesContainer from './ArchivedGamesContainer';
import ChangePassword from './ChangePassword';
import FinishedGamesContainer from './FinishedGamesContainer';

interface StateProps {
  user: User | null;
}
interface State {
  jwtFromUrl: string;
}

type Props = StateProps;

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
  render() {
    const jwt = (this.props.user && this.props.user.jwt) || '';
    const jwtFromUrl = this.state.jwtFromUrl;
    if (!jwt && !jwtFromUrl) {
      return <TranslationContainer translationKey="please_login" />;
    }
    return (
      <>
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
          </>
        )}
        {(jwt || jwtFromUrl) && <ChangePassword jwtFromUrl={jwtFromUrl} />}
      </>
    );
  }
}
function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
  };
}

export default connect(MapStateToProps)(UserPage);
