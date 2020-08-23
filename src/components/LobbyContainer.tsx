import React, { Component } from "react";
import superagent from "superagent";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import io from "socket.io-client";

import { url } from "../url";
import { RootState } from "../reducer";
import { Game as GameType, User } from "../reducer/types";
import Lobby from "./Lobby";

interface OwnProps {
  lobby: GameType[];
  user: User;
}

type State = {
  formFields: {
    maxPlayers: number;
    language: string;
  };
  lobbySocket: any | undefined;
  sendingFormEnabled: boolean;
};

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

type Props = OwnProps & DispatchProps & RouteComponentProps;

class LobbyContainer extends Component<Props, State> {
  stream: EventSource | undefined = undefined;

  getLanguage = () => {
    if (localStorage.language) {
      return localStorage.language;
    } else if (window.navigator.language.slice(0, 2) === "ru") {
      return "ru";
    } else {
      return "en";
    }
  };

  readonly state: State = {
    formFields: {
      maxPlayers: 2,
      language: this.getLanguage(),
    },
    lobbySocket: undefined,
    sendingFormEnabled: true,
  };

  onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    if (this.state.sendingFormEnabled) {
      this.setState({ ...this.state, sendingFormEnabled: false });
      try {
        const response = await superagent
          .post(`${url}/create`)
          .set("Authorization", `Bearer ${this.props.user.jwt}`)
          .send(this.state.formFields);
        console.log("response test: ", response);
        localStorage.setItem("language", this.state.formFields.language);
        this.props.history.push(`/game/${response.body.id}`);
      } catch (error) {
        console.warn("error test:", error);
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
    document.title = `Erudite`;
    this.stream = new EventSource(`${url}/stream`);
    this.stream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
    if (this.props.user) {
      const lobbySocket = io(url, {
        path: "/lobby",
        query: {
          jwt: this.props.user.jwt,
        },
      });
      this.setState({ ...this.state, lobbySocket });
      lobbySocket.on("message", (action: AnyAction) => {
        this.props.dispatch(action);
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.user !== prevProps.user) {
      if (this.props.user) {
        const lobbySocket = io(url, {
          path: "/lobby",
          query: {
            jwt: this.props.user.jwt,
          },
        });
        this.setState({ ...this.state, lobbySocket });
        lobbySocket.on("message", (action: AnyAction) => {
          this.props.dispatch(action);
        });
      } else if (this.state.lobbySocket) {
        this.state.lobbySocket.close();
        this.setState({ ...this.state, lobbySocket: undefined });
      }
    }
  }

  componentWillUnmount() {
    if (this.stream) {
      this.stream.close();
    }
    if (this.state.lobbySocket) {
      this.state.lobbySocket.close();
    }
  }

  render() {
    const games = this.props.lobby.reduce(
      (allGames: { [key: string]: GameType[] }, game) => {
        if (
          this.props.user &&
          game.users.find((user) => user.id === this.props.user.id) &&
          (game.phase === "turn" || game.phase === "validation")
        ) {
          if (
            (game.phase === "turn" &&
              this.props.user.id === game.turnOrder[game.turn]) ||
            (game.phase === "validation" &&
              game.validated === "unknown" &&
              this.props.user.id ===
                game.turnOrder[(game.turn + 1) % game.turnOrder.length]) ||
            (game.phase === "validation" &&
              game.validated === "no" &&
              this.props.user.id === game.turnOrder[game.turn])
          ) {
            allGames.userTurn.push(game);
          } else {
            allGames.otherTurn.push(game);
          }
        } else if (
          this.props.user &&
          (game.phase === "waiting" || game.phase === "ready") &&
          game.users.find((user) => user.id === this.props.user.id)
        ) {
          allGames.userWaiting.push(game);
        } else if (game.phase === "waiting") {
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

    return (
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
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    lobby: state.lobby,
    user: state.user,
  };
}
export default connect(mapStateToProps)(LobbyContainer);
