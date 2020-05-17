import React from "react";
import { Link } from "react-router-dom";
import TranslationContainer from "./Translation/TranslationContainer";

type OwnProps = {
  finishedGamesIds: number[];
};

function FinishedGames(props: OwnProps) {
  return (
    <React.Fragment>
      {props.finishedGamesIds ? (
        props.finishedGamesIds.length > 0 && (
          <React.Fragment>
            <h3>
              <TranslationContainer translationKey="finished" />
            </h3>
            {props.finishedGamesIds.map((id) => (
              <div key={id}>
                <Link to={`/game/${id}`}>
                  <TranslationContainer translationKey="game" /> {id}
                </Link>
              </div>
            ))}
          </React.Fragment>
        )
      ) : (
        <TranslationContainer translationKey="loading" />
      )}
    </React.Fragment>
  );
}

export default FinishedGames;
