import React from 'react';
import { Game, User } from '../reducer/types';
import RoomTile from './RoomTile';
import TranslationContainer from './Translation/TranslationContainer';

type OwnProps = {
  gamesList: Game[];
  user: User | null;
  category: string;
};

function GamesTilesList(props: OwnProps) {
  return (
    <React.Fragment>
      {props.gamesList ? (
        props.gamesList.length > 0 && (
          <React.Fragment>
            <h3>
              <TranslationContainer translationKey={props.category} />
            </h3>
            <div className="rooms">
              {props.gamesList.map((game) => (
                <RoomTile key={game.id} room={game} user={props.user} />
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

export default GamesTilesList;
