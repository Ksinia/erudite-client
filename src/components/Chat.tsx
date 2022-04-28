import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

import { RootState } from "../reducer";
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
// TODO: check which should be named StateProps and which should be named OwnProps
interface StateProps {
  user: User;
  chat: Message[];
  socket: SocketIOClient.Socket;
}
type Props = StateProps & DispatchProps & OwnProps;

type State = {
  message: string;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
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
      this.props.socket.send({
        type: "NEW_MESSAGE",
        payload: this.state.message,
      });
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
  }

  componentWillUnmount() {
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
    socket: state.socket,
  };
}

export default connect(MapStateToProps)(Chat);
