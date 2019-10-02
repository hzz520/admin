import { COLUMNLIST } from '../actionTypes/index.actionTypes'

const columnList = (state={total:0, current:1, data:[]}, action) => {
    switch (action.type) {
        case COLUMNLIST:
            let temp = []
            action.actionData.data.map((d, i)=>{
                temp.push({...d,key:i})
            })
            let newState = {...action.actionData,data:temp}
            return newState
        default:
            return state
    }
}

export default columnList