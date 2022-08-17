import { OPPONENT_DETAILS, UPDATE_SCORE, PLAYER_BET_AMMOUNT, PALYER_WALLET_ADDRESS, SOCKET_IO, DIFFICULTY_LEVEL } from "./GameTypes"

interface Action {
  type: String
  payload: any
}

const initialState = {
  opponent: null,
  score: 0,
  betAmount: 0,
  address: null,
  socket: null,
  level: 5,
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
    case PALYER_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: payload,
      }
    case SOCKET_IO:
      return {
        ...state,
        socket: payload,
      }
    case DIFFICULTY_LEVEL:
      return {
        ...state,
        level: payload,
      }
    default:
      return state
  }
}
