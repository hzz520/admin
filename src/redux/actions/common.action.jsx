import $ from '../../utils/cookie'
import { axiosAjax, superagentAjax } from '../../utils/request'
import { message } from 'antd'
import { hashHistory } from 'react-router'

export const fn = ( verifyData, data, url, type, dispatch, fun) => {
    if (verify(verifyData) === true) {
        hashHistory.push('/login')
        return
    }
    if(Object.prototype.toString.call(data) === '[object Object]'){
        if ( data.field || data.files) {
            let { files, field } = data
            superagentAjax({
                url:url,
                field:field,
                files:files,
                success: (res) => {
                    let actionData = res.data
                    res.msg && message.warning(res.msg)
                    type && dispatch({
                        type: type,
                        actionData
                    })
                    fun && fun(res)
                }
            })
            return
        } 
    }
    axiosAjax({
        type: 'post',
        url: url,
        data:data,
        success: (res) => {
            let actionData = res.data
            res.msg && message.warning(res.msg)
            type && dispatch({
                type: type,
                actionData
            })
            fun && fun(res)
        }
    })
}

export const verify = (data) => {
    var flag = false
    if(data != undefined && data.length ===0) {
        return flag
    } else if(data != undefined && data.length > 0){
        for(var i = 0; i < data.length; i++) {
            if(!$.get(data[i])) {
                flag = true
                break
            }
        }
        return flag
    }
}