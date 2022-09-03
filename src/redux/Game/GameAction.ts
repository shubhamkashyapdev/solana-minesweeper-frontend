import {
  DIFFICULTY_LEVEL,
  GAME_RENDER,
  OPPONENT_DETAILS,
  PALYER_WALLET_ADDRESS,
  PLAYER_BET_AMMOUNT,
  RESET_TIME,
  SET_TIME,
  SOCKET_IO,
  UPDATE_SCORE,
  UPDATE_WINNER,
} from "./GameTypes";

// @ts-ignore
export const setOpponentDetails = (opponent) => (dispatch, getState) => {
  dispatch({
    type: OPPONENT_DETAILS,
    payload: opponent,
  });
};

// @ts-ignore
export const updateScore = (score: number) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_SCORE,
    payload: score,
  });
};

// @ts-ignore
export const setDifficultyLevel = (level: number) => (dispatch, getState) => {
  dispatch({
    type: DIFFICULTY_LEVEL,
    payload: level,
  });
};

// @ts-ignore
export const setBetAmount = (amount: number) => (dispatch, getState) => {
  dispatch({
    type: PLAYER_BET_AMMOUNT,
    payload: amount,
  });
};

// @ts-ignore
export const setWalletAddress = (address: string) => (dispatch, getState) => {
  dispatch({
    type: PALYER_WALLET_ADDRESS,
    payload: address,
  });
};

// @ts-ignore
export const setSocketIO = (socket: any) => (dispatch, getState) => {
  dispatch({
    type: SOCKET_IO,
    payload: socket,
  });
};
interface Opponent {
  amount: number;
  level: number;
  socketId: string;
  userId: string;
  _id: string;
  _v?: number;
  roomId: string;
  transactionId: string;
}
// @ts-ignore
export const gameEnded = () => (dispatch, getState) => {
  // @ts-ignore
  const { socket, opponent, score } = getState((state) => state.game);
  const opponentPlayer: Opponent = opponent;
  socket.emit(
    "updateScore",
    opponentPlayer.roomId,
    opponentPlayer.transactionId,
    score
  );
};

export const updateWinner =
  (walletAddress: string[]) => (dispatch: any, getState: any) => {
    dispatch({
      type: UPDATE_WINNER,
      payload: walletAddress,
    });
  };
export const gameRender = () => (dispatch: any, getState: any) => {
  dispatch({
    type: GAME_RENDER,
  });
};

export const setTime = () => (dispatch: any, getState: any) => {
  dispatch({
    type: SET_TIME,
  })
}
export const resetTime = () => (dispatch: any, getState: any) => {
  dispatch({
    type: RESET_TIME,
  })
}
