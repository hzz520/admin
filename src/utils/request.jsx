import axios from 'axios'
import superagent from 'superagent'
import { message } from 'antd'
import { hashHistory } from 'react-router'

export const axiosAjax = (info) => {
    let {type,url,params,data,success} = info
    axios({
        method:type,
        url:url,
        params:params,
        data:data
    }).then((response)=>{
        let data = response.data
        if(data.code == 200){
            success.call(this,data)
        } else if (data.code == 101) {
            hashHistory.push('/login')
        }
    }).catch((err)=>{
        message.error(err)
    })
}

export const axiosFormData = (info) => {
    let {type,url,params,data,success} = info

    axios({
        method:type,
        url:url,
        params:params,
        data:data,
        headers: {'Content-Type': 'multipart/form-data'}
    }).then((response)=>{
        let data = response.data
        if(data.code==200){
            success.call(this,data)
        }
    }).catch((err)=>{
        message.error(err)
    })
}

export const superagentAjax = (info) => {
    let { field, files, url, success } = info 
    let request = superagent.post(url).field('data',JSON.stringify(field))
    
    files.map((file, i) => {
        file.originFileObj ? request = request.attach(`files`,file.originFileObj) : null
    })
    request.then((res) => {
        if(res.status === 200)
            success.call(this,res.body)
    }).catch((err) => {
        message.warning(err)
    })
}

