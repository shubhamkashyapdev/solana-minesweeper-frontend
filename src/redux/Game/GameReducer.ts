import {
  OPPONENT_DETAILS,
  UPDATE_SCORE,
  PLAYER_BET_AMMOUNT,
  PALYER_WALLET_ADDRESS,
  SOCKET_IO,
  DIFFICULTY_LEVEL,
  UPDATE_WINNER,
  GAME_RENDER,
  RESET_TIME,
  SET_TIME,
} from "./GameTypes";

interface Action {
  type: String;
  payload: any;
}

const initialState = {
  opponent: null,
  score: 0,
  betAmount: 0,
  address: null,
  socket: null,
  level: 5,
  winnerArr: [],
  game: false,
  time: 180, // 3min - 180sec
};

export const gameReducer = (state = initialState, action: Action) => {
  const { type, payload } = action;
  switch (type) {
    case OPPONENT_DETAILS:
      return {
        ...state,
        opponent: payload,
      };
    case UPDATE_SCORE:
      return {
        ...state,
        score: payload,
      };
    case PLAYER_BET_AMMOUNT:
      return {
        ...state,
        betAmount: payload,
      };
    case PALYER_WALLET_ADDRESS:
      return {
        ...state,
        walletAddress: payload,
      };
    case SOCKET_IO:
      return {
        ...state,
        socket: payload,
      };
    case DIFFICULTY_LEVEL:
      return {
        ...state,
        level: payload,
      };
    case UPDATE_WINNER:
      return {
        ...state,
        winnerArr: [...state.winnerArr, ...payload],
      };

    case GAME_RENDER:
      return {
        ...state,
        game: !state.game,
      };
    case SET_TIME:
      return {
        ...state,
        time: state.time - 1
      }
    case RESET_TIME:
      return {
        ...state,
        time: 180,
      }
    default:
      return state;
  }
};
