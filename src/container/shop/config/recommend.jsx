import React,{ Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Form  } from 'antd'

class recommendConfig extends Component {
    constructor (props) {
        super(props)
    }
    
    render () {
        return (
            <div dangerouslySetInnerHTML={{
                __html: '<p style="width:100%;height:40px;line-height:40px;color:red;text-align:center">123</p>'
            }}></div>
        )
    }
}

const mapStateToProps = (state) => ({
    activiteList: state.activiteList,
    selectEditData: state.selectEditData
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ },dispatch)
})


export default  connect(mapStateToProps, mapDispatchToProps)(Form.create()(recommendConfig))