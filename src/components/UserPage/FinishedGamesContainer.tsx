import React, { Component } from 'react';
import { ThunkDispatch } from 'redux-thunk';

import { connect } from 'react-redux';
import { RootState } from '../../reducer';
import { loadFinishGames } from '../../thunkActions/user';
import GamesTilesList from '../GamesTilesList';
import { Game, User } from '../../reducer/types';
import { FinishedGamesLoadedAction } from '../../reducer/finishedGames';

interface OwnProps {
  jwt: string;
}
interface StateProps {
  gamesList: Game[];
  user: User | null;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, FinishedGamesLoadedAction>;
}

type Props = OwnProps & StateProps & DispatchProps;

class FinishedGamesContainer extends Component<Props> {
  componentDidMount() {
    this.props.dispatch(loadFinishGames(this.props.jwt));
  }
  render() {
    return (
      <GamesTilesList
        gamesList={this.props.gamesList}
        user={this.props.user}
        category={'finished'}
      />
    );
  }
}
function MapStateToProps(state: RootState): StateProps {
  return {
    gamesList: state.finishedGames,
    user: state.user,
  };
}

export default connect(MapStateToProps)(FinishedGamesContainer);
