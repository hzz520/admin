import { SELECTEDITDATA } from '../actionTypes/index.actionTypes'
import {axiosAjax} from '../../utils/request'

export const selectEditData = (actionData) => (dispatch) => {
    dispatch({
        type: SELECTEDITDATA,
        actionData
    })
}

export const getGoodData = (goodId,fn) => (dispatch) => {
    axiosAjax({
        type: 'post',
        url: '/api/chat/getGoodData',
        data: {good_id:goodId},
        success: (res) => {
            let actionData = res.data
            dispatch({
                type: SELECTEDITDATA,
                actionData
            })
            fn && fn(res.data.good_imgs)
        }
    })
}