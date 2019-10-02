import { axiosAjax } from '../../utils/request'

export const removeImg = (url,good_id,type,newUrl) => () => {
    let data
    switch (type) {
        case 'good':
            data = {
                url:url, 
                good_id: good_id
            }
            break
        case 'project': 
            data = {
                url:url,
                newUrl: newUrl, 
                project_id: good_id
            }
            break
        default:
            data = {
               url:url, 
               good_id: good_id
            }
            break
    }
    axiosAjax({
        type: 'post',
        url: '/api/chat/removeImg',
        data:data
    })
}