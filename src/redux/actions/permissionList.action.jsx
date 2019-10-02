import { PERMISSIONLIST } from '../actionTypes/index.actionTypes'
import { axiosAjax } from '../../utils/request'
import $ from '../../utils/cookie'

export const getPermissionList = () => (dispatch) => {
    if (!$.get('username')) {
        return 
    }
    axiosAjax({
        type:'post',
        url:'/api/chat/permissonlist',
        success:(data) => {
            const actionData = []
            data.data.map((d,i)=>{
                actionData.push({...d,key:i})
            })
            dispatch({
                type: PERMISSIONLIST,
                actionData
            })
        }
    })
}