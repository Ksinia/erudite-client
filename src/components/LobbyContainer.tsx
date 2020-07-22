import React, { Component } from "react";
import superagent from "superagent";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";

import { url } from "../url";
import { RootState } from "../reducer";
import { Game as GameType, User } from "../reducer/types";
import Lobby from "./Lobby";

interface OwnProps {
  lobby: GameType[];
  user: User;
}

type State = {
  maxPlayers: number;
  language: string;
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
    maxPlayers: 2,
    language: this.getLanguage(),
  };

  onSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    try {
      const response = await superagent
        .post(`${url}/create`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send(this.state);
      console.log("response test: ", response);
      localStorage.setItem("language", this.state.language);
      this.props.history.push(`/game/${response.body.id}`);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  onChange = (
    event:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  componentDidMount() {
    document.title = `Erudite`;
    this.stream = new EventSource(`${url}/stream`);
    this.stream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
  }

  componentWillUnmount() {
    if (this.stream) {
      this.stream.close();
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
        values={this.state}
        userTurnGames={games.userTurn}
        otherTurnGames={games.otherTurn}
        userWaitingGames={games.userWaiting}
        otherWaitingGames={games.otherWaiting}
        otherGames={games.other}
        user={this.props.user}
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
