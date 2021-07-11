const initialState = {
    currentUser: null,
}

export {USER_STATE_CHANGE} from '../constants'

export const user = (state = initialState, action) => {

    return {
        ...state,
        currentUser: action.currentUser
    }
}