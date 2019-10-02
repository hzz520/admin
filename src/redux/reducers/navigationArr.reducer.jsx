import { NAVIGATION } from '../actionTypes/index.actionTypes'

const navigationArr = (state=[],action) => {
    switch (action.type) {
        case NAVIGATION:
            return action.actionData
        default:
            return state
    }
}

export default navigationArr