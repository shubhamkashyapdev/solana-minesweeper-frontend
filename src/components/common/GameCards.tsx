import React from "react";
import { Link } from "react-router-dom";

const GameCards = () => {
  return (
    <div className="flex justify-center space-y-4 md:justify-between items-center flex-wrap ">
      <Link to={'/minesweeper'}>
      <img
        className="h-[400px] md:h-[450px]"
        src="/assets/images/cards/minesweeper.png"
        />
        </Link>
      <img
        className="h-[400px] md:h-[450px]"
        src="/assets/images/cards/under-construction.png"
      />
      <img
        className="h-[400px] md:h-[450px]"
        src="/assets/images/cards/under-construction.png"
      />
    </div>
  );
};








export default GameCards;
