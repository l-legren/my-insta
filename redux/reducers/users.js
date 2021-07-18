import {
    USERS_POSTS_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
} from "../constants";

const initialState = {
    users: [],
    usersLoaded: 0,
};

// export { USERS_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants";

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user],
                // usersLoaded: state.usersLoaded + 1,
            };
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                users: state.users.map((user) =>
                    user.id === action.uid
                        ? { ...user, posts: action.posts }
                        : user
                ),
            };
        default:
            return state;
    }
};