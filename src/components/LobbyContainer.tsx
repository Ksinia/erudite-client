import React, { Component } from 'react';
import superagent from 'superagent';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { backendUrl } from '../runtime';
import { RootState } from '../reducer';
import { Game as GameType, User } from '../reducer/types';
import { errorFromServer } from '../thunkActions/errorHandling';
import { LogOutAction } from '../reducer/auth';
import { enterLobby, EnterLobbyAction } from '../reducer/outgoingMessages';
import Lobby from './Lobby';
import TranslationContainer from './Translation/TranslationContainer';

interface StateProps {
  lobby: GameType[];
  user: User | null;
  socketConnectionState: boolean;
}

type State = {
  formFields: {
    maxPlayers: number;
    language: string;
  };
  sendingFormEnabled: boolean;
};

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, LogOutAction | EnterLobbyAction>;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

class LobbyContainer extends Component<Props, State> {
  getLanguage = () => {
    if (localStorage.language) {
      return localStorage.language;
    } else if (window.navigator.language.slice(0, 2) === 'ru') {
      return 'ru';
    } else {
      return 'en';
    }
  };

  readonly state: State = {
    formFields: {
      maxPlayers: 2,
      language: this.getLanguage(),
    },
    sendingFormEnabled: true,
  };

  onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    if (this.state.sendingFormEnabled && this.props.user) {
      this.setState({ ...this.state, sendingFormEnabled: false });
      try {
        const response = await superagent
          .post(`${backendUrl}/create`)
          .set('Authorization', `Bearer ${this.props.user.jwt}`)
          .send(this.state.formFields);
        localStorage.setItem('language', this.state.formFields.language);
        this.props.history.push(`/game/${response.body.id}`);
      } catch (error) {
        this.props.dispatch(errorFromServer(error, 'create game onSubmit'));
      }
    }
  };

  onChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({
      ...this.state,
      formFields: {
        ...this.state.formFields,
        [event.target.name]: event.target.value,
      },
    });
  };

  componentDidMount() {
    document.title = 'Erudite';
    this.props.dispatch(enterLobby());
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.socketConnectionState && this.props.socketConnectionState) {
      this.props.dispatch(enterLobby());
    }
  }

  render() {
    const propsUser = this.props.user;
    const games = this.props.lobby.reduce(
      (allGames: { [key: string]: GameType[] }, game) => {
        if (
          propsUser &&
          game.users.find((user) => user.id === propsUser.id) &&
          (game.phase === 'turn' || game.phase === 'validation')
        ) {
          if (propsUser.id === game.activeUserId) {
            allGames.userTurn.push(game);
          } else {
            allGames.otherTurn.push(game);
          }
        } else if (
          this.props.user &&
          (game.phase === 'waiting' || game.phase === 'ready') &&
          game.users.find((user) => user.id === propsUser?.id)
        ) {
          allGames.userWaiting.push(game);
        } else if (game.phase === 'waiting') {
          allGames.otherWaiting.push(game);
        } else {
          allGames.other.push(game);
        }
        return allGames;
      },
      {
        userTurn: [],
        otherTurn: [],
        userWaiting: [],
        otherWaiting: [],
        other: [],
      }
    );
    return Array.isArray(this.props.lobby) ? (
      <Lobby
        onChange={this.onChange}
        onSubmit={this.onSubmit}
        values={this.state.formFields}
        userTurnGames={games.userTurn}
        otherTurnGames={games.otherTurn}
        userWaitingGames={games.userWaiting}
        otherWaitingGames={games.otherWaiting}
        otherGames={games.other}
        user={this.props.user}
        sendingFormEnabled={this.state.sendingFormEnabled}
      />
    ) : (
      <TranslationContainer translationKey="loading" />
    );
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    lobby: state.lobby,
    user: state.user,
    socketConnectionState: state.socketConnectionState,
  };
}
export default connect(mapStateToProps)(LobbyContainer);
