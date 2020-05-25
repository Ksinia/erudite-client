import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import GameContainer from "./GameContainer";

type MatchParams = { game: string };

type Props = RouteComponentProps<MatchParams>;

class GameHandler extends Component<Props> {
  render() {
    const gameId = parseInt(this.props.match.params.game);
    return (
      <GameContainer
        history={this.props.history}
        key={gameId}
        gameId={gameId}
      />
    );
  }
}

export default GameHandler;
