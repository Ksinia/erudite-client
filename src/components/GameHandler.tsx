import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { RootState } from "../reducer";
import { url } from "../url";
import { Game } from "../reducer/types";
import GameContainer from "./GameContainer";
import RoomContainer from "./RoomContainer";
import TranslationContainer from "./Translation/TranslationContainer";

type MatchParams = { game: string };

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}
interface StateProps {
  games: { [key: number]: Game };
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
    }
  }

  componentWillUnmount() {
    if (this.state.gameStream) {
      this.state.gameStream.close();
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
    if (game.phase === "waiting" || game.phase === "ready") {
      return <RoomContainer key={this.state.gameId} game={game} />;
    }
    return (
      <GameContainer
        history={this.props.history}
        key={this.state.gameId}
        game={game}
      />
    );
  }
}

function MapStateToProps(state: RootState) {
  return {
    games: state.games,
  };
}

export default connect(MapStateToProps)(GameHandler);
