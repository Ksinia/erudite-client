import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

import { RootState } from "../reducer";
import { url } from "../url";
import { Game } from "../reducer/types";
import {
  ADD_GAME_TO_SOCKET,
  REMOVE_GAME_FROM_SOCKET,
} from "../actions/outgoingMessageTypes";
import GameContainer from "./GameContainer";
import RoomContainer from "./RoomContainer";
import TranslationContainer from "./Translation/TranslationContainer";
import Chat from "./Chat";

type MatchParams = { game: string };

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}
interface StateProps {
  games: { [key: number]: Game };
  socket: SocketIOClient.Socket;
}
type Props = StateProps & DispatchProps & RouteComponentProps<MatchParams>;

type State = {
  gameStream: EventSource | undefined;
  gameId: number;
};

class GameHandler extends Component<Props, State> {
  readonly state: State = {
    gameStream: undefined,
    gameId: parseInt(this.props.match.params.game),
  };

  componentDidMount() {
    if (this.props.socket) {
      this.props.socket.send({
        type: ADD_GAME_TO_SOCKET,
        payload: this.state.gameId,
      });
    }

    const gameStream = new EventSource(`${url}/game/${this.state.gameId}`);
    this.setState({ ...this.state, gameStream });
    document.title = `Game ${this.state.gameId} | Erudite`;
    gameStream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props !== prevProps) {
      const prevGameId = this.state.gameId;
      const gameId = parseInt(this.props.match.params.game);
      if (gameId !== prevGameId) {
        if (this.state.gameStream) {
          this.state.gameStream.close();
        }
        const gameStream = new EventSource(`${url}/game/${gameId}`);
        document.title = `Game ${gameId} | Erudite`;
        this.setState({ gameId, gameStream });
        gameStream.onmessage = (event) => {
          const { data } = event;
          const action = JSON.parse(data);
          this.props.dispatch(action);
        };
      }
      if (this.props.socket && this.props.socket !== prevProps.socket) {
        this.props.socket.send({
          type: ADD_GAME_TO_SOCKET,
          payload: this.state.gameId,
        });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.gameStream) {
      this.state.gameStream.close();
    }
    if (this.props.socket) {
      this.props.socket.send({
        type: REMOVE_GAME_FROM_SOCKET,
        payload: this.state.gameId,
      });
    }
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
        {game.phase === "waiting" || game.phase === "ready" ? (
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
    socket: state.socket,
  };
}

export default connect(MapStateToProps)(GameHandler);
