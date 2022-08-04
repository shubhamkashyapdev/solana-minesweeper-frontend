import { SET_OPPONENT } from "./GameTypes"

// @ts-ignore
export const setOpponent = (opponent) => (dispatch, getState) => {
  dispatch({
    type: SET_OPPONENT,
    payload: opponent,
  })
}
