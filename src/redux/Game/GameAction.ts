import { OPPONENT_DETAILS, PLAYER_BET_AMMOUNT, UPDATE_SCORE } from "./GameTypes"

// @ts-ignore
export const setOpponentDetails = (opponent) => (dispatch, getState) => {
  dispatch({
    type: OPPONENT_DETAILS,
    payload: opponent,
  })
}

// @ts-ignore
export const updateScore = (score: number) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_SCORE,
    payload: score,
  })
}

// @ts-ignore
export const setBetAmount = (amount: number) => (dispatch, getState) => {
  dispatch({
    type: PLAYER_BET_AMMOUNT,
    payload: amount,
  })
}

