import React, { useEffect } from "react"
import { GameCards } from "../components/common"

//redux
import { useSelector, useDispatch } from "react-redux"
import { setOpponent } from "../redux/Game/GameAction"
import { RootState } from "../redux/store"
const Home = () => {
  const { game } = useSelector((state: RootState) => state)

  console.log(game)
  const dispatch = useDispatch()

  useEffect(() => {
    // @ts-ignore
    dispatch(setOpponent("Sourabh"))
  }, [])
  return (
    <div className="container pb-10">
      <h1 className="page__title">Currently Trending Games</h1>
      <GameCards />
    </div>
  )
}

export default Home
