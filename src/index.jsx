import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import 'babel-polyfill'

import router from './router/index.router'
import store from './redux/store/index.store'

import '../libs/scss/globel.scss'

ReactDOM.render(
    <Provider 
        store={store}>
        { router }
    </Provider>, 
document.getElementById('root'))

