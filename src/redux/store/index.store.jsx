import {createStore, applyMiddleware} from 'redux';
import reducer from '../reducers/index.reducer';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension'
import logger from 'redux-logger'
import {routerMiddleware} from 'react-router-redux'
import {hashHistory} from 'react-router'

let middlewares = []
const router = routerMiddleware(hashHistory)
middlewares.push(thunk)

process.env.NODE_ENV !== 'production' ? middlewares.push(logger) : null

export default createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(...middlewares)
    )
)
