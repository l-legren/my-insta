import { combineReducers } from "redux";
import { user } from "./user";
import { users } from "./users";

const RootReducer = combineReducers({
    userState: user,
    userLoaded: users
});

export default RootReducer;