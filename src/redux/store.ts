import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { gameReducer } from "./Game/GameReducer"
import { composeWithDevTools } from "@redux-devtools/extension"
// reducers //
const reducer = combineReducers({
  game: gameReducer,
})

const middleware = [thunk]

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export default store
