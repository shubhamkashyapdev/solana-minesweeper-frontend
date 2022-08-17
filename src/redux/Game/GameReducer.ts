import { OPPONENT_DETAILS, UPDATE_SCORE, PLAYER_BET_AMMOUNT } from "./GameTypes"

interface Action {
  type: String
  payload: any
}

const initialState = {
  opponent: null,
  score: 0,
  betAmount: 0,
}

export const gameReducer = (state = initialState, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case OPPONENT_DETAILS:
      return {
        ...state,
        opponent: payload,
      }
    case UPDATE_SCORE:
      return {
        ...state,
        score: payload,
      }
    case PLAYER_BET_AMMOUNT:
      return {
        ...state,
        betAmount: payload,
      }
    default:
      return state
  }
}
