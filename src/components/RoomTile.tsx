import React, { Component } from "react";
import { Link } from "react-router-dom";

import { User, Game } from "../reducer/types";
import "./RoomTile.css";
import TranslationContainer from "./Translation/TranslationContainer";
import { Dispatch, AnyAction } from "redux";
import { RootState } from "../reducer";
import { connect } from "react-redux";
import { colors } from "../colors";

type OwnProps = {
  room: Game;
  user: User;
};
interface StateProps {
  messagesCount: { [key: number]: number };
}

interface DispatchProps {
  dispatch: Dispatch<AnyAction>;
}

type Props = StateProps & DispatchProps & OwnProps;

function getActiveUserName(game: Game): string {
  const user = game.users.find((user) => user.id === game.activeUserId);
  if (user) {
    return user.name;
  }
  return "";
}

function getWinnerName(game: Game): string {
  return game.users
    .filter((user) => game.result.winner.includes(user.id.toString()))
    .map((user) => user.name)
    .join(", ");
}

function getTileColor(props: Props): string {
  if (props.room.phase === "finished") {
    return props.room.users
      .filter((user) => props.room.result.winner.includes(user.id.toString()))
      .map((user) => user.id)
      .includes(props.user.id)
      ? colors.green
      : colors.red;
  }
  if (
    props.user &&
    props.room.users.some((user) => user.id === props.user.id)
  ) {
    return props.room.activeUserId == props.user.id
      ? colors.red
      : colors.orange;
  }
  return props.room.phase === "waiting" ? colors.green : colors.blue;
}

class RoomTile extends Component<Props> {
  render() {
    const {
      id,
      maxPlayers,
      users,
      phase,
      language,
      turnOrder,
    } = this.props.room;
    return (
      <Link to={`/game/${id}`}>
        <div className="room-tile">
          <div
            className="tile-header"
            style={{ background: getTileColor(this.props) }}
          >
            <p className="number">{id}</p>
            <p className="status">
              {phase === "waiting" && (
                <TranslationContainer
                  translationKey="waiting_for"
                  args={[String(maxPlayers - users.length)]}
                />
              )}
              {phase === "ready" && (
                <TranslationContainer translationKey="ready" />
              )}
              {phase !== "finished" &&
              this.props.user &&
              this.props.room.activeUserId === this.props.user.id ? (
                <TranslationContainer translationKey="your_turn" />
              ) : (
                getActiveUserName(this.props.room)
              )}
              {phase === "finished" &&
                getWinnerName(this.props.room) &&
                "\uD83C\uDFC6 " + getWinnerName(this.props.room)}
            </p>
            <p className="language">
              {language.toUpperCase()}
              <br />
              {maxPlayers}
            </p>
          </div>
          <div className="tile-body">
            <p>
              {turnOrder
                ? turnOrder
                    .map((userId) =>
                      users
                        .find((user) => user.id === userId)
                        ?.name.replace(" ", " ")
                    )
                    .join(" • ")
                : // replace space with U+00A0, non-breaking space
                  users.map((user) => user.name.replace(" ", " ")).join(" • ")}
            </p>
          </div>
          {this.props.messagesCount[id] > 0 && (
            <div className="counter">{this.props.messagesCount[id]}</div>
          )}
        </div>
      </Link>
    );
  }
}
function MapStateToProps(state: RootState) {
  return {
    messagesCount: state.messagesCount,
  };
}
export default connect(MapStateToProps)(RoomTile);
