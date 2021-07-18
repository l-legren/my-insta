import { combineReducers } from "redux";
import { user } from "./user";
import { users } from "./users";

const RootReducer = combineReducers({
    userState: user,
    usersState: users
});

export default RootReducer;