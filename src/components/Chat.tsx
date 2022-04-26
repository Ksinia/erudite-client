import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import io from "socket.io-client";

import { RootState } from "../reducer";
import { url } from "../url";
import { User, Message } from "../reducer/types";
import { clearMessages } from "../actions/chat";
import "./Chat.css";

interface OwnProps {
  gameId: number;
  players: User[];
  gamePhase: string;
}

interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>;
}
interface StateProps {
  user: User;
  chat: Message[];
}
type Props = StateProps & DispatchProps & OwnProps;

type State = {
  socket: any | undefined;
  message: string;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
    socket: undefined,
    message: "",
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      this.state.socket.send({ type: "NEW_MESSAGE", payload: this.state.message });
      this.setState({ ...this.state, message: "" });
    } catch (error) {
      console.log("error test:", error);
    }
  };

  componentDidMount() {
    let query: { [key: string]: string | number } = {
      gameId: this.props.gameId,
    };
    if (this.props.user && this.props.user.jwt) {
      query.jwt = this.props.user.jwt;
    }
    const socket = io(url, {
      path: "/socket",
      query: query,
    });
    this.setState({ ...this.state, socket });
    socket.on("message", (action: AnyAction) => {
      this.props.dispatch(action);
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.user !== prevProps.user) {
      if (this.props.user) {
        const chatSocket = io(url, {
          path: "/chat",
          query: {
            jwt: this.props.user.jwt,
            gameId: this.props.gameId,
          },
        });
        this.setState({ ...this.state, socket: chatSocket });
        chatSocket.on("message", (action: AnyAction) => {
          this.props.dispatch(action);
        });
      } else if (this.state.socket) {
        this.state.socket.close();
        this.setState({ ...this.state, socket: undefined });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.socket) {
      this.state.socket.close();
    }
    this.props.dispatch(clearMessages());
  }

  render() {
    if (
      this.props.gamePhase === "waiting" ||
      (this.props.user &&
        this.props.players.find((player) => player.id === this.props.user.id))
    ) {
      return (
        <div className="chat">
          {this.props.user &&
            this.props.players.find(
              (player) => player.id === this.props.user.id
            ) && (
              <form onSubmit={this.onSubmit}>
                <input
                  autoComplete="off"
                  name="message"
                  onChange={this.onChange}
                  value={this.state.message}
                ></input>
                <button disabled={!this.state.message}>↑</button>
              </form>
            )}
          {this.props.chat.map((message, index) => (
            <p key={index}>
              {message.name}: {message.text}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }
}

function MapStateToProps(state: RootState) {
  return {
    user: state.user,
    chat: state.chat,
  };
}

export default connect(MapStateToProps)(Chat);
