import React, { Component } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import { RootState } from '../reducer';
import { User, Message } from '../reducer/types';
import './Chat.css';
import { clearMessages, ClearMessagesAction } from '../reducer/chat';
import { sendChatMessageWithAck } from '../thunkActions/chat';

interface OwnProps {
  gameId: number;
  players: User[];
  gamePhase: string;
}
interface DispatchProps {
  dispatch: ThunkDispatch<RootState, unknown, ClearMessagesAction>;
}
interface StateProps {
  user: User | null;
  chat: Message[];
  isConnected: boolean;
}
type Props = StateProps & DispatchProps & OwnProps;

type State = {
  message: string;
  isSending: boolean;
  sendError: string | null;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
    message: '',
    isSending: false,
    sendError: null,
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [event.currentTarget.name]: event.currentTarget.value,
      sendError: null,
    });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!this.state.message.trim() || this.state.isSending) return;

    if (!this.props.isConnected) {
      this.setState({ sendError: 'No connection to server' });
      return;
    }

    const messageToSend = this.state.message;
    this.setState({ isSending: true, sendError: null });

    try {
      const response = await sendChatMessageWithAck(messageToSend);
      if (response.success) {
        this.setState({ message: '', isSending: false });
      } else {
        this.setState({
          isSending: false,
          sendError: response.error || 'Failed to send message',
        });
      }
    } catch {
      this.setState({
        isSending: false,
        sendError: 'Failed to send message',
      });
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
                {this.state.sendError && (
                  <p className="chat-error">{this.state.sendError}</p>
                )}
                <input
                  autoComplete="off"
                  name="message"
                  onChange={this.onChange}
                  value={this.state.message}
                  disabled={this.state.isSending}
                />
                <button
                  disabled={!this.state.message.trim() || this.state.isSending}
                >
                  {this.state.isSending ? '...' : '↑'}
                </button>
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
    isConnected: state.socketConnectionState,
  };
}

export default connect(MapStateToProps)(Chat);
