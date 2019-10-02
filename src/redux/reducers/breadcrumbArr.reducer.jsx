import { BREADCRUMB } from '../actionTypes/index.actionTypes'

const breadcrumbArr = (state=[],action) => {
    switch (action.type) {
        case BREADCRUMB:
            return action.actionData
        default:
            return state
    }
}

export default breadcrumbArr