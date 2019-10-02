import { PERMISSIONLIST } from '../actionTypes/index.actionTypes'

const permissionList = (state=[],action) => {
    switch (action.type) {
        case PERMISSIONLIST:
            return action.actionData
    
        default:
            return state
    }
}

export default permissionList