import React, { useEffect } from "react";
import { GameCards, HomeInfoBox } from "../components/common";

//redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
const Home = () => {
  const { game } = useSelector((state: RootState) => state);
  return (
    <div className="container pb-10">
      <h1 className="page__title">Currently Trending Games</h1>
      <GameCards />
      <HomeInfoBox />
    </div>
  );
};

export default Home;
