import {
    USERS_POSTS_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
} from "../constants";

const initialState = {
    usersLoaded: 0,
    posts: [],
};

// export { USERS_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants";

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser,
            };
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts,
            };
        default:
            return state;
    }
};
