import React, { Component, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux';

import { RootState } from '../reducer';
import { Game, User } from '../reducer/types';
import {
  ADD_GAME_TO_SOCKET,
  REMOVE_GAME_FROM_SOCKET,
} from '../constants/outgoingMessageTypes';
import { fetchGame } from '../actions/game';
import GameContainer from './GameContainer';
import RoomContainer from './RoomContainer';
import TranslationContainer from './Translation/TranslationContainer';
import Chat from './Chat';

type MatchParams = { game: string };

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}
interface StateProps {
  games: { [key: number]: Game };
  socketConnected: boolean;
  user: User;
}
type Props = StateProps & DispatchProps & RouteComponentProps<MatchParams>;

type State = {
  gameId: number;
};

class GameHandler extends Component<Props, State> {
  readonly state: State = {
    gameId: parseInt(this.props.match.params.game),
  };

  componentDidMount() {
    document.title = `Game ${this.state.gameId} | Erudite`;
    const jwt = this.props.user && this.props.user.jwt;
    this.props.dispatch(fetchGame(this.state.gameId, jwt));
    this.props.socketConnected &&
      this.props.dispatch({
        type: ADD_GAME_TO_SOCKET,
        payload: this.state.gameId,
      });
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.socketConnected && this.props.socketConnected) {
      this.props.dispatch({
        type: ADD_GAME_TO_SOCKET,
        payload: this.state.gameId,
      });
    }
    if (prevProps.match.params.game !== this.props.match.params.game) {
      this.setState({
        gameId: parseInt(this.props.match.params.game),
      });
      const jwt = this.props.user && this.props.user.jwt;
      this.props.dispatch(
        fetchGame(parseInt(this.props.match.params.game), jwt)
      );
      this.props.socketConnected &&
        this.props.dispatch({
          type: ADD_GAME_TO_SOCKET,
          payload: parseInt(this.props.match.params.game),
        });
      this.props.dispatch({
        type: REMOVE_GAME_FROM_SOCKET,
        payload: parseInt(prevProps.match.params.game),
      });
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: REMOVE_GAME_FROM_SOCKET,
      payload: this.state.gameId,
    });
  }

  render() {
    if (
      !this.props.games ||
      this.props.games[this.state.gameId] === undefined
    ) {
      return <TranslationContainer translationKey="loading" />;
    }
    if (this.props.games[this.state.gameId] === null) {
      return <TranslationContainer translationKey="no_game" />;
    }
    const game = this.props.games[this.state.gameId];
    return (
      <Fragment>
        {game.phase === 'waiting' || game.phase === 'ready' ? (
          <RoomContainer key={this.state.gameId} game={game} />
        ) : (
          <GameContainer
            history={this.props.history}
            key={this.state.gameId}
            game={game}
          />
        )}
        <Chat
          gameId={this.state.gameId}
          players={game.users}
          gamePhase={game.phase}
        />
      </Fragment>
    );
  }
}

function MapStateToProps(state: RootState) {
  return {
    games: state.games,
    socketConnected: state.socketConnected,
    user: state.user,
  };
}

export default connect(MapStateToProps)(GameHandler);
