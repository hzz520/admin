import { ACTIVITELIST } from '../actionTypes/index.actionTypes'

const activiteList = (state = { total: 0, current: 1, data: [] }, action) => {
    switch (action.type) {
        case ACTIVITELIST:
            const temp = []
            action.actionData.data.map((d, i) => {
                temp.push({ ...d, key: i })
            })
            const newState = { ...action.actionData, data: temp }
            return newState
        default:
            return state
    }
}

export default activiteList
