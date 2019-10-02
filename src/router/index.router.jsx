import React, { Component } from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import store from '../redux/store/index.store'

const history = syncHistoryWithStore(hashHistory, store)

const rootRoutes = <Router history = { history }>
    <Route
        path='/'
        getComponent=
        {(nextState, cb)=> { require.ensure([], (require)=>{ cb(null, require('../container/enter').default) }, 'Enter') }}>
        <IndexRoute
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/enter/main').default)
            }, 'Main')
        }}/>
        <Route
            path='/system'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/system/user.permission').default)
            }, 'System')
        }}/>
        <Route path='/profile'>
            <IndexRoute
                getComponent={(nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../container/system/user.permission').default)
                }, 'System')
            }}/>
            <Route
                path='edit/:id'
                getComponent={(nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('../container/system/user.permission').default)
                }, 'System')
            }}/>
        </Route>
    </Route>
    <Route
        path='/login'
        getComponent=
        {(nextState,cb)=> { require.ensure([], (require)=>{ cb(null,require('../container/login').default) },'Login') }}/>
    <Route
        path='/:project'
        getComponent=
        {(nextState,cb)=> { require.ensure([], (require)=>{ cb(null,require('../container/shop/main').default) },'Shop') }}>
        <IndexRoute
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/goodsList').default)
            }, 'GoodsList')
        }}/>
        <Route
            path='goods_list'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/goodsList').default)
            }, 'GoodsList')
        }}/>
        <Route
            path='goods_edit/:type'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/goodsEdit').default)
            }, 'GoodsEdit')
        }}/>
        <Route
            path='project_config'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/config/project').default)
            }, 'ProjectConfig')
        }}/>
        <Route
            path='column_config'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/config/column').default)
            }, 'ColumnConfig')
        }}/>
        <Route
            path='activite_config'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/config/activite').default)
            }, 'ActiviteConfig')
        }}/>
        <Route
            path='recommend_config'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/config/recommend').default)
            }, 'RecommendConfig')
        }}/>
        <Route
            path='order'
            getComponent={(nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('../container/shop/order').default)
            }, 'OrderMange')
        }}/>
    </Route>
</Router>

export default rootRoutes