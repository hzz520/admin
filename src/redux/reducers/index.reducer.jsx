import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import loginInfo from './loginInfo.reducer'
import permissionList from './permissionList.reducer'
import projectList from './projectList.reducer'
import navigationArr from './navigationArr.reducer'
import breadcrumbArr from './breadcrumbArr.reducer'
import goodsList from './goodsListArr.reducer'
import columnList from './columList.reducer'
import activiteList from './activiteListArr.reducer'
import selectEditData from './selectEditData.reducer'


export default combineReducers(Object.assign({},{
    loginInfo,
    permissionList,
    projectList,
    navigationArr,
    breadcrumbArr,
    selectEditData,
    goodsList,
    columnList,
    activiteList,
    routing:routerReducer
}))