import { PROJECTLIST } from '../actionTypes/index.actionTypes'

const projectList = (state = [{ project_id: '', project_name: '', project_cover: '' }], action) => {
    switch (action.type) {
        case PROJECTLIST:
            return action.actionData
        default:
            return state
    }
}

export default projectList