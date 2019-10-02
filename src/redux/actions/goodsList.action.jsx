import { GOODSLIST } from '../actionTypes/index.actionTypes'
import { fn } from './common.action'
import { verifyData } from '../../constant/index.constant'

export const getGoodsList = (data) => (dispatch) => {
    fn(verifyData, data, '/api/chat/getGoodsList', GOODSLIST, dispatch)
}

export const addGood = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/addGood', null, dispatch,fun)
}

export const editGood = (data,type,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/editGood', type, dispatch,fun)
}

export const editGoodsStatus = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/editGoodsStatus',GOODSLIST, dispatch, fun)
}

export const removeGoods = (data,fun) => (dispatch) => {
    fn(verifyData, data, '/api/chat/removeGoods', GOODSLIST, dispatch, fun)
}
