import { SELECTEDITDATA } from '../actionTypes/index.actionTypes'

const selectEditData = (state={},action) => {
    switch (action.type) {
        case SELECTEDITDATA:
            return action.actionData
        default:
            return state
    }
}

export default selectEditData