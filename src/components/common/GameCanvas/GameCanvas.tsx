import React, { useEffect, useState } from "react";
import Game from "../../game/view/game-view";
import GameForm from "../../game/form/game-form";
import "./GameCanvas.scss";
import { useSelector } from "react-redux";

const GameCanvas = () => {
  const [isgame, setgame] = useState(false);

  //@ts-ignore
  const { game } = useSelector((state) => state.game);
  console.log({ game });

  useEffect(() => {
    console.log("//////////////// game reset /////////////////////");
    setgame(game);
  }, [game]);

  return (
    <div className="content ">
      <div className="gameBorder ">
        <div className="Game">
          <Game></Game>
          <GameForm />
        </div>
      </div>
    </div>
  );
};

export default GameCanvas;
