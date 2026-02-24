import React, { Component } from 'react';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';

import { RootState } from '../reducer';
import { User, Message } from '../reducer/types';
import './Chat.css';
import { backendUrl } from '../runtime';
import { clearMessages, ClearMessagesAction } from '../reducer/chat';
import { sendChatMessageWithAck } from '../thunkActions/chat';
import { addGameToSocket } from '../reducer/outgoingMessages';
import TranslationContainer from './Translation/TranslationContainer';

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
  sendErrorKey: string | null;
  feedbackKey: string | null;
  activeMenuIndex: number | null;
};

class Chat extends Component<Props, State> {
  readonly state: State = {
    message: '',
    isSending: false,
    sendErrorKey: null,
    feedbackKey: null,
    activeMenuIndex: null,
  };

  feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      ...this.state,
      [event.currentTarget.name]: event.currentTarget.value,
      sendErrorKey: null,
    });
  };

  onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!this.state.message.trim() || this.state.isSending) return;

    if (!this.props.isConnected) {
      this.setState({ sendErrorKey: 'no_connection' });
      return;
    }

    const messageToSend = this.state.message;
    this.setState({ isSending: true, sendErrorKey: null });

    try {
      const response = await sendChatMessageWithAck(messageToSend);
      if (response.success) {
        this.setState({ message: '', isSending: false });
      } else {
        this.setState({
          isSending: false,
          sendErrorKey: 'send_failed',
        });
      }
    } catch {
      this.setState({
        isSending: false,
        sendErrorKey: 'send_failed',
      });
    }
  };

  handleReport = async (msg: Message) => {
    this.setState({ activeMenuIndex: null });
    try {
      const res = await fetch(`${backendUrl}/report-message`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.props.user!.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageText: msg.text,
          messageSenderName: msg.name,
          gameId: this.props.gameId,
        }),
      });
      if (res.ok) {
        this.showFeedback('message_reported');
      } else {
        this.setState({ sendErrorKey: 'send_failed' });
      }
    } catch {
      this.setState({ sendErrorKey: 'send_failed' });
    }
  };

  handleBlock = async (userId: number) => {
    this.setState({ activeMenuIndex: null });
    try {
      const res = await fetch(`${backendUrl}/block-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.props.user!.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        this.showFeedback('user_blocked');
        this.props.dispatch(addGameToSocket(this.props.gameId));
      } else {
        this.setState({ sendErrorKey: 'send_failed' });
      }
    } catch {
      this.setState({ sendErrorKey: 'send_failed' });
    }
  };

  showFeedback = (key: string) => {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.setState({ feedbackKey: key });
    this.feedbackTimer = setTimeout(
      () => this.setState({ feedbackKey: null }),
      3000
    );
  };

  toggleMenu = (index: number) => {
    this.setState((prev) => ({
      activeMenuIndex: prev.activeMenuIndex === index ? null : index,
    }));
  };

  componentWillUnmount() {
    this.props.dispatch(clearMessages());
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
  }

  render() {
    if (
      this.props.gamePhase === 'waiting' ||
      (this.props.user &&
        this.props.players.find((player) => player.id === this.props.user?.id))
    ) {
      return (
        <div className="chat">
          {this.state.sendErrorKey && (
            <div className="chat-error-container">
              <TranslationContainer translationKey={this.state.sendErrorKey} />
            </div>
          )}
          {this.state.feedbackKey && (
            <div className="chat-feedback-container">
              <TranslationContainer translationKey={this.state.feedbackKey} />
            </div>
          )}
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
            <div key={index} className="chat-message">
              <p>
                {message.name}: {message.text}
              </p>
              {this.props.user && message.userId !== this.props.user.id && (
                <div className="chat-message-actions">
                  <button
                    className="chat-menu-button"
                    onClick={() => this.toggleMenu(index)}
                  >
                    &#8943;
                  </button>
                  {this.state.activeMenuIndex === index && (
                    <div className="chat-menu-dropdown">
                      <button onClick={() => this.handleReport(message)}>
                        <TranslationContainer translationKey="report_message" />
                      </button>
                      <button onClick={() => this.handleBlock(message.userId)}>
                        <TranslationContainer translationKey="block_user" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
