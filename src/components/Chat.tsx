import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import io from "socket.io-client";

import { RootState } from "../reducer";
import { url } from "../url";
import { User, Message } from "../reducer/types";
// import TranslationContainer from "./Translation/TranslationContainer";
import { clearMessages } from "../actions/chat";

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
  chatSocket: any | undefined;
  message: string;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
    chatSocket: undefined,
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
      this.state.chatSocket.send(this.state.message);
      this.setState({ ...this.state, message: "" });
    } catch (error) {
      console.log("error test:", error);
    }
  };

  componentDidMount() {
    if (
      this.props.user
      //   this.props.players.find((player) => player.id === this.props.user.id)
    ) {
      const chatSocket = io(url, {
        path: "/chat",
        query: {
          jwt: this.props.user.jwt,
          gameId: this.props.gameId,
        },
      });
      this.setState({ ...this.state, chatSocket });
      chatSocket.on("message", (action: AnyAction) => {
        this.props.dispatch(action);
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.user !== prevProps.user) {
      if (
        this.props.user
        // this.props.players.find((player) => player.id === this.props.user.id)
      ) {
        const chatSocket = io(url, {
          path: "/chat",
          query: {
            jwt: this.props.user.jwt,
            gameId: this.props.gameId,
          },
        });
        this.setState({ ...this.state, chatSocket });
        chatSocket.on("message", (action: AnyAction) => {
          this.props.dispatch(action);
        });
      } else if (this.state.chatSocket) {
        this.state.chatSocket.close();
        this.setState({ ...this.state, chatSocket: undefined });
      }
    }
  }

  componentWillUnmount() {
    if (this.state.chatSocket) {
      this.state.chatSocket.close();
    }
    this.props.dispatch(clearMessages());
  }

  render() {
    if (
      this.props.user &&
      (this.props.gamePhase === "waiting" ||
        this.props.players.find((player) => player.id === this.props.user.id))
    ) {
      return (
        <div>
          <h3>Chat of game {this.props.gameId}</h3>
          {this.props.players.find(
            (player) => player.id === this.props.user.id
          ) ? (
            <form onSubmit={this.onSubmit}>
              <label>Enter message:</label>
              <input
                name="message"
                onChange={this.onChange}
                value={this.state.message}
              ></input>
              <button>Submit</button>
            </form>
          ) : (
            <p>Please log in and join the game to send a message</p>
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
