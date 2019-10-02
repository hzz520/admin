import { LOGIN } from '../actionTypes/index.actionTypes'

const loginInfo = (state={username:'',password:''},action) => {
    switch (action.type) {
        case LOGIN:
            return action.actionData
        default:
           return state
    }
}

export default  loginInfo