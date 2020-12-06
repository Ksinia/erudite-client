import React from "react";
import { Game, User } from "../reducer/types";
import RoomTile from "./RoomTile";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  finishedGames: Game[];
  user: User;
};

function FinishedGames(props: OwnProps) {
  return (
    <React.Fragment>
      {props.finishedGames ? (
        props.finishedGames.length > 0 && (
          <React.Fragment>
            <h3>
              <TranslationContainer translationKey="finished" />
            </h3>
            <div className="rooms">
              {props.finishedGames.map((game) => (
                <RoomTile
                  key={game.id}
                  room={game}
                  user={props.user}
                  userTurn={false}
                />
              ))}
            </div>
          </React.Fragment>
        )
      ) : (
        <TranslationContainer translationKey="loading" />
      )}
    </React.Fragment>
  );
}

export default FinishedGames;
