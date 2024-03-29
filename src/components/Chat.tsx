import React, { Component } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import { RootState } from '../reducer';
import { User, Message } from '../reducer/types';
import './Chat.css';
import { errorFromServer } from '../thunkActions/errorHandling';
import { clearMessages, ClearMessagesAction } from '../reducer/chat';
import {
  sendChatMessage,
  SendChatMessageAction,
} from '../reducer/outgoingMessages';

interface OwnProps {
  gameId: number;
  players: User[];
  gamePhase: string;
}
interface DispatchProps {
  dispatch: ThunkDispatch<
    RootState,
    unknown,
    SendChatMessageAction | ClearMessagesAction
  >;
}
interface StateProps {
  user: User | null;
  chat: Message[];
}
type Props = StateProps & DispatchProps & OwnProps;

type State = {
  message: string;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
    message: '',
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
      this.props.dispatch(sendChatMessage(this.state.message));
      this.setState({ ...this.state, message: '' });
    } catch (error) {
      this.props.dispatch(errorFromServer(error, 'chat'));
    }
  };

  componentWillUnmount() {
    this.props.dispatch(clearMessages());
  }

  render() {
    if (
      this.props.gamePhase === 'waiting' ||
      (this.props.user &&
        this.props.players.find((player) => player.id === this.props.user?.id))
    ) {
      return (
        <div className="chat">
          {this.props.user &&
            this.props.players.find(
              (player) => player.id === this.props.user?.id
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

function MapStateToProps(state: RootState): StateProps {
  return {
    user: state.user,
    chat: state.chat,
  };
}

export default connect(MapStateToProps)(Chat);
