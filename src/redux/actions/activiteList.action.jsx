import { ACTIVITELIST } from '../actionTypes/index.actionTypes'
import { fn } from './common.action'
import { verifyData } from '../../constant/index.constant'

export const getActiviteList = (data) => (dispatch) => {
    fn(verifyData, data, '/api/chat/getActiviteList', ACTIVITELIST, dispatch)
}

export const addActivite = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/addActivite', ACTIVITELIST, dispatch, fun)
}

export const editActivite = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/editActivite', ACTIVITELIST, dispatch, fun)
}

export const removeActivite = (data) => (dispatch) => {
    fn(verifyData, data, '/api/chat/removeActivite', ACTIVITELIST, dispatch)
}