import React, { Component } from 'react';
import { connect } from 'react-redux';
import superagent from 'superagent';
import { ThunkDispatch } from 'redux-thunk';
import { backendUrl } from '../runtime';
import './Game.css';
import { RootState } from '../reducer';
import { User, Game } from '../reducer/types';
import { errorFromServer } from '../thunkActions/errorHandling';
import { LogOutAction } from '../reducer/auth';
import Room from './Room';

interface OwnProps {
  game: Game;
}

interface StateProps {
  user: User | null;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, LogOutAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

class RoomContainer extends Component<Props> {
  onClickStart = async (): Promise<void> => {
    try {
      await superagent
        .post(`${backendUrl}/start/${this.props.game.id}`)
        .set('Authorization', `Bearer ${this.props.user?.jwt}`);
    } catch (error) {
      this.props.dispatch(errorFromServer(error, 'onClickStart'));
    }
  };
  onClickJoin = async (): Promise<void> => {
    try {
      await superagent
        .put(`${backendUrl}/join/${this.props.game.id}`)
        .set('Authorization', `Bearer ${this.props.user?.jwt}`);
    } catch (error) {
      this.props.dispatch(errorFromServer(error, 'onClickJoin'));
    }
  };

  render() {
    return (
      <div>
        <Room
          room={this.props.game}
          onClickStart={this.onClickStart}
          onClickJoin={this.onClickJoin}
          user={this.props.user}
        />
      </div>
    );
  }
}

function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
  };
}
export default connect(MapStateToProps)(RoomContainer);
