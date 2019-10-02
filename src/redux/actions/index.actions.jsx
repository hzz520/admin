import { LOGIN, NAVIGATION, BREADCRUMB, PROJECTLIST } from '../actionTypes/index.actionTypes'
import { axiosAjax, axiosFormData, superagentAjax } from '../../utils/request'
import $ from '../../utils/cookie'
import { hashHistory } from 'react-router'
import { message } from 'antd'
import { fn } from './common.action'
import { verifyData1 } from '../../constant/index.constant'

export const navigation = (actionData) => ({
    type:NAVIGATION,
    actionData
})

export const breadcrumb = (actionData) => ({
    type:BREADCRUMB,
    actionData
})

export const getUserInfo = () => (dispatch) => {
    fn(verifyData1, {}, '/api/chat/authenticate', LOGIN, dispatch)
}

export const authenticate = () => () =>  {
    if( !$.get('username') || !$.get('password') ) {
        $.delete('project_id',{})
        $.delete('project_name',{})
        if(hashHistory.getCurrentLocation().pathname !== '/login'){
            hashHistory.push('/login')
        }
    } else {
         if(hashHistory.getCurrentLocation().pathname === '/login')
            hashHistory.push('/')
    }
}


export const checkProject = () => () => {
    if(!$.get('project_id') || !$.get('project_name')) {
        hashHistory.push('/')
    }
}

export const login = (data) => (dispatch) => {
    fn([], data, '/api/chat/login', LOGIN, dispatch, (res) => {
        if(res.msg == '登录成功') {
            hashHistory.push('/')
        }
    })
}

export const loginOut = () => (dispatch) => {
    $.delete('username',{path:'/'})
    $.delete('password',{path:'/'})
    $.delete('project_id',{path:'/'})
    $.delete('project_name',{path:'/'})
    dispatch({
        type: LOGIN,
        actionData: ''
    })
    hashHistory.push('/login')
}

export const getProjectList = (data,fun,flag) => (dispatch) => {
    if (flag) {
        dispatch({
            type: PROJECTLIST,
            actionData: data
        })
        return
    }
    fn(verifyData1, data, '/api/chat/projectlist', PROJECTLIST, dispatch,fun)
}


export const projectEdit = (data) => (dispatch) => {
    let { files, field } = data
    superagentAjax({
       url:'/api/chat/projectEdit',
       field: field,
       files: files,
       success: (res) => {
            let actionData = res.data
            if (res.msg) {
                message.warning(res.msg)
                return
            }
            dispatch({
                type: PROJECTLIST,
                actionData
            })
       }
   }) 
}
