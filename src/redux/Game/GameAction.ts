import { DIFFICULTY_LEVEL, OPPONENT_DETAILS, PALYER_WALLET_ADDRESS, PLAYER_BET_AMMOUNT, SOCKET_IO, UPDATE_SCORE } from "./GameTypes"

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
export const setDifficultyLevel = (level: number) => (dispatch, getState) => {
  dispatch({
    type: DIFFICULTY_LEVEL,
    payload: level,
  })
}

// @ts-ignore
export const setBetAmount = (amount: number) => (dispatch, getState) => {
  dispatch({
    type: PLAYER_BET_AMMOUNT,
    payload: amount,
  })
}

// @ts-ignore
export const setWalletAddress = (address: string) => (dispatch, getState) => {
  dispatch({
    type: PALYER_WALLET_ADDRESS,
    payload: address,
  })
}

// @ts-ignore
export const setSocketIO = (socket: any) => (dispatch, getState) => {
  dispatch({
    type: SOCKET_IO,
    payload: socket,
  })
}
