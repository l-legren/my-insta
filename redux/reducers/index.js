import { combineReducers } from "redux";
import { user } from "./user";

const RootReducer = combineReducers({
    userState: user,
});

export default RootReducer;