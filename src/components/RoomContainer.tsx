import React, { Component } from "react";
import { connect } from "react-redux";
import superagent from "superagent";

import { url } from "../url";
import "./Game.css";
import { RootState } from "../reducer";
import { Game as GameType, User } from "../reducer/types";
import Room from "./Room";
import { Dispatch, AnyAction } from "redux";

// type MatchParams = { room: string };

interface OwnProps {
  gameId: number;
}

interface StateProps {
  user: User;
  rooms: GameType[];
}

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;
// &  RouteComponentProps<MatchParams>;

type State = {
  room: GameType | null | undefined;
};

class RoomContainer extends Component<Props, State> {
  // roomId = parseInt(this.props.match.params.room);

  stream: EventSource | undefined = undefined;

  readonly state: State = { room: null };

  onClickStart = async (): Promise<void> => {
    try {
      const response = await superagent
        .post(`${url}/start`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.gameId });
      console.log("response test: ", response);
      // const gameId = response.body.id;
      // this.props.history.push(`/game/${gameId}`);
    } catch (error) {
      console.warn("error test:", error);
    }
  };
  onClickJoin = async (): Promise<void> => {
    try {
      const response = await superagent
        .put(`${url}/join`)
        .set("Authorization", `Bearer ${this.props.user.jwt}`)
        .send({ gameId: this.props.gameId });
      console.log("response test: ", response);
    } catch (error) {
      console.warn("error test:", error);
    }
  };

  componentDidMount() {
    document.title = `Game ${this.props.gameId} | Erudite`;
    this.stream = new EventSource(`${url}/stream`);
    this.stream.onmessage = (event) => {
      const { data } = event;
      const action = JSON.parse(data);
      this.props.dispatch(action);
    };
    if (this.props.rooms && this.props.rooms.length > 0) {
      const room = this.props.rooms.find((el) => el.id === this.props.gameId);
      this.setState({ room: room });
      // if (room && room.phase === "started") {
      // backend sends only unfinished game from db
      // this.props.history.push(`/game/${room.game.id}`);
      // }
    }
  }
  componentDidUpdate(prevProps: StateProps) {
    if (this.props.rooms !== prevProps.rooms) {
      if (this.props.rooms && this.props.rooms.length > 0) {
        const room = this.props.rooms.find((el) => el.id === this.props.gameId);
        this.setState({ room: room });
        // if (room && room.phase === "started") {
        // this.props.history.push(`/game/${room.game.id}`);
        // }
      }
    }
  }

  componentWillUnmount() {
    if (this.stream) {
      this.stream.close();
    }
  }

  render() {
    return (
      <div>
        <Room
          room={this.state.room}
          onClickStart={this.onClickStart}
          onClickJoin={this.onClickJoin}
          user={this.props.user}
        />
      </div>
    );
  }
}

function MapStateToProps(state: RootState) {
  return {
    user: state.user,
    rooms: state.lobby,
  };
}
export default connect(MapStateToProps)(RoomContainer);
