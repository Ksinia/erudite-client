import React, { Component } from 'react';
import { ThunkDispatch } from 'redux-thunk';

import { AnyAction } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducer';
import { loadArchivedGames } from '../../actions/user';
import GamesTilesList from '../GamesTilesList';
import { Game, User } from '../../reducer/types';

interface OwnProps {
  jwt: string;
}
interface StateProps {
  gamesList: Game[];
  user: User;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}

type Props = OwnProps & StateProps & DispatchProps;

class ArchivedGamesContainer extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(loadArchivedGames(this.props.jwt));
  }
  render() {
    return (
      <GamesTilesList
        gamesList={this.props.gamesList}
        user={this.props.user}
        category={'archived'}
      />
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    gamesList: state.archivedGames,
    user: state.user,
  };
}

export default connect(MapStateToProps)(ArchivedGamesContainer);
