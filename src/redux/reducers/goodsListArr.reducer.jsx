import { GOODSLIST } from '../actionTypes/index.actionTypes'

const goodsList = (state={total:0, current:1, data:[]},action) => {
    switch (action.type) {
        case GOODSLIST:
            let temp = []
            action.actionData.data.map((d, i)=>{
                temp.push({...d,key:d.good_id})
            })
            let newState = {...action.actionData,data:temp}
            return newState
        default:
            return state
    }
}

export default goodsList