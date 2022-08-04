import { SET_OPPONENT } from "./GameTypes"

interface Action {
  type: String
  payload: Object
}

const initialState = {
  opponent: null,
}

export const gameReducer = (state = initialState, action: Action) => {
  const { type, payload } = action
  switch (type) {
    case SET_OPPONENT:
      return {
        ...state,
        opponent: payload,
      }
    default:
      return state
  }
}
