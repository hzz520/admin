import { COLUMNLIST } from '../actionTypes/index.actionTypes'
import { fn } from './common.action'
import { verifyData } from '../../constant/index.constant'

export const getColumnList = (data) => (dispatch) => {
    fn(verifyData, data, '/api/chat/getColumnList', COLUMNLIST, dispatch)
}

export const addColumn = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/addColumn', COLUMNLIST, dispatch, fun)
}

export const editColumn = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/editColumn', COLUMNLIST, dispatch, fun)
}

export const removeColumn = (data) => (dispatch) => {
    fn(verifyData, data, '/api/chat/removeColumn', COLUMNLIST, dispatch)
}