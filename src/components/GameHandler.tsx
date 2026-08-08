import React, { Component, Fragment } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import { RootState } from '../reducer';
import { Game, User } from '../reducer/types';
import { fetchGame } from '../thunkActions/game';
import { GameLoadFailure } from '../reducer/gameLoadState';
import {
  addGameToSocket,
  AddGameToSocketAction,
  removeGameFromSocket,
  RemoveGameFromSocketAction,
} from '../reducer/outgoingMessages';
import GameContainer from './GameContainer';
import RoomContainer from './RoomContainer';
import TranslationContainer from './Translation/TranslationContainer';
import Chat from './Chat';

type MatchParams = { game: string };

interface DispatchProps {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    AddGameToSocketAction | RemoveGameFromSocketAction
  >;
}
interface StateProps {
  games: { [key: number]: Game };
  gameLoadState: { [key: number]: GameLoadFailure };
  socketConnectionState: boolean;
  user: User | null;
}
type Props = StateProps & DispatchProps & RouteComponentProps<MatchParams>;

type State = {
  gameId: number;
  bannerDismissed: boolean;
  bannerMode: 'open' | 'install';
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

class GameHandler extends Component<Props, State> {
  readonly state: State = {
    gameId: parseInt(this.props.match.params.game),
    bannerDismissed: false,
    bannerMode: 'open',
  };
  bannerRef = React.createRef<HTMLDivElement>();
  hasScrolledToBanner = false;

  componentDidMount() {
    document.title = `Game ${this.state.gameId} | Erudite`;
    const jwt = this.props.user && this.props.user.jwt;
    this.props.dispatch(fetchGame(this.state.gameId, jwt));
    this.props.socketConnectionState &&
      this.props.dispatch(addGameToSocket(this.state.gameId));
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.socketConnectionState && this.props.socketConnectionState) {
      this.props.dispatch(addGameToSocket(this.state.gameId));
    }
    // the session is restored asynchronously, so the first fetch on a direct
    // page load can go out anonymously; repeat it once the token is there
    const prevJwt = prevProps.user && prevProps.user.jwt;
    const jwt = this.props.user && this.props.user.jwt;
    if (jwt && jwt !== prevJwt) {
      this.props.dispatch(fetchGame(this.state.gameId, jwt));
      this.props.socketConnectionState &&
        this.props.dispatch(addGameToSocket(this.state.gameId));
    }
    if (!this.hasScrolledToBanner && this.bannerRef.current) {
      this.hasScrolledToBanner = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
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
      this.props.socketConnectionState &&
        this.props.dispatch(
          addGameToSocket(parseInt(this.props.match.params.game))
        );
      this.props.dispatch(
        removeGameFromSocket(parseInt(prevProps.match.params.game))
      );
    }
  }

  componentWillUnmount() {
    this.props.dispatch(removeGameFromSocket(this.state.gameId));
  }

  retryFetch = () => {
    const jwt = this.props.user && this.props.user.jwt;
    this.props.dispatch(fetchGame(this.state.gameId, jwt));
  };

  render() {
    const loadFailure = this.props.gameLoadState[this.state.gameId];
    if (loadFailure === 'unavailable') {
      return (
        <div className="page-message">
          <p>
            <TranslationContainer translationKey="server_unavailable" />
          </p>
          <button onClick={this.retryFetch}>
            <TranslationContainer translationKey="retry" />
          </button>
        </div>
      );
    }
    if (
      loadFailure === 'not_found' ||
      this.props.games[this.state.gameId] === null
    ) {
      return (
        <div className="page-message">
          <p>
            <TranslationContainer translationKey="no_game" />
          </p>
        </div>
      );
    }
    if (
      !this.props.games ||
      this.props.games[this.state.gameId] === undefined
    ) {
      return <TranslationContainer translationKey="loading" />;
    }
    const game = this.props.games[this.state.gameId];
    const banner = isMobile &&
      !this.state.bannerDismissed &&
      this.props.user &&
      (this.props.user.id === 1 || this.props.user.id === 2) && (
        <div className="app-banner" ref={this.bannerRef}>
          {this.state.bannerMode === 'open' ? (
            <button
              className="app-banner-link"
              onClick={() => {
                const appUrl = `erudit://game/${this.state.gameId}`;
                let blurred = false;
                const onBlur = () => {
                  blurred = true;
                };
                window.addEventListener('blur', onBlur);
                window.location.href = appUrl;
                setTimeout(() => {
                  window.removeEventListener('blur', onBlur);
                  if (!document.hidden && !blurred) {
                    this.setState({ bannerMode: 'install' });
                  }
                }, 2000);
              }}
            >
              <TranslationContainer translationKey="open_in_app" />
            </button>
          ) : (
            <a
              href="https://apps.apple.com/app/erudit/idTODO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TranslationContainer translationKey="install_app" />
            </a>
          )}
          <button
            className="app-banner-close"
            onClick={() => this.setState({ bannerDismissed: true })}
          >
            ×
          </button>
        </div>
      );
    return (
      <Fragment>
        {banner}
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

function MapStateToProps(state: RootState): StateProps {
  return {
    games: state.games,
    gameLoadState: state.gameLoadState,
    socketConnectionState: state.socketConnectionState,
    user: state.user,
  };
}

export default connect(MapStateToProps)(GameHandler);
